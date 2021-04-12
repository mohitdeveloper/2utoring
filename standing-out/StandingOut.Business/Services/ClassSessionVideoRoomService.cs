using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using StandingOut.Shared.Helpers.Twilio;
using System.IO;
using System.Net;

namespace StandingOut.Business.Services
{
    public class ClassSessionVideoRoomService : IClassSessionVideoRoomService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
		private readonly AppSettings _AppSettings;
        private readonly ITwilioHelper _TwilioHelper;
        private bool _Disposed;

        public ClassSessionVideoRoomService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, 
            IOptions<AppSettings> appSettings, ITwilioHelper twilioHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
			_AppSettings = appSettings.Value;
            _TwilioHelper = twilioHelper;
        }

		public ClassSessionVideoRoomService(IUnitOfWork unitOfWork, AppSettings appSettings)
        {
            _UnitOfWork = unitOfWork;
            _AppSettings = appSettings;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<List<Models.ClassSessionVideoRoom>> Get()
        {
            return await _UnitOfWork.Repository<Models.ClassSessionVideoRoom>().Get();
        }

        public async Task<List<IGrouping<string, Models.ClassSessionVideoRoom>>> Get(Guid classSessionId)
        {
            var data = await _UnitOfWork.Repository<Models.ClassSessionVideoRoom>().Get(o => o.ClassSessionId == classSessionId, includeProperties: "User");
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            foreach (var videocall in data)
            {
                if (!string.IsNullOrEmpty(videocall.CompositionSid) && !videocall.CompositionDownloadReady)
                {
                    var embelished = _TwilioHelper.EmbelishRecording(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, videocall);
                    videocall.Duration = embelished.Duration;
                    videocall.CompositionDownloadReady = embelished.CompositionDownloadReady;
                    await Update(videocall);
                }
            }

            var result = data.GroupBy(o => o.RoomSid);
            return result.ToList();
        }

        public async Task<Models.ClassSessionVideoRoom> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.ClassSessionVideoRoom>().GetSingle(o => o.ClassSessionVideoRoomId == id);
        }

        public async Task<Models.ClassSessionVideoRoom> Create(Models.ClassSessionVideoRoom model)
        {
            await _UnitOfWork.Repository<Models.ClassSessionVideoRoom>().Insert(model);
            return model;
        }

        public async Task<Models.ClassSessionVideoRoom> Update(Models.ClassSessionVideoRoom model)
        {
            await _UnitOfWork.Repository<Models.ClassSessionVideoRoom>().Update(model);
            return model;
        }

        public async Task Delete(Guid id)
        {
            var model = await GetById(id);
            model.IsDeleted = true;
            await Update(model);
        }

        public async Task<Stream> DownloadMediaCombined(Guid id)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();
            var classSessionVideoRoom = await GetById(id);

            var audioDownloadurl = _TwilioHelper.GetDownload(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid, "audio");
            var videoDownloadurl = _TwilioHelper.GetDownload(settings.TwilioAccountSid, settings.TwilioAuthToken, settings.TwilioApiKey, settings.TwilioApiSecret, classSessionVideoRoom.RoomSid, classSessionVideoRoom.ParticipantSid, "video");

            Byte[] bytes;

            WebRequest req = WebRequest.Create(audioDownloadurl);
            WebResponse response = req.GetResponse();
            Stream dataStream = response.GetResponseStream();

           // bytes.wr

            return dataStream;
        }
    }
}

