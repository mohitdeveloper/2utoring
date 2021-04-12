using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.StaticFiles;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using System.Threading;
using StandingOut.Data;
using Microsoft.EntityFrameworkCore;

namespace StandingOut.Shared.Helpers.GoogleHelper
{
    public class GoogleHelper : IGoogleHelper
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly IUnitOfWork _UnitOfWork;

        public GoogleHelper(UserManager<Models.User> userManager, IUnitOfWork unitOfWork)
        {
            _UserManager = userManager;
            _UnitOfWork = unitOfWork;
        }

        private async Task<DriveService> GetService(Models.User user)
        {
            var externalAccessToken = await _UserManager.GetAuthenticationTokenAsync(user, "Google", "access_token");
            var refreshToken = await _UserManager.GetAuthenticationTokenAsync(user, "Google", "refresh_token");
            var externalLogin = await _UnitOfWork.GetContext().UserLogins.FirstOrDefaultAsync(o => o.UserId == user.Id && o.LoginProvider.ToLower().Trim() == "google");
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetSingle();

            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = settings.GoogleClientId,
                    ClientSecret = settings.GoogleClientSecret
                },
                Scopes = new[] { DriveService.Scope.Drive }
            });

            var credential = new UserCredential(flow, externalLogin.ProviderKey, new TokenResponse
            {
                AccessToken = externalAccessToken,
                RefreshToken = refreshToken
            });


            var driveService = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = settings.GoogleAppName
            });

            return driveService;
        }

        #region Classroom Methods

        public async Task ShareFiles(Models.User user, List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, List<string> fileIds)
        {
            var driveService = await GetService(user);

            foreach (var fileId in fileIds)
                await ShareFile(userForPermissions, fileId, driveService);
        }

        private async Task ShareFile(List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, string fileId, DriveService driveService)
        {
            foreach (var userCopy in userForPermissions)
            {
                await Copy(driveService, fileId, userCopy.SessionAttendeeFolder, userCopy.Email, userCopy.IsWriteable ? PermissionsRole.writer : PermissionsRole.reader);
            }
            //await Task.Run(() =>
            //{
            //    Parallel.ForEach(userForPermissions, async userCopy =>
            //    {
            //        await Copy(driveService, fileId, userCopy.SessionAttendeeFolder, userCopy.Email, userCopy.IsWriteable ? PermissionsRole.writer : PermissionsRole.reader);
            //    });
            //});
        }

        public async Task ShareFilesSetup(Models.User user, List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, List<string> fileIds)
        {
            var driveService = await GetService(user);

            IDictionary<string, string> permissionMetadata = new Dictionary<string, string>();
            foreach (var singleUserPermissions in userForPermissions)
            {
                if (!singleUserPermissions.IsReadable)
                    permissionMetadata.Add(singleUserPermissions.SessionAttendeeId.ToString(), GooglePermissionsMetadataType.none.ToString());
                else if (!singleUserPermissions.IsWriteable)
                    permissionMetadata.Add(singleUserPermissions.SessionAttendeeId.ToString(), GooglePermissionsMetadataType.read.ToString());
                else
                    permissionMetadata.Add(singleUserPermissions.SessionAttendeeId.ToString(), null);
            }

            await Task.Run(() =>
            {
                Parallel.ForEach(fileIds, async fileId =>
                {
                    await ShareFileSetup(userForPermissions, fileId, new Dictionary<string, string>(permissionMetadata), driveService);
                });
            });
        }

        private async Task ShareFileSetup(List<DTO.SessionAttendeeFileUploaderShare> userForPermissions, string fileId, IDictionary<string, string> permissionMetadata, DriveService driveService)
        {
            var file = await GetFileWithAppProperties(driveService, fileId);
            foreach (var item in file.AppProperties)
            {
                if (item.Value != GooglePermissionsMetadataType.none.ToString() && item.Value != GooglePermissionsMetadataType.read.ToString() && item.Value != null)
                    permissionMetadata.Add(item);
            }
            await driveService.Files.Update(new Google.Apis.Drive.v3.Data.File() { AppProperties = permissionMetadata }, fileId).ExecuteAsync();
        }

        private async Task CreatePermission(Google.Apis.Drive.v3.DriveService driveService, DTO.SessionAttendeeFileUploaderShare userForPermissions, string fileId)
        {
            PermissionsResource.CreateRequest createRequest = driveService.Permissions.Create(new Google.Apis.Drive.v3.Data.Permission()
            {
                Type = PermissionsType.user.ToString(),
                Role = userForPermissions.IsWriteable ? PermissionsRole.writer.ToString() : PermissionsRole.reader.ToString(),
                EmailAddress = userForPermissions.Email
            }, fileId);
            createRequest.SendNotificationEmail = false;

            await createRequest.ExecuteAsync();
        }

        #endregion Classroom Methods

        #region Session Attendee Methods

        public async Task<Google.Apis.Drive.v3.Data.File> GetSessionAttendeeDirectory(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee)
        {
            var driveService = await GetService(user);
            return await GetSessionAttendeeDirectory(driveService, user, classSession, sessionAttendee);
        }

        public async Task<DTO.SessionFolderDetails> CreateSessionAttendeeDirectories(Models.User user, IList<Models.SessionAttendee> sessions)
        {
            DTO.SessionFolderDetails sessionFolderDetails = new DTO.SessionFolderDetails();
            var driveService = await GetService(sessions.First().ClassSession.Owner);
            var currentOwnerId = sessions.First().ClassSession.OwnerId;
            foreach (var session in sessions)
            {
                if (session.ClassSession.OwnerId != user.Id)
                {
                    currentOwnerId = session.ClassSession.OwnerId;
                    driveService = await GetService(session.ClassSession.Owner);
                }
                sessionFolderDetails.PassAnotherFolderDetails(await CreateSessionAttendeeDirectory(driveService, user, session, session.ClassSession));
            }
            return sessionFolderDetails;
        }

        public async Task<DTO.SessionFolderDetails> CreateSessionAttendeeDirectory(Models.User user, Models.SessionAttendee session, Models.ClassSession classSession)
        {
            var driveService = await GetService(classSession.Owner);
            return await CreateSessionAttendeeDirectory(driveService, user, session, classSession);
        }

        private async Task<DTO.SessionFolderDetails> CreateSessionAttendeeDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.User user, Models.SessionAttendee session, Models.ClassSession classSession)
        {
            var sessionFolder = await FindFoldersById(driveService, classSession.SessionDirectoryId);
            var sessionFolderDetails = await ReturnOrCreateSessionFolder(driveService, sessionFolder, classSession);

            if (sessionFolderDetails.BaseStudentFolder == null)
            {
                var baseFolder = await FindFoldersById(driveService, classSession.BaseStudentDirectoryId);
                sessionFolderDetails.BaseStudentFolder = (await ReturnOrCreateBaseStudentFolder(driveService, baseFolder, classSession, sessionFolderDetails.SessionFolder.Id)).BaseStudentFolder;

                if (sessionFolderDetails.MasterStudentFolder == null)
                {
                    var masterFolders = await FindFoldersById(driveService, classSession.MasterStudentDirectoryId);
                    sessionFolderDetails.MasterStudentFolder = await ReturnOrCreateFolder(driveService, new List<Google.Apis.Drive.v3.Data.File>() { masterFolders }, classSession.MasterStudentDirectoryName, sessionFolderDetails.BaseStudentFolder.Id, true);
                }
                if (sessionFolderDetails.SharedStudentFolder == null)
                {
                    var sharedFolders = await FindFoldersById(driveService, classSession.SharedStudentDirectoryId);
                    sessionFolderDetails.SharedStudentFolder = await ReturnOrCreateFolder(driveService, new List<Google.Apis.Drive.v3.Data.File>() { sharedFolders }, SharedStudentFolderName(classSession), sessionFolderDetails.BaseStudentFolder.Id, true);
                }
            }

            if (user.Id != classSession.OwnerId)
            {
                sessionFolderDetails.StudentFolders.Add(await CreateFolder(driveService, session.SessionAttendeeDirectoryName, user, sessionFolderDetails.BaseStudentFolder.Id, true));
            }

            return sessionFolderDetails;
        }

        private async Task<Google.Apis.Drive.v3.Data.File> ReturnOrCreateSessionAttendeeDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.SessionAttendee attendee, Models.ClassSession classSession, string baseFolderId)
        {
            var attendeeFolder = await FindFoldersById(driveService, attendee.SessionAttendeeDirectoryId);
            if (attendeeFolder == null || attendeeFolder.Id == null || attendeeFolder.Parents == null || !attendeeFolder.Parents.Contains(baseFolderId))
                return await CreateFolder(driveService, StudentFolderName(attendee.User, classSession), attendee.User, baseFolderId, true);
            else
                return attendeeFolder;
        }

        private async Task<Google.Apis.Drive.v3.Data.File> GetSessionAttendeeDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee)
        {
            var attendeeFolder = await FindFoldersById(driveService, sessionAttendee.SessionAttendeeDirectoryId);
            if (attendeeFolder != null)
                return attendeeFolder;

            // Code smell - GET is creating folder !!
            var folderDetails = await CreateSessionAttendeeDirectory(user, sessionAttendee, classSession);
            return folderDetails.StudentFolders.FirstOrDefault();
        }

        #endregion

        #region Session Methods

        public async Task<DTO.SessionFolderDetails> CreateSessionDirectory(Models.ClassSession classSession)
        {
            var owner = _UserManager.Users.FirstOrDefault(o => o.Id == classSession.OwnerId);
            var driveService = await GetService(owner);
            return await CreateSessionFolder(driveService, classSession);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> GetSessionDirectory(Models.User user, Models.ClassSession classSession)
        {
            var driveService = await GetService(classSession.Owner);
            return (await GetSessionDirectory(user, classSession, driveService)).SessionFolder;
        }

        private async Task<DTO.SessionFolderDetails> GetSessionDirectory(Models.User user, Models.ClassSession classSession, Google.Apis.Drive.v3.DriveService driveService)
        {
            var result = await FindFolders(driveService, classSession.SessionDirectoryName);
            return await ReturnOrCreateSessionFolder(driveService, result.Files, classSession);
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateSessionFolder(Google.Apis.Drive.v3.DriveService driveService, IList<Google.Apis.Drive.v3.Data.File> folders, Models.ClassSession classSession, string parentId = null)
        {
            if (folders == null || folders.Count == 0)
            {
                return await CreateSessionFolder(driveService, classSession, parentId);
            }
            else
                return new DTO.SessionFolderDetails() { SessionFolder = folders.First() };
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateSessionFolder(Google.Apis.Drive.v3.DriveService driveService, Google.Apis.Drive.v3.Data.File folder, Models.ClassSession classSession, string parentId = null)
        {
            if (folder == null || folder.Id == null)
            {
                return await CreateSessionFolder(driveService, classSession, parentId);
            }
            else
                return new DTO.SessionFolderDetails() { SessionFolder = folder };
        }

        private async Task<DTO.SessionFolderDetails> CreateSessionFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession, string parentId = null)
        {
            DTO.SessionFolderDetails sessionFolderDetails = new DTO.SessionFolderDetails();
            if (string.IsNullOrEmpty(classSession.SessionDirectoryName))
                classSession.SessionDirectoryName = SessionFolderName(classSession);
            sessionFolderDetails.SessionFolder = await CreateFolder(driveService, classSession.SessionDirectoryName, parentId, true);
            classSession.SessionDirectoryId = sessionFolderDetails.SessionFolder.Id;
            sessionFolderDetails.BaseTutorFolder = await CreateFolder(driveService, BaseTutorFolderName(), sessionFolderDetails.SessionFolder.Id, true);
            classSession.BaseTutorDirectoryId = sessionFolderDetails.BaseTutorFolder.Id;
            sessionFolderDetails.BaseStudentFolder = await CreateFolder(driveService, BaseStudentFolderName(), sessionFolderDetails.SessionFolder.Id, true);
            classSession.BaseStudentDirectoryId = sessionFolderDetails.BaseStudentFolder.Id;
            sessionFolderDetails.SharedStudentFolder = await CreateFolder(driveService, SharedStudentFolderName(classSession), sessionFolderDetails.BaseStudentFolder.Id, true);
            classSession.SharedStudentDirectoryId = sessionFolderDetails.SharedStudentFolder.Id;
            if (string.IsNullOrEmpty(classSession.MasterStudentDirectoryName))
                classSession.MasterStudentDirectoryName = MasterStudentFolderName(classSession);
            sessionFolderDetails.MasterStudentFolder = await CreateFolder(driveService, classSession.MasterStudentDirectoryName, sessionFolderDetails.BaseStudentFolder.Id, true);
            classSession.MasterStudentDirectoryId = sessionFolderDetails.MasterStudentFolder.Id;
            if (classSession.ClassSessionId != default)
            {
                await _UnitOfWork.Repository<Models.ClassSession>().Update(classSession);
            }
            return sessionFolderDetails;
        }

        #endregion

        #region Shared Student Folder Methods

        private async Task<DTO.SessionFolderDetails> GetSharedStudentDirectory(Models.User user, Models.ClassSession classSession)
        {
            var driveService = await GetService(classSession.Owner);
            return await GetSharedStudentDirectory(driveService, user, classSession);
        }

        private async Task<DTO.SessionFolderDetails> GetSharedStudentDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.User user, Models.ClassSession classSession)
        {
            var result = await FindFoldersById(driveService, classSession.SharedStudentDirectoryId);
            return await ReturnOrCreateSharedStudentFolder(driveService, result, classSession);
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateSharedStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Google.Apis.Drive.v3.Data.File folder, Models.ClassSession classSession)
        {
            if (folder == null || string.IsNullOrEmpty(folder.Id))
                return await ReturnOrCreateSharedStudentFolder(driveService, classSession);
            else
                return new DTO.SessionFolderDetails() { SharedStudentFolder = folder };
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateSharedStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession)
        {
            var sessionResult = await FindFolders(driveService, classSession.SharedStudentDirectoryId);
            if (sessionResult.Files == null || sessionResult.Files.Count == 0)
            {
                return await CreateSessionFolder(driveService, classSession);
            }
            else
            {
                var baseResult = await FindFoldersWithParent(driveService, BaseStudentFolderName(), sessionResult.Files.First().Id);
                var baseDetails = await ReturnOrCreateBaseStudentFolder(driveService, baseResult.Files, classSession, sessionResult.Files.First().Id);
                if (baseDetails.MasterStudentFolder == null)
                {
                    baseDetails.MasterStudentFolder = (await CreateMasterStudentFolder(driveService, classSession, baseDetails.BaseStudentFolder.Id)).MasterStudentFolder;
                }
                if (baseDetails.SharedStudentFolder == null)
                {
                    baseDetails.SharedStudentFolder = (await CreateSharedStudentFolder(driveService, classSession, baseDetails.BaseStudentFolder.Id)).SharedStudentFolder;
                }
                baseDetails.SessionFolder = sessionResult.Files.First();
                return baseDetails;
            }
        }

        private async Task<DTO.SessionFolderDetails> CreateSharedStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession, string baseStudentFolderId)
        {
            return new DTO.SessionFolderDetails() { SharedStudentFolder = await CreateFolder(driveService, SharedStudentFolderName(classSession), baseStudentFolderId, true) };
        }

        #endregion

        #region Master Student Folder Methods

        private async Task<DTO.SessionFolderDetails> GetMasterStudentDirectory(Models.User user, Models.ClassSession classSession)
        {
            var driveService = await GetService(classSession.Owner);
            return await GetMasterStudentDirectory(driveService, user, classSession);
        }

        private async Task<DTO.SessionFolderDetails> GetMasterStudentDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.User user, Models.ClassSession classSession)
        {
            var result = await FindFoldersById(driveService, classSession.MasterStudentDirectoryId);
            return await ReturnOrCreateMasterStudentFolder(driveService, result, classSession);
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateMasterStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Google.Apis.Drive.v3.Data.File folder, Models.ClassSession classSession)
        {
            if (folder == null || string.IsNullOrEmpty(folder.Id))
                return await ReturnOrCreateMasterStudentFolder(driveService, classSession);
            else
                return new DTO.SessionFolderDetails() { MasterStudentFolder = folder };
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateMasterStudentFolder(Google.Apis.Drive.v3.DriveService driveService, IList<Google.Apis.Drive.v3.Data.File> folders, Models.ClassSession classSession)
        {
            if (folders == null || folders.Count == 0)
                return await ReturnOrCreateMasterStudentFolder(driveService, classSession);
            else
                return new DTO.SessionFolderDetails() { MasterStudentFolder = folders.First() };
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateMasterStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession)
        {
            var sessionResult = await FindFoldersById(driveService, classSession.SessionDirectoryId);
            if (sessionResult == null || string.IsNullOrEmpty(sessionResult.Id))
            {
                return await CreateSessionFolder(driveService, classSession);
            }
            else
            {
                var baseResult = await FindFoldersWithParent(driveService, BaseStudentFolderName(), sessionResult.Id);
                var baseDetails = await ReturnOrCreateBaseStudentFolder(driveService, baseResult.Files, classSession, sessionResult.Id);
                if (baseDetails.MasterStudentFolder == null)
                {
                    baseDetails.MasterStudentFolder = (await CreateMasterStudentFolder(driveService, classSession, baseDetails.BaseStudentFolder.Id)).MasterStudentFolder;
                }
                if (baseDetails.SharedStudentFolder == null)
                {
                    baseDetails.SharedStudentFolder = (await CreateSharedStudentFolder(driveService, classSession, baseDetails.BaseStudentFolder.Id)).SharedStudentFolder;
                }
                baseDetails.SessionFolder = sessionResult;
                return baseDetails;
            }
        }

        private async Task<DTO.SessionFolderDetails> CreateMasterStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession, string baseStudentFolderId)
        {
            return new DTO.SessionFolderDetails() { MasterStudentFolder = await CreateFolder(driveService, classSession.MasterStudentDirectoryName, baseStudentFolderId, true) };
        }

        public async Task<Tuple<IList<Models.SessionAttendee>, DTO.SessionFolderDetails>> CopyFilesFromMasterToStudentFolders(Models.User user, Models.ClassSession classSession, IList<Models.SessionAttendee> activeAttendees)
        {
            var driveService = await GetService(classSession.Owner);
            var folderDetails = await GetMasterStudentDirectory(driveService, user, classSession);
            var attendeesToUpdate = EnsureAttendeeFoldersAreCreated(driveService, activeAttendees, classSession
                , folderDetails.BaseStudentFolder != null && folderDetails.BaseStudentFolder.Id != null ? folderDetails.BaseStudentFolder.Id : classSession.BaseStudentDirectoryId
                , folderDetails.SharedStudentFolder != null && folderDetails.SharedStudentFolder.Id != null ? folderDetails.SharedStudentFolder.Id : classSession.SharedStudentDirectoryId);
            var parentFolderIds = activeAttendees.Where(x => !string.IsNullOrEmpty(x.SessionAttendeeDirectoryId) && x.UserId != classSession.OwnerId).Select(x => x.SessionAttendeeDirectoryId).ToList();
            var attendeesForCopy = activeAttendees.Where(x => !string.IsNullOrEmpty(x.SessionAttendeeDirectoryId) && x.UserId != classSession.OwnerId).ToList();

            var filesAndFoldersToCopy = (await FindFiles(driveService, folderDetails.MasterStudentFolder.Id)).Files.Where(x => !parentFolderIds.Any(y => y == x.Id));
            await CopyFilesFromMasterToStudentFolders_RecursionParallel(driveService, filesAndFoldersToCopy, attendeesForCopy);
            return new Tuple<IList<Models.SessionAttendee>, DTO.SessionFolderDetails>(attendeesToUpdate, folderDetails);
        }

        // This will run sync -> intentional as data must be updated from this
        private IList<Models.SessionAttendee> EnsureAttendeeFoldersAreCreated(Google.Apis.Drive.v3.DriveService driveService, IList<Models.SessionAttendee> activeAttendees, Models.ClassSession classSession, string baseFolderId, string sharedStudentFolderId)
        {
            IList<Models.SessionAttendee> attendeesToUpdate = new List<Models.SessionAttendee>();
            foreach (var activeAttendee in activeAttendees.Where(x => x.User != null && x.UserId != classSession.OwnerId))
            {
                var attendeeFolder = ReturnOrCreateSessionAttendeeDirectory(driveService, activeAttendee, classSession, baseFolderId).GetAwaiter().GetResult();
                if (string.IsNullOrEmpty(activeAttendee.SessionAttendeeDirectoryId) || activeAttendee.SessionAttendeeDirectoryId != attendeeFolder.Id)
                {
                    activeAttendee.SessionAttendeeDirectoryId = attendeeFolder.Id;
                    activeAttendee.SessionAttendeeDirectoryName = attendeeFolder.Name;
                    attendeesToUpdate.Add(activeAttendee);
                }

                CreatePermissions(driveService, activeAttendee.User, sharedStudentFolderId, PermissionsRole.writer).Wait();
            }

            return attendeesToUpdate;
        }

        // This is seperated into two functions so parellel foreach is not nested in parallel foreach causing more overhead
        private async Task CopyFilesFromMasterToStudentFolders_RecursionParallel(Google.Apis.Drive.v3.DriveService driveService, IEnumerable<Google.Apis.Drive.v3.Data.File> filesAndFoldersToCopy, IList<Models.SessionAttendee> attendees)
        {
            if (filesAndFoldersToCopy != null && filesAndFoldersToCopy.Count() > 0)
            {
                await Task.Run(() =>
                {
                    Parallel.ForEach(filesAndFoldersToCopy, async fileOrFolder =>
                    {
                        if (fileOrFolder.MimeType == "application/vnd.google-apps.folder")
                        {
                            IList<string> newParentFolderIds = new List<string>();
                            foreach (var attendee in attendees)
                                newParentFolderIds.Add((await CreateFolder(driveService, fileOrFolder.Name, attendee.SessionAttendeeDirectoryId, false)).Id);
                            await CopyFilesFromMasterToStudentFolders_Recursion(driveService, (await FindFiles(driveService, fileOrFolder.Id)).Files, attendees);
                        }
                        else
                        {
                            var appProperties = await GetFileAppProperties(driveService, fileOrFolder.Id);
                            foreach (var attendee in attendees)
                            {
                                //Wizcraft(john): 11-11-2020 provide User GoogleEmail by object attendee and comment below link
                                //var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == attendee.UserId);
                                var gp = attendee.GoogleFilePermissions.Where(x => x.FileId == fileOrFolder.Id && x.SessionAttendeeId==attendee.SessionAttendeeId).FirstOrDefault();
                                if (gp != null && gp.FolderName=="Master")
                                {
                                    if (gp.IsReadable || gp.IsWriteable)
                                    {
                                        if (appProperties == null)
                                            await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, attendee.User.GoogleEmail);
                                        else
                                        {

                                            var permission = appProperties.Where(x => x.Key == attendee.SessionAttendeeId.ToString()).FirstOrDefault();
                                            if (permission.Equals(default(KeyValuePair<string, string>)) || permission.Value == null)
                                                await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, attendee.User.GoogleEmail);
                                            else if (permission.Value == GooglePermissionsMetadataType.read.ToString())
                                                await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, attendee.User.GoogleEmail, PermissionsRole.reader);
                                        }
                                    }
                                }
                               
                            }
                        }
                    });
                });
            }
        }

        private async Task<IDictionary<string, string>> GetFileAppProperties(DriveService driveService, string fileId)
        {
            return (await GetFileWithAppProperties(driveService, fileId)).AppProperties;
        }

        public async Task<Google.Apis.Drive.v3.Data.File> GetFileWithAppProperties(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            return await GetFileWithAppProperties(driveService, fileId);
        }

        private async Task<Google.Apis.Drive.v3.Data.File> GetFileWithAppProperties(DriveService driveService, string fileId)
        {
            var getRequest = driveService.Files.Get(fileId);
            getRequest.Fields = "appProperties, id";
            var file = await getRequest.ExecuteAsync();
            return file;
        }

        private async Task CopyFilesFromMasterToStudentFolders_Recursion(Google.Apis.Drive.v3.DriveService driveService, IEnumerable<Google.Apis.Drive.v3.Data.File> filesAndFoldersToCopy, IList<Models.SessionAttendee> attendees)
        {
            if (filesAndFoldersToCopy != null && filesAndFoldersToCopy.Count() > 0)
            {
                foreach (var fileOrFolder in filesAndFoldersToCopy)
                {
                    if (fileOrFolder.MimeType == "application/vnd.google-apps.folder")
                    {
                        IList<string> newParentFolderIds = new List<string>();
                        foreach (var attendee in attendees)
                            newParentFolderIds.Add((await CreateFolder(driveService, fileOrFolder.Name, attendee.SessionAttendeeDirectoryId)).Id);
                        await CopyFilesFromMasterToStudentFolders_Recursion(driveService, (await FindFiles(driveService, fileOrFolder.Id)).Files, attendees);
                    }
                    else
                    {
                        var appProperties = await GetFileAppProperties(driveService, fileOrFolder.Id);
                        foreach (var attendee in attendees)
                        {
                            var user = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == attendee.UserId);

                            if (appProperties == null)
                                await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, user.GoogleEmail);
                            else
                            {
                                var permission = appProperties.Where(x => x.Key == attendee.SessionAttendeeId.ToString()).FirstOrDefault();
                                if (permission.Equals(default(KeyValuePair<string, string>)) || permission.Value == null)
                                    await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, user.GoogleEmail);
                                else if (permission.Value == GooglePermissionsMetadataType.read.ToString())
                                    await Copy(driveService, fileOrFolder.Id, attendee.SessionAttendeeDirectoryId, user.GoogleEmail, PermissionsRole.reader);
                            }
                        }
                    }
                }
            }
        }

        #endregion

        #region Base Student Folder Methods

        private async Task<Google.Apis.Drive.v3.Data.File> GetMasterStudentDirectory(Models.User user, Models.ClassSession classSession, string sessionFolderId)
        {
            var driveService = await GetService(classSession.Owner);
            return await GetBaseStudentDirectory(driveService, user, classSession, sessionFolderId);
        }

        private async Task<Google.Apis.Drive.v3.Data.File> GetBaseStudentDirectory(Google.Apis.Drive.v3.DriveService driveService, Models.User user, Models.ClassSession classSession, string sessionFolderId)
        {
            var result = await FindFoldersWithParent(driveService, BaseStudentFolderName(), sessionFolderId);
            return (await ReturnOrCreateBaseStudentFolder(driveService, result.Files, classSession, sessionFolderId)).BaseStudentFolder;
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateBaseStudentFolder(Google.Apis.Drive.v3.DriveService driveService, IList<Google.Apis.Drive.v3.Data.File> folders, Models.ClassSession classSession, string sessionFolderId)
        {
            if (folders == null || folders.Count == 0)
            {
                return await CreateBaseStudentFolder(driveService, classSession, sessionFolderId);
            }
            else
                return new DTO.SessionFolderDetails() { BaseStudentFolder = folders.First() };
        }

        private async Task<DTO.SessionFolderDetails> ReturnOrCreateBaseStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Google.Apis.Drive.v3.Data.File folder, Models.ClassSession classSession, string sessionFolderId)
        {
            if (folder == null || folder.Id == null)
            {
                return await CreateBaseStudentFolder(driveService, classSession, sessionFolderId);
            }
            else
                return new DTO.SessionFolderDetails() { BaseStudentFolder = folder };
        }

        private async Task<DTO.SessionFolderDetails> CreateBaseStudentFolder(Google.Apis.Drive.v3.DriveService driveService, Models.ClassSession classSession, string sessionFolderId)
        {
            DTO.SessionFolderDetails folderDetails = new DTO.SessionFolderDetails
            {
                BaseStudentFolder = await CreateFolder(driveService, BaseStudentFolderName(), sessionFolderId, true)
            };
            folderDetails.MasterStudentFolder = await CreateFolder(driveService, classSession.MasterStudentDirectoryName, folderDetails.BaseStudentFolder.Id, true);
            folderDetails.SharedStudentFolder = await CreateFolder(driveService, SharedStudentFolderName(classSession), folderDetails.BaseStudentFolder.Id, true);
            return folderDetails;
        }

        #endregion

        #region Folder Name Methods

        public string CapitalizeAndSlugify(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;
            else
            {
                text = Utilities.StringUtilities.Slugify(text);
                text = char.ToUpper(text[0]).ToString() + (text.Length > 1 ? text.Substring(1) : string.Empty);
                for (int i = 2; i < text.Length; i++)
                {
                    if (text[i - 1] == ' ' && text[i] != ' ')
                    {
                        text = text.Remove(i) + text[i] + text.Substring(i + 1);
                        i++;
                    }
                }
                return text;
            }
        }

        public string SessionFolderName(Models.ClassSession classSession)
        {
            return $"{CapitalizeAndSlugify(classSession.Name)}, {classSession.StartDate.ToString("h tt, dd-MM-y").ToLower()}";
        }

        public string StudentFolderName(Models.User user, Models.ClassSession classSession)
        {
            return StudentFolderName(user.FirstName, user.LastName, classSession);
        }

        public string StudentFolderName(string firstName, string lastName, Models.ClassSession classSession)
        {
            return $"{(string.IsNullOrWhiteSpace(firstName) ? string.Empty : Utilities.StringUtilities.Slugify(firstName[0].ToString()).ToUpper())} {CapitalizeAndSlugify(lastName)}, {CapitalizeAndSlugify(classSession.Name)}, {classSession.StartDate.ToString("h tt, dd-MM-y").ToLower()}";
        }

        public string SharedStudentFolderName(Models.ClassSession classSession)
        {
            return $"Shared Folder, {CapitalizeAndSlugify(classSession.Name)}, {classSession.StartDate.ToString("htt, dd-MM-y").ToLower()}";
        }

        private string BaseTutorFolderName()
        {
            return "Tutor Folder";
        }

        private string BaseStudentFolderName()
        {
            return "Student Folders";
        }

        public string MasterStudentFolderName(Models.ClassSession classSession)
        {
            return $"Master Student, {CapitalizeAndSlugify(classSession.Name)}, {classSession.StartDate.ToString("htt, dd-MM-y").ToLower()}";
        }

        #endregion

        #region General Folder Methods

        private async Task<Google.Apis.Drive.v3.Data.File> ReturnOrCreateFolder(Google.Apis.Drive.v3.DriveService driveService, IList<Google.Apis.Drive.v3.Data.File> folders, string folderName, string parentId = null, bool protectedFolder = false)
        {
            if (folders == null || folders.Count == 0)
                return await CreateFolder(driveService, folderName, parentId, protectedFolder);
            else
                return folders.First();
        }

        private async Task<Google.Apis.Drive.v3.Data.File> CreateFolder(Google.Apis.Drive.v3.DriveService driveService, string folderName, string parentId = null, bool protectedFolder = false)
        {
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = folderName,
                MimeType = "application/vnd.google-apps.folder",
                AppProperties = CreateAppProperties(protectedFolder)
            };
            if (parentId != null)
                fileMetadata.Parents = new List<string>() { parentId };
            var request = driveService.Files.Create(fileMetadata);
            request.Fields = "id, name";

            return await request.ExecuteAsync();
        }

        private async Task<Google.Apis.Drive.v3.Data.File> CreateFolder(Google.Apis.Drive.v3.DriveService driveService, string folderName, Models.User userForPermissions, string parentId = null, bool protectedFolder = false)
        {
            var folder = await CreateFolder(driveService, folderName, parentId, protectedFolder);

            if (userForPermissions != null)
            {
                PermissionsResource.CreateRequest createRequest = driveService.Permissions.Create(new Google.Apis.Drive.v3.Data.Permission()
                {
                    Type = PermissionsType.user.ToString(),
                    Role = PermissionsRole.writer.ToString(),
                    EmailAddress = userForPermissions.GoogleEmail
                }, folder.Id);
                createRequest.SendNotificationEmail = false;

                await createRequest.ExecuteAsync();
            }

            return folder;
        }

        private async Task<Google.Apis.Drive.v3.Data.File> FindFoldersById(Google.Apis.Drive.v3.DriveService driveService, string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                FilesResource.GetRequest getRequest = driveService.Files.Get(id);
                getRequest.Fields = "id, name, fileExtension, mimeType, kind, parents, webContentLink, appProperties";
                return await getRequest.ExecuteAsync();
            }
            else
                return new Google.Apis.Drive.v3.Data.File();
        }

        private async Task<Google.Apis.Drive.v3.Data.FileList> FindFolders(Google.Apis.Drive.v3.DriveService driveService, string name)
        {
            if (!string.IsNullOrEmpty(name))
                return await FindCustom(driveService, $"name = '{name}' and mimeType = 'application/vnd.google-apps.folder'");
            else
                return new Google.Apis.Drive.v3.Data.FileList();
        }

        private async Task<Google.Apis.Drive.v3.Data.FileList> FindFoldersWithParent(Google.Apis.Drive.v3.DriveService driveService, string name, string parentId)
        {
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(parentId))
                return await FindCustom(driveService, $"name = '{name}' and '{parentId}' in parents and mimeType = 'application/vnd.google-apps.folder'");
            else
                return new Google.Apis.Drive.v3.Data.FileList();
        }

        private async Task<Google.Apis.Drive.v3.Data.FileList> FindFiles(Google.Apis.Drive.v3.DriveService driveService, string parentId, string pageToken = "")
        {
            if (!string.IsNullOrEmpty(parentId))
                return await FindCustom(driveService, $"'{parentId}' in parents", pageToken);
            else
                return new Google.Apis.Drive.v3.Data.FileList();
        }

        private async Task<Google.Apis.Drive.v3.Data.FileList> FindCustom(Google.Apis.Drive.v3.DriveService driveService, string q, string pageToken = "")
        {
            //Find the folder
            FilesResource.ListRequest listRequest = driveService.Files.List();
            listRequest.PageSize = 10;
            listRequest.Fields = "nextPageToken, files(id, name, fileExtension, mimeType, kind, parents, webContentLink, appProperties)";
            listRequest.Q = q;
            listRequest.PageToken = pageToken == string.Empty ? null : pageToken;

            // List files.
            var result = await listRequest.ExecuteAsync();
            return result;
        }

        #endregion

        #region Navigation Methods

        #region Tutor Navigation Methods

        public async Task<Google.Apis.Drive.v3.Data.FileList> GetSessionDirectoryFiles(Models.User user, Models.ClassSession classSession)
        {
            var driveService = await GetService(classSession.Owner);
            var sessionFolder = (await GetSessionDirectory(user, classSession, driveService)).SessionFolder;
            var result = await FindFiles(driveService, sessionFolder.Id);

            return result;
        }

        public async Task<DTO.FileNavigation> GetSessionDirectoryFilesByFolderIdSame(Models.User user, Models.ClassSession classSession, string folderId, string pageToken = "")
        {
            return await GetFilesInFolderOrSessionFolder(user, classSession, folderId, pageToken);
        }

        public async Task<Google.Apis.Drive.v3.Data.FileList> GetSessionDirectoryFilesByFolderIdDown(Models.User user, Models.ClassSession classSession, string folderId)
        {
            var driveService = await GetService(user);
            return await GetDirectoryFilesByFolderIdDown(driveService, folderId);
        }

        public async Task<DTO.FileNavigation> GetSessionDirectoryFilesByFolderIdUp(Models.User user, Models.ClassSession classSession, string folderId)
        {
            return await GetFilesInFolderOrSessionFolder(user, classSession, folderId, fromBelow: true);
        }

        private async Task<DTO.FileNavigation> GetFilesInFolderOrSessionFolder(Models.User user, Models.ClassSession classSession, string folderId, string pageToken = "", bool fromBelow = false)
        {
            var driveService = await GetService(classSession.Owner);

            var result = await FindFiles(driveService, folderId, pageToken);
            IList<Google.Apis.Drive.v3.Data.File> files = result.Files;

            DTO.FileNavigation resultSet = new DTO.FileNavigation();

            // Should never be null or 0 going up (FromBelow indicates upward traversal)
            if (fromBelow && (files == null || files.Count == 0))
            {
                var sessionFolder = await GetSessionDirectory(user, classSession);
                var sessionResult = await FindFiles(driveService, sessionFolder.Id);
                resultSet.Files = sessionResult.Files;
                resultSet.ResetToRoot = true;
                resultSet.ResetToFolder = sessionFolder.Id;
                resultSet.NextPageToken = sessionResult.NextPageToken;
            }
            else
            {
                resultSet.Files = files;
                resultSet.NextPageToken = result.NextPageToken;
            }

            return resultSet;
        }

        #endregion

        #region Student Navigation Methods

        public async Task<Google.Apis.Drive.v3.Data.FileList> GetAttendeeDirectoryFiles(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee)
        {
            var driveService = await GetService(user);
            var attendeeFolder = await GetSessionAttendeeDirectory(driveService, user, classSession, sessionAttendee);
            var result = await FindFiles(driveService, attendeeFolder.Id);

            return result;
        }

        public async Task<DTO.FileNavigation> GetAttendeeDirectoryFilesByFolderIdSame(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, string folderId, string pageToken = "")
        {
            return await GetFilesInFolderOrAttendeeFolder(user, classSession, sessionAttendee, folderId, pageToken);
        }

        public async Task<Google.Apis.Drive.v3.Data.FileList> GetAttendeeDirectoryFilesByFolderIdDown(Models.User user, Models.ClassSession classSession, string folderId)
        {
            var driveService = await GetService(user);
            return await GetDirectoryFilesByFolderIdDown(driveService, folderId);
        }

        public async Task<DTO.FileNavigation> GetAttendeeDirectoryFilesByFolderIdUp(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, string folderId)
        {
            return await GetFilesInFolderOrAttendeeFolder(user, classSession, sessionAttendee, folderId);
        }

        private async Task<DTO.FileNavigation> GetFilesInFolderOrAttendeeFolder(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, string folderId, string pageToken = "")
        {
            var driveService = await GetService(user);

            var result = await FindFiles(driveService, folderId, pageToken);
            IList<Google.Apis.Drive.v3.Data.File> files = result.Files;

            DTO.FileNavigation resultSet = new DTO.FileNavigation();

            // Should never be null or 0 going up
            if (files == null || files.Count == 0)
            {
                var attendeeFolder = await GetSessionAttendeeDirectory(driveService, user, classSession, sessionAttendee);
                var attendeeResult = await FindFiles(driveService, attendeeFolder.Id);
                resultSet.Files = attendeeResult.Files;
                resultSet.ResetToRoot = true;
                resultSet.ResetToFolder = attendeeFolder.Id;
                resultSet.NextPageToken = attendeeResult.NextPageToken;
            }
            else
            {
                resultSet.Files = files;
                resultSet.NextPageToken = result.NextPageToken;
            }

            return resultSet;
        }

        #endregion

        #region Shared Navigation Methods

        private async Task<Google.Apis.Drive.v3.Data.FileList> GetDirectoryFilesByFolderIdDown(Google.Apis.Drive.v3.DriveService driveService, string folderId)
        {
            var result = await FindFiles(driveService, folderId);
            return result;
        }

        #endregion

        #endregion

        #region Interaction Methods

        public async Task<Google.Apis.Drive.v3.Data.PermissionList> GetPermissions(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            return await GetPermissions(driveService, fileId);
        }

        private async Task<Google.Apis.Drive.v3.Data.PermissionList> GetPermissions(DriveService driveService, string fileId)
        {
            var listRequest = driveService.Permissions.List(fileId);
            listRequest.Fields = "permissions(id, emailAddress, role)";
            return await listRequest.ExecuteAsync();
        }

        public async Task AlterPermissions(Models.User user, List<string> fileIds, List<DTO.SessionAttendeeFileUploaderShare> models)
        {
            var driveService = await GetService(user);
            foreach (var fileId in fileIds)
            {
                var filePermissions = await GetPermissions(driveService, fileId);
                foreach (var model in models)
                {
                    var sessionAttendee = await _UnitOfWork.Repository<Models.SessionAttendee>().GetSingle(o => o.SessionAttendeeId == model.SessionAttendeeId);
                    var sessionAttendeeUser = await _UnitOfWork.GetContext().Users.FirstOrDefaultAsync(o => o.Id == sessionAttendee.UserId);

                    var permission = filePermissions.Permissions.Where(x => x.EmailAddress == sessionAttendeeUser.GoogleEmail).FirstOrDefault();
                    if (permission == null)
                    {
                        if (model.IsReadable || model.IsWriteable)
                        {
                            await driveService.Permissions.Create(new Google.Apis.Drive.v3.Data.Permission()
                            {
                                Type = PermissionsType.user.ToString(),
                                Role = model.IsWriteable ? PermissionsRole.writer.ToString() : PermissionsRole.reader.ToString(),
                                EmailAddress = sessionAttendeeUser.GoogleEmail,
                            }, fileId).ExecuteAsync();
                        }
                    }
                    else
                    {
                        if ((model.IsWriteable && permission.Role != "writer") ||
                            (!model.IsWriteable && permission.Role == "writer") ||
                            (!model.IsReadable && (permission.Role == "reader" || permission.Role == "writer")) ||
                            (model.IsReadable && (permission.Role != "reader" && permission.Role != "writer")))
                        {
                            if (model.IsWriteable)
                            {
                                await driveService.Permissions.Update(new Google.Apis.Drive.v3.Data.Permission()
                                {
                                    Role = PermissionsRole.writer.ToString()
                                }, fileId, permission.Id).ExecuteAsync();
                            }
                            else if (model.IsReadable)
                            {
                                await driveService.Permissions.Update(new Google.Apis.Drive.v3.Data.Permission()
                                {
                                    Role = PermissionsRole.reader.ToString()
                                }, fileId, permission.Id).ExecuteAsync();
                            }
                            else
                            {
                                await driveService.Permissions.Delete(fileId, permission.Id).ExecuteAsync();
                            }
                        }
                    }
                }
            }

            return;
        }

        public async Task CreateGoogleFile(Models.User user, DTO.CreateGoogleFile model)
        {
            var driveService = await GetService(user);
            string googleMimeType = null;
            switch (model.FileType)
            {
                case FileType.Document:
                    googleMimeType = "application/vnd.google-apps.document";
                    break;
                case FileType.Presentation:
                    googleMimeType = "application/vnd.google-apps.presentation";
                    break;
                case FileType.Spreadsheet:
                    googleMimeType = "application/vnd.google-apps.spreadsheet";
                    break;
                default:
                    throw new Exception("No applicable mime type for google file creation");
            }
            await driveService.Files.Create(new Google.Apis.Drive.v3.Data.File()
            {
                MimeType = googleMimeType,
                Name = model.Name,
                Parents = new List<string>()
                {
                    model.FolderId
                }
            }).ExecuteAsync();
        }

        public async Task<Google.Apis.Drive.v3.Data.File> GetFile(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            return await GetFile(fileId, driveService);
        }

        private async Task<Google.Apis.Drive.v3.Data.File> GetFile(string fileId, DriveService driveService)
        {
            return await driveService.Files.Get(fileId).ExecuteAsync();
        }

        public async Task<MemoryStream> Download(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            var request = driveService.Files.Get(fileId);
            var stream = new System.IO.MemoryStream();

            await request.DownloadAsync(stream);
            return stream;
        }

        public async Task<Google.Apis.Drive.v3.Data.File> Upload(Models.User user, string folderId, string name, byte[] file)
        {
            var driveService = await GetService(user);
            return await Upload(driveService, name, new MemoryStream(file), folderId);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> Upload(Models.User user, string folderId, IFormFile file)
        {
            var driveService = await GetService(user);
            var stream = file.OpenReadStream();
            return await Upload(driveService, file.FileName, stream, folderId);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadToTutorFolder(Models.User user, Models.ClassSession classSession, Stream stream, string fileName)
        {
            var driveService = await GetService(classSession.Owner);
            return await Upload(driveService, fileName, stream, classSession.BaseTutorDirectoryId);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadToSessionFolder(Models.User user, Models.ClassSession classSession, Stream stream, string fileName)
        {
            var driveService = await GetService(classSession.Owner);
            return await Upload(driveService, fileName, stream, classSession.SessionDirectoryId);
        }

        public async Task<Google.Apis.Drive.v3.Data.File> UploadToAttendeeFolder(Models.User user, Models.ClassSession classSession, Models.SessionAttendee sessionAttendee, Stream stream, string fileName)
        {
            var driveService = await GetService(classSession.Owner);
            return await Upload(driveService, fileName, stream, sessionAttendee.SessionAttendeeDirectoryId);
        }

        private async Task<Google.Apis.Drive.v3.Data.File> Upload(Google.Apis.Drive.v3.DriveService driveService, string fileName, Stream stream, string parentId = null, bool protectedFile = false)
        {
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = fileName,
                Parents = parentId != null ? new List<string>() { parentId } : null,
                AppProperties = CreateAppProperties(protectedFile),
                CopyRequiresWriterPermission = false
            };

            FilesResource.CreateMediaUpload request;
            request = driveService.Files.Create(fileMetadata, stream, GetMimeType(fileName));
            request.Fields = "id, name, fileExtension, mimeType, kind, parents, webContentLink, appProperties";
            request.Upload();
            return request.ResponseBody;
        }

        private async Task<Google.Apis.Drive.v3.Data.File> Copy(Google.Apis.Drive.v3.DriveService driveService, string fileId, string newParentId, string permissionsEmail, PermissionsRole permissionsRole = PermissionsRole.writer)
        {
            FilesResource.CopyRequest request = driveService.Files.Copy(new Google.Apis.Drive.v3.Data.File()
            {
                Parents = new List<string>() { newParentId },
            }, fileId);
            var file = await request.ExecuteAsync();
            //if (permissionsRole == PermissionsRole.reader)
            //{
            // All permissions are writer and reader -> Propagation from the folder permission is only relevant if the permission is LOWER -> CHeck this and make sure this if has no other weird effects
            await CreatePermissions(driveService, permissionsEmail, file.Id, permissionsRole);
            //}
            return file;
        }

        public async Task<bool> DeleteSessionFile(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            if (string.IsNullOrEmpty(await driveService.Files.Delete(fileId).ExecuteAsync()))
                return true;
            else
                return false;
        }

        public async Task<bool> DeleteAttendeeFile(Models.User user, string fileId)
        {
            var driveService = await GetService(user);
            if (string.IsNullOrEmpty(await driveService.Files.Delete(fileId).ExecuteAsync()))
                return true;
            else
                return false;
        }

        #endregion

        #region Utilities

        private IDictionary<string, string> CreateAppProperties(bool protectedFile)
        {
            return new Dictionary<string, string>
            {
                { "protectedFile", protectedFile.ToString() }
            };
        }

        private async Task CreatePermissions(Google.Apis.Drive.v3.DriveService driveService, Models.User userForPermissions, string fileOrFolderId, PermissionsRole permissionsRole)
        {
            if (userForPermissions != null)
                await CreatePermissions(driveService, userForPermissions.GoogleEmail, fileOrFolderId, permissionsRole);
        }

        private async Task CreatePermissions(Google.Apis.Drive.v3.DriveService driveService, string email, string fileOrFolderId, PermissionsRole permissionsRole)
        {
            PermissionsResource.ListRequest listRequest = driveService.Permissions.List(fileOrFolderId);
            Google.Apis.Drive.v3.Data.PermissionList currentPermissions = null;
            listRequest.Fields = "permissions(id, emailAddress, role)";
            try
            {
                currentPermissions = await listRequest.ExecuteAsync();

            }
            catch (Exception ex)
            {
                string ahh = "ahhhh";
            }
            Google.Apis.Drive.v3.Data.Permission permissionToUpdate = null;
            if (currentPermissions.Permissions.Count > 0)
                permissionToUpdate = currentPermissions.Permissions.FirstOrDefault(x => x.EmailAddress == email);

            if (permissionToUpdate != null)
            {
                if (permissionToUpdate.Role != permissionsRole.ToString())
                {
                    PermissionsResource.UpdateRequest updateRequest = driveService.Permissions.Update(new Google.Apis.Drive.v3.Data.Permission()
                    {
                        Role = permissionsRole.ToString()
                    }, fileOrFolderId, permissionToUpdate.Id);

                    await RetryUpdatePermissions(updateRequest);
                }
            }
            else
            {
                PermissionsResource.CreateRequest createRequest = driveService.Permissions.Create(new Google.Apis.Drive.v3.Data.Permission()
                {
                    Type = PermissionsType.user.ToString(),
                    Role = permissionsRole.ToString(),
                    EmailAddress = email,
                }, fileOrFolderId);
                createRequest.SendNotificationEmail = false;

                await RetryCreatePermissions(createRequest);
            }
        }

        private async Task RetryUpdatePermissions(PermissionsResource.UpdateRequest updateRequest, int retry = 0)
        {
            try
            {
                var permission = await updateRequest.ExecuteAsync();
            }
            catch (Exception ex)
            {
                if (retry < 2)
                {
                    Thread.Sleep(3000);
                    await RetryUpdatePermissions(updateRequest, ++retry);
                }
                else
                {
                    throw new Exception("Could not share file");
                }
            }
        }

        private async Task RetryCreatePermissions(PermissionsResource.CreateRequest createRequest, int retry = 0)
        {
            try
            {
                var permission = await createRequest.ExecuteAsync();
            }
            catch (Exception ex)
            {
                if (retry < 2)
                {
                    Thread.Sleep(3000);
                    await RetryCreatePermissions(createRequest, ++retry);
                }
                else
                {
                    throw new Exception("Could not share file");
                }
            }
        }

        private string GetMimeType(string fileName)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(fileName, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

        public void Dispose()
        {
            GC.Collect();
        }

        #endregion
    }
}
