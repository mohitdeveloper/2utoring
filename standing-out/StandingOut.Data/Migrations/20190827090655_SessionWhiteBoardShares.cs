using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SessionWhiteBoardShares : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSaves_ClassSessions_ClassSessionId",
                table: "SessionWhiteBoardSaves");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSaves_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSaves");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSaves_AspNetUsers_UserId",
                table: "SessionWhiteBoardSaves");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SessionWhiteBoardSaves",
                table: "SessionWhiteBoardSaves");

            migrationBuilder.RenameTable(
                name: "SessionWhiteBoardSaves",
                newName: "SessionWhiteBoardSave");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSaves_UserId",
                table: "SessionWhiteBoardSave",
                newName: "IX_SessionWhiteBoardSave_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSaves_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                newName: "IX_SessionWhiteBoardSave_SessionWhiteBoardId");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSaves_ClassSessionId",
                table: "SessionWhiteBoardSave",
                newName: "IX_SessionWhiteBoardSave_ClassSessionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SessionWhiteBoardSave",
                table: "SessionWhiteBoardSave",
                column: "SessionWhiteBoardSaveId");

            migrationBuilder.CreateTable(
                name: "SessionWhiteBoardShare",
                columns: table => new
                {
                    SessionWhiteBoardShareId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    SessionWhiteBoardId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    WritePermissions = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionWhiteBoardShare", x => x.SessionWhiteBoardShareId);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardShare_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardShare_SessionWhiteBoards_SessionWhiteBoardId",
                        column: x => x.SessionWhiteBoardId,
                        principalTable: "SessionWhiteBoards",
                        principalColumn: "SessionWhiteBoardId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardShare_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardShare_ClassSessionId",
                table: "SessionWhiteBoardShare",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardShare_SessionWhiteBoardId",
                table: "SessionWhiteBoardShare",
                column: "SessionWhiteBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardShare_UserId",
                table: "SessionWhiteBoardShare",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSave_ClassSessions_ClassSessionId",
                table: "SessionWhiteBoardSave",
                column: "ClassSessionId",
                principalTable: "ClassSessions",
                principalColumn: "ClassSessionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSave_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                column: "SessionWhiteBoardId",
                principalTable: "SessionWhiteBoards",
                principalColumn: "SessionWhiteBoardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSave_AspNetUsers_UserId",
                table: "SessionWhiteBoardSave",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSave_ClassSessions_ClassSessionId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSave_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSave_AspNetUsers_UserId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropTable(
                name: "SessionWhiteBoardShare");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SessionWhiteBoardSave",
                table: "SessionWhiteBoardSave");

            migrationBuilder.RenameTable(
                name: "SessionWhiteBoardSave",
                newName: "SessionWhiteBoardSaves");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSave_UserId",
                table: "SessionWhiteBoardSaves",
                newName: "IX_SessionWhiteBoardSaves_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSave_SessionWhiteBoardId",
                table: "SessionWhiteBoardSaves",
                newName: "IX_SessionWhiteBoardSaves_SessionWhiteBoardId");

            migrationBuilder.RenameIndex(
                name: "IX_SessionWhiteBoardSave_ClassSessionId",
                table: "SessionWhiteBoardSaves",
                newName: "IX_SessionWhiteBoardSaves_ClassSessionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SessionWhiteBoardSaves",
                table: "SessionWhiteBoardSaves",
                column: "SessionWhiteBoardSaveId");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSaves_ClassSessions_ClassSessionId",
                table: "SessionWhiteBoardSaves",
                column: "ClassSessionId",
                principalTable: "ClassSessions",
                principalColumn: "ClassSessionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSaves_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSaves",
                column: "SessionWhiteBoardId",
                principalTable: "SessionWhiteBoards",
                principalColumn: "SessionWhiteBoardId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSaves_AspNetUsers_UserId",
                table: "SessionWhiteBoardSaves",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
