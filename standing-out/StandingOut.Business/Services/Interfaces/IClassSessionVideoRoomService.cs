using System;
using System.Collections.Generic;
using Models = StandingOut.Data.Models;
using System.Threading.Tasks;
using System.Linq;
using System.IO;

namespace StandingOut.Business.Services.Interfaces
{
    public interface IClassSessionVideoRoomService : IDisposable
    {
        Task<List<Models.ClassSessionVideoRoom>> Get();
        Task<List<IGrouping<string, Models.ClassSessionVideoRoom>>> Get(Guid classSessionId);
        Task<Models.ClassSessionVideoRoom> GetById(Guid id);
        Task<Models.ClassSessionVideoRoom> Create(Models.ClassSessionVideoRoom model);
        Task<Models.ClassSessionVideoRoom> Update(Models.ClassSessionVideoRoom model);
        Task Delete(Guid id);
        Task<Stream> DownloadMediaCombined(Guid id);
    }
}

