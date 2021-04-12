using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddWebsiteContactTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WebsiteContacts",
                columns: table => new
                {
                    WebsiteContactId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    ContactEmail = table.Column<string>(maxLength: 250, nullable: false),
                    SubjectId = table.Column<Guid>(nullable: false),
                    StudyLevelId = table.Column<Guid>(nullable: false),
                    Description = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsiteContacts", x => x.WebsiteContactId);
                    table.ForeignKey(
                        name: "FK_WebsiteContacts_StudyLevels_StudyLevelId",
                        column: x => x.StudyLevelId,
                        principalTable: "StudyLevels",
                        principalColumn: "StudyLevelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WebsiteContacts_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WebsiteContacts_StudyLevelId",
                table: "WebsiteContacts",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_WebsiteContacts_SubjectId",
                table: "WebsiteContacts",
                column: "SubjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WebsiteContacts");
        }
    }
}
