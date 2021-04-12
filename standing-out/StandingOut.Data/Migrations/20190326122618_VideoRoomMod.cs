using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class VideoRoomMod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ParticipantSid",
                table: "ClassSessionVideoRooms",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ClassSessionVideoRooms",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessionVideoRooms_UserId",
                table: "ClassSessionVideoRooms",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessionVideoRooms_AspNetUsers_UserId",
                table: "ClassSessionVideoRooms",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessionVideoRooms_AspNetUsers_UserId",
                table: "ClassSessionVideoRooms");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessionVideoRooms_UserId",
                table: "ClassSessionVideoRooms");

            migrationBuilder.DropColumn(
                name: "ParticipantSid",
                table: "ClassSessionVideoRooms");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ClassSessionVideoRooms");
        }
    }
}
