using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SignUpVoucher",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TermsAndConditionsAccepted",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignUpVoucher",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "TermsAndConditionsAccepted",
                table: "AspNetUsers");
        }
    }
}
