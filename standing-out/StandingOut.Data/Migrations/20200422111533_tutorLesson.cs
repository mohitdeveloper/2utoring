using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorLesson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BaseClassSessionCommision",
                table: "Settings",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<int>(
                name: "ScheduleType",
                table: "ClassSessions",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateTable(
                name: "SessionInvites",
                columns: table => new
                {
                    SessionInviteId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionInvites", x => x.SessionInviteId);
                    table.ForeignKey(
                        name: "FK_SessionInvites_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionInvites_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionInvites_ClassSessionId",
                table: "SessionInvites",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionInvites_IsDeleted",
                table: "SessionInvites",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SessionInvites_UserId",
                table: "SessionInvites",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionInvites");

            migrationBuilder.DropColumn(
                name: "BaseClassSessionCommision",
                table: "Settings");

            migrationBuilder.AlterColumn<int>(
                name: "ScheduleType",
                table: "ClassSessions",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
