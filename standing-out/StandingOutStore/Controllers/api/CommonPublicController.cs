using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Shared.Mapping;
using StandingOutStore.Extensions;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/CommonPublic")]
    public class CommonPublicController : ControllerBase
    {
        private readonly ICommonPublicService _CommonPublicService;
        private IWebHostEnvironment _hostingEnvironment;
        public CommonPublicController(ICommonPublicService commonPublicService, IWebHostEnvironment environment)
        {
            _CommonPublicService = commonPublicService;
            _hostingEnvironment = environment;


        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] DTO.EmailModel model)
        {
            var returnObject = await _CommonPublicService.SendMessage(model);
            return Ok(returnObject);
        }

        //This code for testing purpose on https://test.2utoring.com/
        /*
        [HttpPost("updateCourse")]
        public async Task<IActionResult> UpdateCourse([FromBody] DTO.UpdateModel model)
        {
            var returnObject = await _CommonPublicService.UpdateCourse(model);
            return Ok(returnObject);
        }
        [HttpPost("updateClassSession")]
        public async Task<IActionResult> UpdateClassSession([FromBody] DTO.UpdateModel model)
        {
            var returnObject = await _CommonPublicService.UpdateClassSession(model);
            return Ok(returnObject);
        }

        [HttpGet("getErrorLog")]
        public async Task<IActionResult> GetErrorLog()
        {

            #region Custom Log

            //try
            //{
            //    string folder = @"C:\AppLog\";
            //    bool folderExists = System.IO.Directory.Exists(folder);
            //    string fileName = "Log.txt";
            //    if(!folderExists)
            //    {
            //        System.IO.Directory.CreateDirectory(folder);
            //    }
            //    string fullPath = folder + fileName;

            //    if (!System.IO.File.Exists(fullPath))
            //    {
            //       System.IO.File.Create(fullPath);
            //        using (System.IO.StreamWriter writer = new System.IO.StreamWriter(fullPath))
            //        {
            //            writer.WriteLine("this is new file create");
            //        }
            //    }
            //    else
            //    {
            //        using (System.IO.StreamWriter sw = System.IO.File.AppendText(fullPath))
            //        {
            //            sw.WriteLine("This");
            //            sw.WriteLine("is Extra");
            //            sw.WriteLine("Text");
            //        }
            //    }


            //}
            //catch (Exception Ex)
            //{
               
            //}
            #endregion

            var returnObject = await _CommonPublicService.GetErrorLog();
            return Ok(returnObject);
        }

        [HttpPost("updateStripPlan")]
        public async Task<IActionResult> UpdateStripPlan([FromBody] DTO.UpdateStripPlanModel model)
        {
            var returnObject = await _CommonPublicService.UpdateStripPlan(model);
            return Ok(returnObject);
        }

        //[HttpPost("ImageUpload")]
        //public async Task<IActionResult> Upload(ICollection<IFormFile> files)
        //{
        //    string uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
        //    foreach (IFormFile file in files)
        //    {
        //        if (file.Length > 0)
        //        {
        //            string filePath = Path.Combine(uploads, file.FileName);
        //            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await file.CopyToAsync(fileStream);
        //            }
        //        }
        //    }

        //    if (Request.Form.Files[0].Length > 0)
        //    {
        //        string folder = @"C:\Images\";
        //        bool folderExists = System.IO.Directory.Exists(folder);
               
        //        if (!folderExists)
        //        {
        //            System.IO.Directory.CreateDirectory(folder);
        //        }
        //        string fullPath = folder + Request.Form.Files[0].FileName;
        //        //string filePath = Path.Combine(uploads, Request.Form.Files[0].FileName);
        //        using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
        //        {
        //            await Request.Form.Files[0].CopyToAsync(fileStream);
        //        }
        //    }

        //    return Ok();
        //}
        */
    }
}

