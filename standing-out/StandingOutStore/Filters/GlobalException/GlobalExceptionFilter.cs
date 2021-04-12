using StandingOutStore.Business.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Filters.GlobalException
{
    public class GlobalExceptionFilter : IExceptionFilter, IDisposable
    {
        private readonly ILogger _logger;
        private readonly IErrorLogService _errorLogService;
        private readonly IHostEnvironment _environment;

        public GlobalExceptionFilter(ILoggerFactory loggerFactory, IErrorLogService errorLogService, IHostEnvironment env)
        {
            if (loggerFactory == null)
            {
                throw new ArgumentNullException(nameof(loggerFactory));
            }

            _logger = loggerFactory.CreateLogger(this.GetType());
            _errorLogService = errorLogService;
            _environment = env;
        }

        public void Dispose()
        {
            GC.Collect();
        }

        public void OnException(ExceptionContext context)
        {
            //get the last server error
            var ex = context.Exception;

            var err = new Models.ErrorLog()
            {
                Message = ex.Message,
                LogDate = DateTime.Now,
                StackTrace = ex.StackTrace,
                Path = context.HttpContext.Request.Path.HasValue ? context.HttpContext.Request.Path.Value : "Unknown",
            };

            if (ex.InnerException != null && !String.IsNullOrWhiteSpace(ex.InnerException.Message))
            {
                err.InnerException = ex.InnerException.Message;
                err.InnerStackTrace = ex.InnerException.StackTrace;
            }

            //Wait for the result due to filters not having async capabilities
            err = _errorLogService.Log(err).Result;
            //Log.Error($"Error Occurred ErrorLog ID: '{err.Id}'");

            //If this is an API call we should return JSON rather than a view
            if (context.HttpContext.Request.Path.HasValue && context.HttpContext.Request.Path.Value.ToLower().Contains("/api/"))
            {
                context.HttpContext.Response.ContentType = "application/json";
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                context.Result = new JsonResult(new DTO.ErrorResponse()
                {
                    Code = context.HttpContext.Response.StatusCode.ToString(),
                    Message = !_environment.IsDevelopment() ? "Internal Server Error" : ex.Message,
                    StackTrace = !_environment.IsDevelopment() ? "" : ex.StackTrace
                });
            }
            else
            {
                context.Result = new ViewResult
                {
                    ViewName = "~/Views/Shared/Error.cshtml",
                };
            }
        }
    }
}
