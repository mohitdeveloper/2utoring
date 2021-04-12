using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using StandingOut.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StandingOut.Business.Helpers.AcuityScheduling
{
    public class AcuitySchedulingHelper : IAcuitySchedulingHelper
    {
        private string _UserId = "";
        private string _ApiKey = "";
        private RestClient _Client;
        private readonly ISettingService _SettingService;

        public AcuitySchedulingHelper(ISettingService settingService)
        {
            _SettingService = settingService;

            
        }

        private async Task Setup()
        {
            var setting = await _SettingService.Get();

            _UserId = setting.AcuitySchedulingUserId;
            _ApiKey = setting.AcuitySchedulingSecret;

            _Client = new RestClient("https://acuityscheduling.com/api/v1/");
            _Client.Authenticator = new HttpBasicAuthenticator(_UserId, _ApiKey);
        }

        public void Dispose()
        {
            GC.Collect();
        }

        public async Task<List<AcuitySchedulingAppointment>> GetAppointments(DateTime? startDate, DateTime? endDate)
        {
            await Setup();

            string url = "appointments?";
            if (startDate.HasValue)
            {
                url += $"minDate={startDate.Value.ToString("yyyy-MM-dd")}";
            }
            if (endDate.HasValue)
            {
                url += $"maxDate={endDate.Value.ToString("yyyy-MM-dd")}";
            }

            var request = new RestRequest(url, Method.GET);
            request.RequestFormat = DataFormat.Json;

            IRestResponse<List<AcuitySchedulingAppointment>> response = _Client.Execute<List<AcuitySchedulingAppointment>>(request);

            return response.Data;
        }

        public async Task<AcuitySchedulingAppointment> GetAppointment(int id)
        {
            await Setup();

            var request = new RestRequest("appointments/{id}", Method.GET);
            request.RequestFormat = DataFormat.Json;
            request.AddUrlSegment("id", id);

            IRestResponse<AcuitySchedulingAppointment> response = _Client.Execute<AcuitySchedulingAppointment>(request);

            return response.Data;
        }

        public async Task<List<AcuitySchedulingAppointmentPayment>> GetAppointmentPayments(int id)
        {
            await Setup();

            var request = new RestRequest("appointments/{id}/payments", Method.GET);
            request.RequestFormat = DataFormat.Json;
            request.AddUrlSegment("id", id);

            IRestResponse<List<AcuitySchedulingAppointmentPayment>> response = _Client.Execute<List<AcuitySchedulingAppointmentPayment>>(request);

            return response.Data;
        }

        public async Task<List<AcuitySchedulingCalendar>> GetCalendars()
        {
            await Setup();

            var request = new RestRequest("calendars", Method.GET);
            request.RequestFormat = DataFormat.Json;

            IRestResponse<List<AcuitySchedulingCalendar>> response = _Client.Execute<List<AcuitySchedulingCalendar>>(request);

            return response.Data;
        }

        public async Task<List<AcuitySchedulingClient>> GetClients()
        {
            await Setup();

            var request = new RestRequest("clients", Method.GET);
            request.RequestFormat = DataFormat.Json;

            IRestResponse<List<AcuitySchedulingClient>> response = _Client.Execute<List<AcuitySchedulingClient>>(request);

            return response.Data;
        }

        public async Task<List<AcuitySchedulingAppointmentType>> GetAppointmentTypes()
        {
            await Setup();

            var request = new RestRequest("appointment-types", Method.GET);
            request.RequestFormat = DataFormat.Json;            

            IRestResponse<List<AcuitySchedulingAppointmentType>> response = _Client.Execute<List<AcuitySchedulingAppointmentType>>(request);


            return JsonConvert.DeserializeObject<List<AcuitySchedulingAppointmentType>>(response.Content); 
        }

    }
}
