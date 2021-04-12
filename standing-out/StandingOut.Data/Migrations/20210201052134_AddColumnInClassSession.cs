using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddColumnInClassSession : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "GoogleFilePermissions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Cancel",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Refunded",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_GoogleFilePermissions_ClassSessionId",
                table: "GoogleFilePermissions",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_GoogleFilePermissions_SessionAttendeeId",
                table: "GoogleFilePermissions",
                column: "SessionAttendeeId");

            migrationBuilder.CreateIndex(
                name: "IX_GoogleFilePermissions_UserId",
                table: "GoogleFilePermissions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoogleFilePermissions_ClassSessions_ClassSessionId",
                table: "GoogleFilePermissions",
                column: "ClassSessionId",
                principalTable: "ClassSessions",
                principalColumn: "ClassSessionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GoogleFilePermissions_SessionAttendees_SessionAttendeeId",
                table: "GoogleFilePermissions",
                column: "SessionAttendeeId",
                principalTable: "SessionAttendees",
                principalColumn: "SessionAttendeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GoogleFilePermissions_AspNetUsers_UserId",
                table: "GoogleFilePermissions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoogleFilePermissions_ClassSessions_ClassSessionId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_GoogleFilePermissions_SessionAttendees_SessionAttendeeId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_GoogleFilePermissions_AspNetUsers_UserId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropIndex(
                name: "IX_GoogleFilePermissions_ClassSessionId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropIndex(
                name: "IX_GoogleFilePermissions_SessionAttendeeId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropIndex(
                name: "IX_GoogleFilePermissions_UserId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropColumn(
                name: "Cancel",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "Refunded",
                table: "ClassSessions");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "GoogleFilePermissions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
