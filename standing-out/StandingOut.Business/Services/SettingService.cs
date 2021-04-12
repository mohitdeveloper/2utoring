using StandingOut.Business.Services.Interfaces;
using StandingOut.Data;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Business.Services
{
    public class SettingService : ISettingService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;

        public SettingService(IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                _Disposed = true;
            }
        }

        public async Task<Models.Setting> Get()
        {
            return await _UnitOfWork.Repository<Models.Setting>().GetSingle();
        }

        public async Task<Models.Setting> UpdateSafeguardAlertEmail(Models.Setting model)
        {
            var settings = await Get();
            settings.SafeguardReportAlertEmail = model.SafeguardReportAlertEmail;
            await _UnitOfWork.Repository<Models.Setting>().Update(settings);
            return settings;
        }

        public async Task ResetAllSessions()
        {
            await _UnitOfWork.ExecuteRawSql("" +
                "UPDATE ClassSessions " +
                "SET MasterStudentDirectoryName = '', " +
                "MasterStudentDirectoryId = '', " +
                "BaseStudentDirectoryId = '', " +
                "SessionDirectoryId = '', " +
                "SessionDirectoryName = '', " +
                "BaseTutorDirectoryId = '', " +
                "SharedStudentDirectoryId = '', " +
                "ReadMessagesTutor = 0, " +
                "DueEndDate = NULL, " +
                "Ended = 0, " +
                "EndedAtDate = NULL, " +
                "[Started] = 0, " +
                "StartedAtDate = NULL, " +
                "ChatActive = 1, " +
                "MasterFilesCopied = 0, " +
                "Complete = 0, " +
                "HasEmailAttachment = 0, " +
                "EmailContents = NULL, " +
                "StartDate = GETDATE(), " +
                "EndDate = DATEADD(DAY, 7, GETDATE()) " +

                "DELETE FROM SessionWhiteBoardShare " +
                "DELETE FROM SessionWhiteBoardSave " +
                "DELETE FROM SessionWhiteBoardHistory " +
                "DELETE FROM SessionWhiteBoards " +

                "DELETE FROM SessionMessages " +

                "DELETE FROM SessionOneToOneChatInstanceUsers " +
                "DELETE FROM SessionOneToOneChatInstances " +

                "UPDATE SessionGroups " +
                "SET ChatActive = 1, " +
                "ReadMessagesTutor = 0 " +

                "UPDATE SessionAttendees " +
                "SET ReadMessagesAll = 0, " +
                "ReadMessagesGroup = 0, " +
                "SessionAttendeeDirectoryName = NULL, " +
                "SessionAttendeeDirectoryId = NULL, " +
                "ChatActive = 1, " +
                "Attended = 0, " +
                "AudioEnabled = 0, " +
                "VideoEnabled = 0, " +
                "RoomJoinEnabled = 0, " +
                "[GroupAudioEnabled] = 0 " +
                ",[GroupVideoEnabled] = 0 " +
                ",[CallIndividualsEnabled] = 0 " +
                ",[HelpRequested] = 0 " +
                ",[GroupScreenShareEnabled] = 0 " +
                ",[ScreenShareEnabled] = 0");

            return;
        }
    }
}
