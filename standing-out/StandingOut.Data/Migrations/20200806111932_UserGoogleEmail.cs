using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class UserGoogleEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleEmail",
                table: "AspNetUsers",
                maxLength: 250,
                nullable: true);

            migrationBuilder.Sql("UPDATE AspNetUsers SET GoogleEmail = Email");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoogleEmail",
                table: "AspNetUsers");
        }
    }
}
