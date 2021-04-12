using StandingOut.Data.Entity;
using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StandingOut.Data.Models
{
    public class TutorCertificate : EntityBase
    {
        [Key]
        public Guid TutorCertificateId { get; set; }
        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }

        [StringLength(2000)]
        public string CertificateFileLocation { get; set; }
        [StringLength(2000)]
        public string CertificateFileName { get; set; }
        public TutorCertificateType CertificateType { get; set; }
        public string CertificateNumber { get; set; }
        public virtual Tutor Tutor { get; set; }
    }

}
