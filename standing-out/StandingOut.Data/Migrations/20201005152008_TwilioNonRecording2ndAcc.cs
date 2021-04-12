using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace StandingOut.Data.Migrations
{
    public partial class TwilioNonRecording2ndAcc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TwilioAccountSid2",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TwilioApiKey2",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TwilioApiSecret2",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TwilioAuthToken2",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            Settings_Setup2ndTwilioAccount(migrationBuilder);
        }

        private void Settings_Setup2ndTwilioAccount(MigrationBuilder migrationBuilder)
        {
            var TwilioAccountSid2 = "AC4297699dca38ccce1f260be3833f9da7";
            var TwilioApiKey2 = "SKb90b0632db5bfbb589c0aaa34667b836";
            var TwilioApiSecret2 = "J8CP28Uo5ncKzr7jvLQhXFaywrCcz08H";
            var TwilioAuthToken2 = "92aa9a3ae2c3a911fba1429f76bdffc7";

            var sqlStatement = $@"Update Settings Set " + 
                $" TwilioAccountSid2 = '{TwilioAccountSid2}', TwilioApiKey2 = '{ TwilioApiKey2}', " +
                $" TwilioApiSecret2 = '{TwilioApiSecret2}', TwilioAuthToken2 = '{ TwilioAuthToken2}' ";

            migrationBuilder.Sql(sqlStatement);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TwilioAccountSid2",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TwilioApiKey2",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TwilioApiSecret2",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TwilioAuthToken2",
                table: "Settings");
        }
    }
}
