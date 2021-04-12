using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SessionWhiteboardSaves : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsInactive",
                table: "SessionWhiteBoards",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "SessionWhiteBoardSaves",
                columns: table => new
                {
                    SessionWhiteBoardSaveId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    SessionWhiteBoardId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionWhiteBoardSaves", x => x.SessionWhiteBoardSaveId);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardSaves_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardSaves_SessionWhiteBoards_SessionWhiteBoardId",
                        column: x => x.SessionWhiteBoardId,
                        principalTable: "SessionWhiteBoards",
                        principalColumn: "SessionWhiteBoardId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionWhiteBoardSaves_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardSaves_ClassSessionId",
                table: "SessionWhiteBoardSaves",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardSaves_SessionWhiteBoardId",
                table: "SessionWhiteBoardSaves",
                column: "SessionWhiteBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardSaves_UserId",
                table: "SessionWhiteBoardSaves",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionWhiteBoardSaves");

            migrationBuilder.DropColumn(
                name: "IsInactive",
                table: "SessionWhiteBoards");
        }
    }
}
