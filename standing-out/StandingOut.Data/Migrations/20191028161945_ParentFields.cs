using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class ParentFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailPurchasedBy",
                table: "SessionAttendees",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PurchasedById",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsParent",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_PurchasedById",
                table: "SessionAttendees",
                column: "PurchasedById");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_AspNetUsers_PurchasedById",
                table: "SessionAttendees",
                column: "PurchasedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_AspNetUsers_PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "EmailPurchasedBy",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "IsParent",
                table: "AspNetUsers");
        }
    }
}
