using StandingOut.Data.Entity;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.Models
{
    public class Setting : EntityBase
    {
        [Key]
        public Guid SettingId { get; set; }

        [Required]
        [StringLength(2000)]
        public string SendGridApi { get; set; }

        [Required]
        [StringLength(2000)]
        public string SendGridFromEmail { get; set; }

        [Required]
        [StringLength(2000)]
        public string ContactUsEmail { get; set; }

        [Required]
        [StringLength(2000)]
        public string SignUpEmail { get; set; }

        [Required]
        [StringLength(2000)]
        public string TutorSignUpEmail { get; set; }

        [Required]
        [StringLength(2000)]
        public string TutorProfileUpdateEmail { get; set; }

        [Required]
        [StringLength(2000)]
        public string AcuitySchedulingUserId { get; set; }
        [Required]
        [StringLength(2000)]
        public string AcuitySchedulingSecret { get; set; }

        [Required]
        [StringLength(2000)]
        public string TwilioAccountSid { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioApiKey { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioApiSecret { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioAuthToken { get; set; }

        // 2nd Twilio account to use for NO Recordings
        [Required]
        [StringLength(2000)]
        public string TwilioAccountSid2 { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioApiKey2 { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioApiSecret2 { get; set; }
        [Required]
        [StringLength(2000)]
        public string TwilioAuthToken2 { get; set; }

        [Required]
        [StringLength(2000)]
        public string GoogleClientId { get; set; }
        [Required]
        [StringLength(2000)]
        public string GoogleClientSecret { get; set; }
        [Required]
        [StringLength(2000)]
        public string GoogleAppName { get; set; }

        [Required]
        [StringLength(2000)]
        [Display(Name = "Safeguard Report Alert Email")]
        public string SafeguardReportAlertEmail { get; set; }
        [Required]
        [StringLength(2000)]
        public string StripeKey { get; set; }

        [Required]
        [StringLength(2000)]
        public string StripeConnectClientId { get; set; }


        [Required]
        [StringLength(1000)]
        public string AzureBlobConnectionString { get; set; }
        public decimal BaseClassSessionCommision { get; set; }
        public DateTime? MinimumDateForClassSession { get; set; }
        public decimal ConversionPercent { get; set; }
        public decimal ConversionFlat { get; set; }

    }
}
