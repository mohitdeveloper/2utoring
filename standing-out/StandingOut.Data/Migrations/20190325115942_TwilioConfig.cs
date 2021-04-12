using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class TwilioConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VidyoApplicationId",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "VidyoDeveloperKey",
                table: "Settings");

            migrationBuilder.RenameColumn(
                name: "VidyoRecordingDir",
                table: "Settings",
                newName: "TwilioApiSecret");

            migrationBuilder.RenameColumn(
                name: "VidyoFfmpegDir",
                table: "Settings",
                newName: "TwilioApiKey");

            migrationBuilder.RenameColumn(
                name: "VidyoDeveloperUser",
                table: "Settings",
                newName: "TwilioAccountSid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TwilioApiSecret",
                table: "Settings",
                newName: "VidyoRecordingDir");

            migrationBuilder.RenameColumn(
                name: "TwilioApiKey",
                table: "Settings",
                newName: "VidyoFfmpegDir");

            migrationBuilder.RenameColumn(
                name: "TwilioAccountSid",
                table: "Settings",
                newName: "VidyoDeveloperUser");

            migrationBuilder.AddColumn<string>(
                name: "VidyoApplicationId",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VidyoDeveloperKey",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");
        }
    }
}
