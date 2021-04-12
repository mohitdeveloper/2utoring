using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorUrlSlug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlSlug",
                table: "Tutors",
                maxLength: 500,
                nullable: true);

            migrationBuilder.Sql("update Tutors set urlslug = (select top 1 FirstName + LastName from AspNetUsers where AspNetUsers.TutorId  = Tutors.TutorId)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlSlug",
                table: "Tutors");
        }
    }
}
