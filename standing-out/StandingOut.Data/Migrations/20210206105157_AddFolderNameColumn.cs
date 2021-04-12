using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddFolderNameColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoogleFilePermissions_ClassSessions_ClassSessionId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_GoogleFilePermissions_AspNetUsers_UserId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropIndex(
                name: "IX_GoogleFilePermissions_ClassSessionId",
                table: "GoogleFilePermissions");

            migrationBuilder.DropIndex(
                name: "IX_GoogleFilePermissions_UserId",
                table: "GoogleFilePermissions");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "GoogleFilePermissions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderName",
                table: "GoogleFilePermissions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FolderName",
                table: "GoogleFilePermissions");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "GoogleFilePermissions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GoogleFilePermissions_ClassSessionId",
                table: "GoogleFilePermissions",
                column: "ClassSessionId");

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
                name: "FK_GoogleFilePermissions_AspNetUsers_UserId",
                table: "GoogleFilePermissions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
