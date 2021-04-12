using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddNotificationColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlertType",
                table: "NotificationMessages",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "NotificationMessages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlertType",
                table: "NotificationMessages");

            migrationBuilder.DropColumn(
                name: "Condition",
                table: "NotificationMessages");
        }
    }
}
