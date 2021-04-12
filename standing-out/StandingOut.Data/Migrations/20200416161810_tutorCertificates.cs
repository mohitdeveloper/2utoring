using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorCertificates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TutorCertificates",
                columns: table => new
                {
                    TutorCertificateId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: false),
                    CertificateFileLocation = table.Column<string>(maxLength: 2000, nullable: true),
                    CertificateFileName = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorCertificates", x => x.TutorCertificateId);
                    table.ForeignKey(
                        name: "FK_TutorCertificates_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TutorCertificates_IsDeleted",
                table: "TutorCertificates",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TutorCertificates_TutorId",
                table: "TutorCertificates",
                column: "TutorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TutorCertificates");
        }
    }
}
