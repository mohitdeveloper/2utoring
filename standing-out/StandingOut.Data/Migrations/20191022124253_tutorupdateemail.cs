using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorupdateemail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TutorProfileUpdateEmail",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("update settings set TutorProfileUpdateEmail = 'support@iostudios.co.uk', ContactUsEmail = 'support@iostudios.co.uk', TutorSignUpEmail = 'support@iostudios.co.uk'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TutorProfileUpdateEmail",
                table: "Settings");
        }
    }
}
