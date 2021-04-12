using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class StripeConnect : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StripeConnectAccountId",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeConnectBankAccountId",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeConnectClientId",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "ca_H91H4E1aQvq2stSQNJ9I5iwaw9w5AFD1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripeConnectAccountId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripeConnectBankAccountId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripeConnectClientId",
                table: "Settings");
        }
    }
}
