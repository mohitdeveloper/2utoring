using StandingOut.Data.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace StandingOut.Data.DTO
{
    public class TutorCertificate
    {
        public Guid TutorCertificateId { get; set; }
        public Guid TutorId { get; set; }

        [StringLength(2000)]
        public string CertificateFileLocation { get; set; }
        [StringLength(2000)]
        public string CertificateFileName { get; set; }
        public TutorCertificateType CertificateType { get; set; }
        public string CertificateNumber { get; set; }
    }
}
