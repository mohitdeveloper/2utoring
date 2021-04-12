using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class whatsApp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SessionOneToOneChatInstances",
                columns: table => new
                {
                    SessionOneToOneChatInstanceId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionOneToOneChatInstances", x => x.SessionOneToOneChatInstanceId);
                    table.ForeignKey(
                        name: "FK_SessionOneToOneChatInstances_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SessionOneToOneChatInstanceUsers",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    SessionOneToOneChatInstanceId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionOneToOneChatInstanceUsers", x => new { x.UserId, x.SessionOneToOneChatInstanceId });
                    table.ForeignKey(
                        name: "FK_SessionOneToOneChatInstanceUsers_SessionOneToOneChatInstances_SessionOneToOneChatInstanceId",
                        column: x => x.SessionOneToOneChatInstanceId,
                        principalTable: "SessionOneToOneChatInstances",
                        principalColumn: "SessionOneToOneChatInstanceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionOneToOneChatInstanceUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionOneToOneChatInstances_ClassSessionId",
                table: "SessionOneToOneChatInstances",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionOneToOneChatInstances_IsDeleted",
                table: "SessionOneToOneChatInstances",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SessionOneToOneChatInstanceUsers_SessionOneToOneChatInstanceId",
                table: "SessionOneToOneChatInstanceUsers",
                column: "SessionOneToOneChatInstanceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionOneToOneChatInstanceUsers");

            migrationBuilder.DropTable(
                name: "SessionOneToOneChatInstances");
        }
    }
}
