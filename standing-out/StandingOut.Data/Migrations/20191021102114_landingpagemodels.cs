using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class landingpagemodels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Biography",
                table: "Tutors",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Header",
                table: "Tutors",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageDirectory",
                table: "Tutors",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageName",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubHeader",
                table: "Tutors",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Companys",
                columns: table => new
                {
                    CompanyId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    SubHeader = table.Column<string>(maxLength: 250, nullable: false),
                    Biography = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companys", x => x.CompanyId);
                });

            migrationBuilder.CreateTable(
                name: "CompanyTutors",
                columns: table => new
                {
                    CompanyTutorId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyTutors", x => x.CompanyTutorId);
                    table.ForeignKey(
                        name: "FK_CompanyTutors_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CompanyTutors_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyTutors_CompanyId",
                table: "CompanyTutors",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyTutors_TutorId",
                table: "CompanyTutors",
                column: "TutorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyTutors");

            migrationBuilder.DropTable(
                name: "Companys");

            migrationBuilder.DropColumn(
                name: "Biography",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "Header",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ImageDirectory",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "ImageName",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "SubHeader",
                table: "Tutors");
        }
    }
}
