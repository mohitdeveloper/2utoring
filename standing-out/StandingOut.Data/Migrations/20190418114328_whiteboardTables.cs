using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class whiteboardTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SessionWhiteBoards",
                columns: table => new
                {
                    SessionWhiteBoardId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    SessionGroupId = table.Column<Guid>(nullable: true),
                    UserId = table.Column<string>(nullable: true),
                    CurrentCanvas = table.Column<string>(maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionWhiteBoards", x => x.SessionWhiteBoardId);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoards_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoards_SessionGroups_SessionGroupId",
                        column: x => x.SessionGroupId,
                        principalTable: "SessionGroups",
                        principalColumn: "SessionGroupId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoards_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SessionWhiteBoardHistory",
                columns: table => new
                {
                    SessionWhiteBoardHistoryId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SessionWhiteBoardId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    JsonData = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionWhiteBoardHistory", x => x.SessionWhiteBoardHistoryId);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardHistory_SessionWhiteBoards_SessionWhiteBoardId",
                        column: x => x.SessionWhiteBoardId,
                        principalTable: "SessionWhiteBoards",
                        principalColumn: "SessionWhiteBoardId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardHistory_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardHistory_SessionWhiteBoardId",
                table: "SessionWhiteBoardHistory",
                column: "SessionWhiteBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardHistory_UserId",
                table: "SessionWhiteBoardHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoards_ClassSessionId",
                table: "SessionWhiteBoards",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoards_SessionGroupId",
                table: "SessionWhiteBoards",
                column: "SessionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoards_UserId",
                table: "SessionWhiteBoards",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionWhiteBoardHistory");

            migrationBuilder.DropTable(
                name: "SessionWhiteBoards");
        }
    }
}
