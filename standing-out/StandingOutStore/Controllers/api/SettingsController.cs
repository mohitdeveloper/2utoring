using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StandingOut.Data;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;

namespace StandingOutStore.Controllers.api
{
    [Produces("application/json")]
    [Route("api/Settings")]
    public class SettingsController : Controller
    {
        private readonly ISettingService _SettingService;
        private readonly AppSettings _AppSettings;

        public SettingsController(ISettingService settingService, IOptions<AppSettings> appSettings)
        {
            _SettingService = settingService;
            _AppSettings = appSettings.Value;
        }

        [HttpGet("getBaseClassSessionCommision")]
        [ProducesResponseType(typeof(DTO.LessonCard), 200)]
        public async Task<IActionResult> GetBaseClassSessionCommision(Guid classSessionId)
        {
            // This commission is no longer valid.. See Subscription Features - Commission Tiers
            var settings = await _SettingService.Get();
            return Ok(settings.BaseClassSessionCommision);
        }

        [HttpGet("getIdentitySiteUrl")]
        [ProducesResponseType(typeof(DTO.LessonCard), 200)]
        public async Task<IActionResult> GetIdentitySiteUrl()
        {
            return Ok(_AppSettings.IdentitySiteUrl);
        }
    }
}