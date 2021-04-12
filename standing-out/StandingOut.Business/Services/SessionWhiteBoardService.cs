using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using StandingOut.Shared.Helpers.AzureFileHelper;
using Mapping = StandingOut.Shared.Mapping;
using StandingOut.Shared.Helpers.GoogleHelper;
using Stripe.Checkout;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace StandingOut.Business.Services
{
    public class SessionWhiteBoardService : ISessionWhiteBoardService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly IAzureFileHelper _AzureFileHelper;
        private readonly IGoogleHelper _GoogleHelper;
        private bool _Disposed;

        public SessionWhiteBoardService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, 
            IHttpContextAccessor httpContext, IAzureFileHelper azureFileHelper,
            IGoogleHelper googleHelper)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AzureFileHelper = azureFileHelper;
            _GoogleHelper = googleHelper;
        }

        public SessionWhiteBoardService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<Models.SessionGroup> Create(Models.SessionGroup sessionGroup)
        {
            // Attempt to get a whiteboard to size up this one appropriately
            var templateWhiteboard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>()
                .GetQueryable(x => x.ClassSessionId == sessionGroup.ClassSessionId && x.SessionGroupId == null && x.UserId == null)
                .AsNoTracking()
                .Select(x => new { SizeX = x.SizeX, SizeY = x.SizeY })
                .FirstOrDefaultAsync();
            // Create the whiteboard
            var groupWhiteBoard = new Models.SessionWhiteBoard()
            {
                ClassSessionId = sessionGroup.ClassSessionId,
                SessionGroupId = sessionGroup.SessionGroupId,
                Name = sessionGroup.Name,
                SizeX = templateWhiteboard == null ? 2000 : templateWhiteboard.SizeX, 
                SizeY = templateWhiteboard == null ? 2000 : templateWhiteboard.SizeY
            };
            sessionGroup.SessionWhiteBoards.Add(groupWhiteBoard);
            await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Insert(groupWhiteBoard);
            return sessionGroup;
        }

        public async Task<List<DTO.SessionWhiteBoard>> GetMyWhiteBoards(Guid classSessionId, int sizeX, int sizeY)
        {
            // Ensures the whiteboard has size - if not sets default 300x300
            if (sizeX < 1)
                sizeX = 300;
            if (sizeY < 1)
                sizeY = 300;

            var results = new List<DTO.SessionWhiteBoard>();
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);
            var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.ClassSessionId == classSessionId && o.UserId == user.Id);

            // session whiteboard
            var sessionWhiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.ClassSessionId == classSessionId && string.IsNullOrEmpty(o.UserId) && o.SessionGroupId == null && o.IsInactive == false, includeProperties: "History");
            if (sessionWhiteBoard == null)
            {
                sessionWhiteBoard = new Models.SessionWhiteBoard() { ClassSessionId = classSessionId, Name = "All", SizeX = sizeX, SizeY = sizeY };
                await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Insert(sessionWhiteBoard);
            }
            results.Add(Mapping.Mappings.MapWhiteBoard(sessionWhiteBoard));
            results[results.Count - 1].WriteDisabled = user.TutorId.HasValue ? false : !sessionAttendee.AllWhiteboardActive;

            if (user.TutorId.HasValue == false && sessionAttendee.SessionGroupId.HasValue)
            {
                // group whiteboard
                var groupWhiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.SessionGroupId == sessionAttendee.SessionGroupId && o.IsInactive == false, includeProperties: "History");
                if (groupWhiteBoard == null)
                {
                    var group = await _UnitOfWork.Repository<Models.SessionGroup>().GetSingle(x => x.SessionGroupId == sessionAttendee.SessionGroupId);
                    groupWhiteBoard = new Models.SessionWhiteBoard() { ClassSessionId = classSessionId, SessionGroupId = sessionAttendee.SessionGroupId, Name = group.Name, SizeX = sizeX, SizeY = sizeY };
                    await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Insert(groupWhiteBoard);
                }
                results.Add(Mapping.Mappings.MapWhiteBoard(groupWhiteBoard));
                results[results.Count - 1].WriteDisabled = user.TutorId.HasValue ? false : !sessionAttendee.GroupWhiteboardActive;
            }

            // individual boards
            var individualWhiteBoards = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Get(o => o.ClassSessionId == classSessionId && o.UserId == user.Id && o.IsInactive == false, includeProperties: "History");
            if (individualWhiteBoards == null || individualWhiteBoards.Count == 0)
            {
                var individualWhiteBoard = new Models.SessionWhiteBoard() { ClassSessionId = classSessionId, UserId = user.Id, Name = "Individual", SizeX = sizeX, SizeY = sizeY };
                await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Insert(individualWhiteBoard);
                results.Add(Mapping.Mappings.MapWhiteBoard(individualWhiteBoard));
            }
            else
            {
                results.AddRange(Mapping.Mappings.MapWhiteBoard(individualWhiteBoards));
            }

            // shared boards
            var sharedWhiteBoards = await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().Get(o => o.UserId == user.Id && o.SessionWhiteBoard.SessionGroupId == null && o.SessionWhiteBoard.IsInactive == false && o.ClassSessionId == classSessionId, includeProperties: "SessionWhiteBoard, SessionWhiteBoard.History, User");

            for (var i = sharedWhiteBoards.Count - 1; i >= 0; i--)
            {
                if (sharedWhiteBoards[i].SessionWhiteBoard.UserId == user.Id)
                {
                    for (var j = 0; j < results.Count; j++)
                    {
                        if (results[j].SessionWhiteBoardId == sharedWhiteBoards[i].SessionWhiteBoardId)
                        {
                            results[j].WriteDisabled = !sharedWhiteBoards[i].WritePermissions;
                            sharedWhiteBoards.RemoveAt(i);
                            break;
                        }
                    }
                }
            }

            var sharedDto = Mapping.Mappings.MapWhiteBoard(sharedWhiteBoards.Select(x => x.SessionWhiteBoard));
            for (int i = 0; i < sharedDto.Count; i++)
                sharedDto[i].WriteDisabled = !sharedWhiteBoards[i].WritePermissions;

            return results.Concat(sharedDto).ToList();
        }

        public async Task<Models.SessionWhiteBoard> GetFullWhiteBoard(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.SessionWhiteBoardId == id, includeProperties: "History");
        }

        public async Task<Models.SessionWhiteBoard> GetWhiteBoard(Guid id)
        {
            return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.SessionWhiteBoardId == id);
        }

        public async Task<Models.SessionWhiteBoardHistory> AddCommand(Guid classSessionId, DTO.SessionWhiteBoardHistory model)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);
            var toAdd = new Models.SessionWhiteBoardHistory() { SessionWhiteBoardId = model.SessionWhiteBoardId, UserId = user.Id, HistoryType = model.HistoryType, JsonData = model.JsonData, LogDate = DateTime.Now };
            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(toAdd);
            return toAdd;
        }

        public async Task<List<Models.SessionWhiteBoardHistory>> AddLoadCommand(Guid classSessionId, Guid sessionWhiteBoardId, string userId, DTO.LoadCommand model)
        {
            var sessionWhiteBoardSave = await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().GetQueryable().AsNoTracking()
                .FirstOrDefaultAsync(x => x.SessionWhiteBoardSaveId == model.SessionWhiteBoardSaveId);

            List<Models.SessionWhiteBoardHistory> listHistory = new List<Models.SessionWhiteBoardHistory>();
            var historyResize = new Models.SessionWhiteBoardHistory()
            {
                JsonData = JsonConvert.SerializeObject(new DTO.WhiteBoardDataAutoResize()
                {
                    Type = "resize",
                    Cords = new List<DTO.WhiteboardDataCordsAutoResize>()
                    {
                        new DTO.WhiteboardDataCordsAutoResize()
                        {
                            Last_mousex = model.SizeX,
                            Last_mousey = model.SizeY,
                            Mousex = sessionWhiteBoardSave.SizeX,
                            Mousey = sessionWhiteBoardSave.SizeY
                        }
                    }
                }),
                HistoryType = "resize",
                UserId = userId,
                SessionWhiteBoardId = sessionWhiteBoardId,
                LogDate = DateTime.Now
            };
            var historyImage = new Models.SessionWhiteBoardHistory()
            {
                JsonData = JsonConvert.SerializeObject(new DTO.WhiteBoardDataAutoImage()
                {
                    Type = "load",
                    src = sessionWhiteBoardSave.FileLocation,
                    Cords = new List<DTO.WhiteboardDataCordsAutoImage>()
                            {
                                new DTO.WhiteboardDataCordsAutoImage()
                                {
                                    Last_mousex = 0,
                                    Last_mousey = 0,
                                    Mousex = sessionWhiteBoardSave.SizeX,
                                    Mousey = sessionWhiteBoardSave.SizeY
                                }
                            }
                }),
                HistoryType = "load",
                UserId = userId,
                SessionWhiteBoardId = sessionWhiteBoardId,
                LogDate = DateTime.Now
            };

            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(historyResize);
            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(historyImage);
            return new List<Models.SessionWhiteBoardHistory>()
            {
                historyResize,
                historyImage
            };
        }

        public async Task<Models.SessionWhiteBoard> Create(Models.SessionWhiteBoard model)
        {
            await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Insert(model);
            return model;
        }

        public async Task<Models.SessionWhiteBoardHistory> UpdateSizes(Guid classSessionId, Guid sessionWhiteBoardId, string userId, string jsonData, int sizeX, int sizeY)
        {
            var toAdd = new Models.SessionWhiteBoardHistory() { SessionWhiteBoardId = sessionWhiteBoardId, HistoryType = "resize", UserId = userId, JsonData = jsonData, LogDate = DateTime.Now };
            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(toAdd);
            return toAdd;
        }

        public async Task ToggleLock(Guid classSessionId, Guid sessionWhiteBoardId, DTO.SessionWhiteBoardLock model)
        {
            var whiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(x => x.SessionWhiteBoardId == sessionWhiteBoardId && x.ClassSessionId == classSessionId);
            if (whiteBoard.Locked != model.Locked)
            {
                whiteBoard.Locked = model.Locked;
                await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(whiteBoard);
            }
            return;
        }

        public async Task<DTO.SessionWhiteBoard> Open(Guid classSessionId, Guid sessionWhiteBoardSaveId)
        {
            var oldWhiteBoardSave = await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().GetByID(sessionWhiteBoardSaveId);

            var model = new Models.SessionWhiteBoard()
            {
                ClassSessionId = classSessionId,
                Name = oldWhiteBoardSave.Name,
                SizeX = oldWhiteBoardSave.SizeX,
                SizeY = oldWhiteBoardSave.SizeY,
                UserId = oldWhiteBoardSave.UserId
            };

            model = await Create(model);

            var loadHistory = new Models.SessionWhiteBoardHistory()
            {
                SessionWhiteBoardId = model.SessionWhiteBoardId,
                HistoryType = "load",
                UserId = oldWhiteBoardSave.UserId,
                JsonData = JsonConvert.SerializeObject(new DTO.WhiteboardData()
                {
                    CreatedDate = DateTime.Now,
                    SessionWhiteBoardId = model.SessionWhiteBoardId,
                    Type = "load",
                    Src = oldWhiteBoardSave.FileLocation,
                    Cords = new List<DTO.WhiteboardDataCords>()
                    {
                        new DTO.WhiteboardDataCords()
                        {
                            Last_mousex = 0,
                            Last_mousey = 0
                        }
                    }
                })
            };
            model.History.Add(loadHistory);
            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(model.History[0]);
            return Mapping.Mappings.MapWhiteBoard(model);
        }

        public async Task<DTO.SessionWhiteBoard> OpenInactiveBoard(Guid classSessionId, string userId, Guid sessionWhiteBoardId)
        {
            var model = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.ClassSessionId == classSessionId && o.SessionWhiteBoardId == sessionWhiteBoardId && o.UserId == userId, includeProperties: "History");
            model.IsInactive = false;
            await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(model);
            return Mapping.Mappings.MapWhiteBoard(model);
        }

        public async Task<Models.SessionWhiteBoardHistory> Undo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId)
        {
            var sessionWhiteBoardHistory = await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().GetSingle(o => o.SessionWhiteBoardHistoryId == sessionWhiteBoardHistoryId);
            sessionWhiteBoardHistory.UnDone = true;
            sessionWhiteBoardHistory.UnDoneDate = DateTime.Now;

            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Update(sessionWhiteBoardHistory);
            return sessionWhiteBoardHistory;
        }

        public async Task<Models.SessionWhiteBoardHistory> Redo(Guid classSessionId, Guid sessionWhiteBoardId, Guid sessionWhiteBoardHistoryId)
        {
            var sessionWhiteBoardHistory = await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().GetSingle(o => o.SessionWhiteBoardHistoryId == sessionWhiteBoardHistoryId);
            if (sessionWhiteBoardHistory != null)
            {
                Models.SessionWhiteBoardHistory redoEntry = new Models.SessionWhiteBoardHistory()
                {
                    JsonData = sessionWhiteBoardHistory.JsonData,
                    LogDate = DateTime.Now,
                    ReDone = true,
                    SessionWhiteBoardId = sessionWhiteBoardHistory.SessionWhiteBoardId,
                    UnDone = false,
                    UnDoneDate = null,
                    HistoryType = sessionWhiteBoardHistory.HistoryType,
                    UserId = sessionWhiteBoardHistory.UserId,
                    ReDoneId = sessionWhiteBoardHistory.ReDone ? sessionWhiteBoardHistory.ReDoneId : sessionWhiteBoardHistoryId
                };

                await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(redoEntry);
                return redoEntry;
            }
            else
                return null;
        }

        public async Task<Models.SessionWhiteBoardHistory> Clear(Guid classSessionId, Guid sessionWhiteBoardId)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);
            var toAdd = new Models.SessionWhiteBoardHistory() { SessionWhiteBoardId = sessionWhiteBoardId, UserId = user.Id, HistoryType = "clear", JsonData = JsonConvert.SerializeObject(new DTO.WhiteboardData() { Type = "clear" }), LogDate = DateTime.Now };
            await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(toAdd);
            return toAdd;
        }

        public async Task<List<DTO.SessionWhiteBoardSaveResult>> GetSavedWhiteBoards(Guid classSessionId)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);
            return await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().GetQueryable()
                .Where(x => x.UserId == user.Id && x.ClassSessionId == classSessionId)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new DTO.SessionWhiteBoardSaveResult()
                {
                    SessionWhiteBoardSaveId = x.SessionWhiteBoardSaveId,
                    CreatedAt = x.CreatedDate ?? DateTime.Now,
                    Name = x.Name
                })
                .ToListAsync();
        }

        public async Task DeleteSessionWhiteBoardSave(Guid sessionWhiteBoardSaveId)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);
            var whiteboardSave = await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().GetSingle(x => x.SessionWhiteBoardSaveId == sessionWhiteBoardSaveId && x.UserId == user.Id);
            whiteboardSave.IsDeleted = true;
            await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().Update(whiteboardSave);
            return;
        }

        public async Task<Models.SessionWhiteBoardSave> Save(Guid classSessionId, Guid sessionWhiteBoardId, string userId, DTO.SessionWhiteBoardSaveImage imageInfo)
        {
            var dbModel = new Models.SessionWhiteBoardSave()
            {
                ClassSessionId = classSessionId,
                UserId = userId,
                Name = imageInfo.Name,
                SizeX = imageInfo.SizeX,
                SizeY = imageInfo.SizeY
            };
            if (string.IsNullOrWhiteSpace(dbModel.Name))
                dbModel.Name = "Individual";


            var bytes = Convert.FromBase64String(imageInfo.ImageData);
            using (var contents = new MemoryStream(bytes))
            {
                dbModel.FileLocation = await _AzureFileHelper.UploadBlob(contents, Guid.NewGuid() + ".png", $"whiteboards-{classSessionId.ToString().ToLower()}");
            }

            await _UnitOfWork.Repository<Models.SessionWhiteBoardSave>().Insert(dbModel);

            //var currentWhiteboard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.ClassSessionId == classSessionId && o.SessionWhiteBoardId == sessionWhiteBoardId);
            //currentWhiteboard.Name = dbModel.Name;
            //await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(currentWhiteboard);


            return dbModel;
        }

        private async Task<List<DTO.WhiteboardData>> GetLoadData(Guid sessionWhiteBoardId, DateTime createdAt)
        {
            var whiteBoardData = await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().GetQueryable()
                .Where(x => x.SessionWhiteBoardId == sessionWhiteBoardId && x.CreatedDate < createdAt && (!x.UnDone || x.UnDoneDate > createdAt) && !(x.ReDone && x.UnDone))
                .OrderBy(x => x.CreatedDate)
                .Select(x => Mapping.Mappings.GetWhiteBoardDataJson(x))
                .ToListAsync();

            int loadPoint = whiteBoardData.FindLastIndex(x => x.Type == "load");

            if (loadPoint >= 0)
            {
                if (loadPoint == 0)
                    whiteBoardData = (await GetLoadData(whiteBoardData[loadPoint].SessionWhiteBoardId, whiteBoardData[loadPoint].CreatedDate)).Concat(whiteBoardData).ToList();
                else
                    whiteBoardData = (await GetLoadData(whiteBoardData[loadPoint].SessionWhiteBoardId, whiteBoardData[loadPoint].CreatedDate)).Concat(whiteBoardData.Skip(loadPoint)).ToList();
            }

            return whiteBoardData;
        }

        public async Task<List<DTO.WhiteboardData>> GetLoadData(DTO.SessionWhiteBoardSaveResult model)
        {
            return await GetLoadData(new Guid(), model.CreatedAt);
        }

        public async Task SetInactive(Guid sessionWhiteBoardId)
        {
            var whiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(x => x.SessionWhiteBoardId == sessionWhiteBoardId);
            whiteBoard.IsInactive = true;
            await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(whiteBoard);
        }

        public async Task<List<DTO.SessionWhiteBoardShare>> GetUsersForShare(Guid classSessionId, Guid sessionWhiteBoardId, string userId, bool individual, string whiteBoardUserId)
        {
            List<DTO.SessionWhiteBoardShare> currentShares = null;

            if (individual)
            {
                var users = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId != userId && x.Removed == false)
               .Select(x => new DTO.SessionWhiteBoardShare()
               {
                   UserId = x.UserId,
                   Name = x.FirstName + " " + x.LastName
               })
               .ToListAsync();

                currentShares = await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().GetQueryable(x => x.SessionWhiteBoardId == sessionWhiteBoardId)
                    .Select(x => new DTO.SessionWhiteBoardShare()
                    {
                        UserId = x.UserId,
                        Read = true,
                        Write = x.WritePermissions,
                        PreviousRead = true,
                        PreviousWrite = x.WritePermissions
                    })
                    .ToListAsync();

                for (int i = 0; i < users.Count; i++)
                {
                    int index = currentShares.FindIndex(x => x.UserId == users[i].UserId);
                    if (index >= 0)
                        currentShares[index].Name = users[i].Name;
                    else
                    {
                        if (users[i].UserId == whiteBoardUserId)
                        {
                            users[i].Write = true;
                            users[i].Read = true;
                            users[i].PreviousRead = true;
                            users[i].PreviousWrite = true;
                        }
                        currentShares.Add(users[i]);
                    }
                }

                return currentShares.OrderBy(x => x.Name).ToList();
            }
            else
            {
                var whiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(x => x.SessionWhiteBoardId == sessionWhiteBoardId);

                if (whiteBoard.SessionGroupId.HasValue)
                {
                    currentShares = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.SessionGroupId == whiteBoard.SessionGroupId && x.UserId != userId && x.Removed == false)
                        .Select(x => new DTO.SessionWhiteBoardShare()
                        {
                            UserId = x.UserId,
                            Name = x.FirstName + " " + x.LastName,
                            Read = true,
                            Write = x.GroupWhiteboardActive,
                            PreviousRead = true,
                            PreviousWrite = x.GroupWhiteboardActive
                        }).ToListAsync();
                }
                else
                {
                    currentShares = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == whiteBoard.ClassSessionId && x.UserId != userId && x.Removed == false)
                        .Select(x => new DTO.SessionWhiteBoardShare()
                        {
                            UserId = x.UserId,
                            Name = x.FirstName + " " + x.LastName,
                            Read = true,
                            Write = x.AllWhiteboardActive,
                            PreviousRead = true,
                            PreviousWrite = x.AllWhiteboardActive
                        }).ToListAsync();
                }

                return currentShares;
            }
        }

        public async Task<List<DTO.SessionWhiteBoardShare>> Share(Guid classSessionId, Guid sessionWhiteBoardId, bool individual, string whiteBoardUserId, List<DTO.SessionWhiteBoardShare> shares)
        {
            if (individual)
            {
                List<DTO.SessionWhiteBoardShare> shareToAdd = new List<DTO.SessionWhiteBoardShare>();
                List<DTO.SessionWhiteBoardShare> shareToModify = new List<DTO.SessionWhiteBoardShare>();

                for (int i = 0; i < shares.Count; i++)
                {
                    if (shares[i].UserId != whiteBoardUserId)
                    {
                        if (!shares[i].PreviousRead && !shares[i].PreviousWrite)
                        {
                            if (shares[i].Read || shares[i].Write)
                                shareToAdd.Add(shares[i]);
                        }
                        else if (shares[i].PreviousWrite != shares[i].Write || shares[i].PreviousRead != shares[i].Read)
                        {
                            shareToModify.Add(shares[i]);
                        }
                    }
                    else
                    {
                        if (!shares[i].Write && shares[i].PreviousWrite)
                        {
                            shareToAdd.Add(shares[i]);
                        }
                        else if (shares[i].PreviousWrite != shares[i].Write)
                        {
                            shareToModify.Add(shares[i]);
                        }
                    }
                }

                if (shareToModify.Count > 0)
                {
                    var modelsToModify = await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().Get(x => x.SessionWhiteBoardId == sessionWhiteBoardId && shareToModify.Any(y => y.UserId == x.UserId));
                    for (int i = 0; i < modelsToModify.Count; i++)
                    {
                        int index = shareToModify.FindIndex(x => x.UserId == modelsToModify[i].UserId);
                        if (index >= 0)
                        {
                            if (shareToModify[index].UserId != whiteBoardUserId)
                            {
                                if (!shareToModify[index].Read)
                                    modelsToModify[i].IsDeleted = true;
                                else
                                    modelsToModify[i].WritePermissions = shareToModify[index].Write;
                            }
                            else
                            {
                                if (shareToModify[index].Write)
                                    modelsToModify[i].IsDeleted = true;
                                else
                                    modelsToModify[i].WritePermissions = shareToModify[index].Write;
                            }
                        }
                    }

                    await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().Update(modelsToModify);
                }

                if (shareToAdd.Count > 0)
                    await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().Insert(shareToAdd.Select(x => new Models.SessionWhiteBoardShare()
                    {
                        ClassSessionId = classSessionId,
                        SessionWhiteBoardId = sessionWhiteBoardId,
                        UserId = x.UserId,
                        WritePermissions = x.Write
                    }).ToList());

                return shareToAdd.Concat(shareToModify).ToList();
            }
            else
            {
                List<DTO.SessionWhiteBoardShare> shareToModify = new List<DTO.SessionWhiteBoardShare>();

                for (int i = 0; i < shares.Count; i++)
                {
                    shares[i].PreviousRead = true;
                    shares[i].Read = true;
                    if (shares[i].PreviousWrite != shares[i].Write)
                        shareToModify.Add(shares[i]);
                }

                var whiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(x => x.SessionWhiteBoardId == sessionWhiteBoardId);
                List<Models.SessionAttendee> attendees = null;
                if (whiteBoard.SessionGroupId.HasValue)
                {
                    attendees = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(x => x.SessionGroupId == whiteBoard.SessionGroupId && shareToModify.Select(y => y.UserId).Contains(x.UserId));
                    for (int i = attendees.Count - 1; i >= 0; i--)
                    {
                        var thisShare = shareToModify.FirstOrDefault(x => x.UserId == attendees[i].UserId);
                        if (thisShare != null)
                            attendees[i].GroupWhiteboardActive = thisShare.Write;
                        else
                            attendees.RemoveAt(i);
                    }
                }
                else
                {
                    attendees = await _UnitOfWork.Repository<Models.SessionAttendee>().Get(x => x.ClassSessionId == whiteBoard.ClassSessionId && shareToModify.Select(y => y.UserId).Contains(x.UserId));
                    for (int i = attendees.Count - 1; i >= 0; i--)
                    {
                        var thisShare = shareToModify.FirstOrDefault(x => x.UserId == attendees[i].UserId);
                        if (thisShare != null)
                            attendees[i].AllWhiteboardActive = thisShare.Write;
                        else
                            attendees.RemoveAt(i);
                    }
                }

                await _UnitOfWork.Repository<Models.SessionAttendee>().Update(attendees);

                return shareToModify;
            }
        }

        public async Task<DTO.SessionWhiteBoard> GetSharedBoard(Guid classSessionId, Guid sessionWhiteBoardId, string userId)
        {
            var individualWhiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().GetSingle(o => o.SessionWhiteBoardId == sessionWhiteBoardId && o.UserId == userId && o.SessionWhiteBoard.SessionGroupId == null && o.SessionWhiteBoard.IsInactive == false, includeProperties: "SessionWhiteBoard, SessionWhiteBoard.History, User");
            var mapped = Mapping.Mappings.MapWhiteBoard(individualWhiteBoard.SessionWhiteBoard);
            mapped.WriteDisabled = !individualWhiteBoard.WritePermissions;
            return mapped;
        }

        public async Task<List<DTO.SessionWhiteBoardShareLoad>> GetSharedWhiteBoards(Guid classSessionId, string userId)
        {
            return await _UnitOfWork.Repository<Models.SessionWhiteBoardShare>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId == userId && !x.SessionWhiteBoard.IsInactive && x.SessionWhiteBoard.UserId != userId)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new DTO.SessionWhiteBoardShareLoad()
                {
                    SessionWhiteBoardId = x.SessionWhiteBoardId,
                    SharedDate = x.CreatedDate ?? DateTime.Now,
                    Name = (x.CreatedDate.HasValue ? (x.CreatedDate.Value.ToString("HH:mm:ss") + " - ") : "") + x.SessionWhiteBoard.User.FullName + " - " + x.SessionWhiteBoard.Name
                }).ToListAsync();
        }

        public async Task<List<DTO.SessionWhiteBoardShareLoad>> GetMyInactiveWhiteboards(Guid classSessionId, string userId)
        {
            return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId == userId && x.IsInactive == true)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new DTO.SessionWhiteBoardShareLoad()
                {
                    SessionWhiteBoardId = x.SessionWhiteBoardId,
                    SharedDate = x.CreatedDate ?? DateTime.Now,
                    Name = x.Name
                }).ToListAsync();
        }

        public async Task<DTO.SessionWhiteBoardCollaborateOverall> GetWhiteBoardsForCollaborate(Guid classSessionId, string userId)
        {
            return new DTO.SessionWhiteBoardCollaborateOverall
            {
                Users = await _UnitOfWork.Repository<Models.SessionAttendee>().GetQueryable(x => x.ClassSessionId == classSessionId && x.UserId != userId && x.Removed == false)
                    .Select(x => new DTO.SessionWhiteBoardCollaborateGrouping()
                    {
                        Name = x.User.FullName,
                        UserId = x.UserId,
                        Whiteboards = x.User.SessionWhiteBoards
                            .Where(y => y.ClassSessionId == classSessionId && !y.IsInactive)
                            .Select(y => new DTO.SessionWhiteBoardCollaborate()
                            {
                                Name = y.Name,
                                SessionWhiteBoardId = y.SessionWhiteBoardId
                            }).ToList()
                    }).ToListAsync(),

                Groups = await _UnitOfWork.Repository<Models.SessionGroup>().GetQueryable(x => x.ClassSessionId == classSessionId && x.SessionAttendees.Any())
                    .Select(x => new DTO.SessionWhiteBoardCollaborateGrouping()
                    {
                        Name = x.Name,
                        GroupId = x.SessionGroupId,
                        Whiteboards = x.SessionWhiteBoards
                            .Where(y => y.ClassSessionId == classSessionId && !y.IsInactive)
                            .Select(y => new DTO.SessionWhiteBoardCollaborate()
                            {
                                Name = y.Name,
                                SessionWhiteBoardId = y.SessionWhiteBoardId
                            }).ToList()
                    }).ToListAsync()
            };
        }

        public async Task<DTO.SessionWhiteBoard> GetWhiteBoardForCollaboration(Guid classSessionId, Guid? sessionWhiteBoardId, Guid? groupId, string userId)
        {
            if (sessionWhiteBoardId.HasValue)
            {
                // Has come from the collaborate modal
                return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetQueryable(x => x.SessionWhiteBoardId == sessionWhiteBoardId && !x.IsInactive, includeProperties: "History, User")
                                .Select(x => Mapping.Mappings.MapWhiteBoard(x))
                                .FirstOrDefaultAsync();
            }
            else
            {
                // Has come from tutor command - Must try to find a valid whiteboard
                DTO.SessionWhiteBoard board = null;
                if (groupId.HasValue)
                {
                    // Only 1 board per group thus gets this
                    return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetQueryable(x => x.SessionGroupId == groupId.Value && !x.IsInactive, includeProperties: "History, User")
                        .Select(x => Mapping.Mappings.MapWhiteBoard(x))
                        .FirstOrDefaultAsync();
                }
                else if (!string.IsNullOrEmpty(userId))
                {
                    // Gets the whiteboard last had history added to for the user
                    return await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetQueryable(x => x.UserId == userId && !x.IsInactive, includeProperties: "History, User")
                        .OrderByDescending(x => x.History.Max(y => y.CreatedDate))
                        .Select(x => Mapping.Mappings.MapWhiteBoard(x))
                        .FirstOrDefaultAsync();
                }
                else
                    throw new Exception("No information to find whiteboard");
            }
        }

        public async Task<(string, List<Models.SessionWhiteBoardHistory>)> UploadImage(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, IFormFile file, int sizeX, int sizeY)
        {
            if (file.ContentType == "application/pdf")
            {
                using var pdfStream = file.OpenReadStream();
                return await ProcessPdfImport(classSessionId, sessionWhiteBoardId, user, pdfStream, sizeX, sizeY);
            }
            else if (file.ContentType == "image/png" || file.ContentType == "image/jpg" || file.ContentType == "image/jpeg" || file.ContentType == "image/bmp")
            {
                using var imageStream = file.OpenReadStream();
                return await ProcessImageImport(classSessionId, sessionWhiteBoardId, user, imageStream, file.ContentType, sizeX, sizeY);
            }
            else
                throw new Exception("Invalid file mime-type for whiteboard import");
        }

        public async Task<(string, List<Models.SessionWhiteBoardHistory>)> ImportFromDrive(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, string fileId, int sizeX, int sizeY)
        {
            // First get info for the file to make sure it is the correct type - and what type
            var fileInfo = await _GoogleHelper.GetFile(user, fileId);
            if (fileInfo.MimeType == "application/pdf")
            {
                using var pdfStream = await _GoogleHelper.Download(user, fileId);
                if (pdfStream.Length == 0)
                    throw new Exception("File doesn't exist");
                pdfStream.Seek(0, SeekOrigin.Begin);
                return await ProcessPdfImport(classSessionId, sessionWhiteBoardId, user, pdfStream, sizeX, sizeY);
            }
            else if (fileInfo.MimeType == "image/png" || fileInfo.MimeType == "image/jpg" || fileInfo.MimeType == "image/jpeg" || fileInfo.MimeType == "image/bmp")
            {
                using var imageStream = await _GoogleHelper.Download(user, fileId);
                if (imageStream.Length == 0)
                    throw new Exception("File doesn't exist");
                imageStream.Seek(0, SeekOrigin.Begin);
                return await ProcessImageImport(classSessionId, sessionWhiteBoardId, user, imageStream, fileInfo.MimeType, sizeX, sizeY);
            }
            else
                throw new Exception("Invalid file mime-type for whiteboard import");
        }

        private async Task<(string, List<Models.SessionWhiteBoardHistory>)> ProcessPdfImport(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, Stream pdfStream, int sizeX, int sizeY)
        {
            var pdfToImg = new NReco.PdfRenderer.PdfToImageConverter();
            using var imageStream = new MemoryStream();
            pdfToImg.GenerateImage(pdfStream, 1, NReco.PdfRenderer.ImageFormat.Jpeg, imageStream);
            imageStream.Seek(0, SeekOrigin.Begin);
            var position = await _AzureFileHelper.UploadBlob(imageStream, Guid.NewGuid() + ".jpg", $"whiteboards-{classSessionId.ToString().ToLower()}");
            return (position, await ResizeWhiteboardToImage(sessionWhiteBoardId, user.Id, position, imageStream, sizeX, sizeY));
        }

        private async Task<(string, List<Models.SessionWhiteBoardHistory>)> ProcessImageImport(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, Stream imageStream, string mimeType, int sizeX, int sizeY)
        {
            var fileExt = mimeType.Split("/")[1];
            var position = await _AzureFileHelper.UploadBlob(imageStream, Guid.NewGuid() + "." + (fileExt == "jpeg" ? "jpg" : fileExt), $"whiteboards-{classSessionId.ToString().ToLower()}");
            return (position, await ResizeWhiteboardToImage(sessionWhiteBoardId, user.Id, position, imageStream, sizeX, sizeY));
        }

        private async Task<List<Models.SessionWhiteBoardHistory>> ResizeWhiteboardToImage(Guid sessionWhiteBoardId, string userId, string imageDirectory, Stream imageStream, int sizeX, int sizeY)
        {
            imageStream.Seek(0, SeekOrigin.Begin);
            using System.Drawing.Image image = System.Drawing.Image.FromStream(imageStream);
            List<Models.SessionWhiteBoardHistory> listHistory = new List<Models.SessionWhiteBoardHistory>();


            if (image.Height > sizeY || image.Width > sizeX || (image.Height + 10 > sizeY && image.Width + 10 > sizeX))
            {
                var historyImage = new Models.SessionWhiteBoardHistory()
                {
                    JsonData = JsonConvert.SerializeObject(new DTO.WhiteBoardDataAutoImage()
                    {
                        Type = "image",
                        src = imageDirectory,
                        Cords = new List<DTO.WhiteboardDataCordsAutoImage>()
                            {
                                new DTO.WhiteboardDataCordsAutoImage()
                                {
                                    Last_mousex = 0,
                                    Last_mousey = 0,
                                    Mousex = sizeX,
                                    Mousey = sizeY
                                }
                            }
                    }),
                    HistoryType = "image",
                    UserId = userId,
                    SessionWhiteBoardId = sessionWhiteBoardId,
                    LogDate = DateTime.Now
                };
                await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(historyImage);
                listHistory.Add(historyImage);
            }


            //ML: removed it seems to cause issues on retrieving whiteboards, this was above type "Image" but it breaks either way
            //if (image.Height > sizeY || image.Width > sizeX)
            //{
            //    var historyResize = new Models.SessionWhiteBoardHistory()
            //    {
            //        JsonData = JsonConvert.SerializeObject(new DTO.WhiteBoardDataAutoResize()
            //        {
            //            Type = "resize",
            //            Cords = new List<DTO.WhiteboardDataCordsAutoResize>()
            //                {
            //                    new DTO.WhiteboardDataCordsAutoResize()
            //                    {
            //                        Last_mousex = 0,
            //                        Last_mousey = 0,
            //                        Mousex = image.Width > sizeX ? image.Width : sizeX,
            //                        Mousey = image.Height > sizeY ? image.Height : sizeY
            //                    }
            //                }
            //        }),
            //        HistoryType = "resize",
            //        UserId = userId,
            //        SessionWhiteBoardId = sessionWhiteBoardId,
            //        LogDate = DateTime.Now
            //    };
            //    await _UnitOfWork.Repository<Models.SessionWhiteBoardHistory>().Insert(historyResize);
            //    listHistory.Add(historyResize);
            //}

            

            return listHistory;

        }

        public async Task<DTO.SessionWhiteBoard> GetGroupWhiteBoard(Guid classSessionId, Guid sessionGroupId)
        {
            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Email.ToLower().Trim() == _HttpContext.HttpContext.User.Identity.Name.ToLower().Trim() && o.IsDeleted == false);

            return Mapping.Mappings.MapWhiteBoard(await _UnitOfWork.Repository<Models.SessionWhiteBoard>()
                .GetQueryable(x => x.SessionGroupId == sessionGroupId && !x.IsInactive && x.SessionGroup.SessionAttendees.Any(y => y.UserId == user.Id)
                    , includeProperties: "History, User")
                .FirstOrDefaultAsync());
        }

        public async Task<byte[]> GetImage(Guid classSessionId, string fileName)
        {
            var file = await _AzureFileHelper.DownloadBlob(fileName, $"whiteboards-{classSessionId.ToString().ToLower()}");
            file.Position = 0;

            using var mStream = new MemoryStream();
            file.CopyTo(mStream);
            return mStream.ToArray();
        }

        public async Task InactiveByGroup(Guid classSessionId, Guid sessionGroupId)
        {
            var whiteBoard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>()
                .GetSingle(x => x.SessionGroupId == sessionGroupId && x.ClassSessionId == classSessionId && !x.IsInactive);
            if (whiteBoard != null)
            {
                whiteBoard.IsInactive = true;
                await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(whiteBoard);
            }
        }

        public async Task ChangeName(Guid classSessionId, Guid sessionWhiteBoardId, Models.User user, string name, bool isTutor)
        {
            var whiteboard = await _UnitOfWork.Repository<Models.SessionWhiteBoard>().GetSingle(o => o.ClassSessionId == classSessionId && o.SessionWhiteBoardId == sessionWhiteBoardId);

            if (whiteboard == null || (!isTutor && whiteboard.UserId != user.Id))
                throw new Exception("Access Denied");

            whiteboard.Name = name;
            await _UnitOfWork.Repository<Models.SessionWhiteBoard>().Update(whiteboard);

        }
    }
}

