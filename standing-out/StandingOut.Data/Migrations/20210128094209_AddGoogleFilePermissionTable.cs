using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddGoogleFilePermissionTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GoogleFilePermissions",
                columns: table => new
                {
                    GoogleFilePermissionId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    SessionAttendeeId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    FileId = table.Column<string>(nullable: true),
                    IsReadable = table.Column<bool>(nullable: false),
                    IsWriteable = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoogleFilePermissions", x => x.GoogleFilePermissionId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GoogleFilePermissions");
        }
    }
}
