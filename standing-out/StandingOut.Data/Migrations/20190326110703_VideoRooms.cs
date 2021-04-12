using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class VideoRooms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClassSessionVideoRooms",
                columns: table => new
                {
                    ClassSessionVideoRoomId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    RoomSid = table.Column<string>(maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassSessionVideoRooms", x => x.ClassSessionVideoRoomId);
                    table.ForeignKey(
                        name: "FK_ClassSessionVideoRooms_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessionVideoRooms_ClassSessionId",
                table: "ClassSessionVideoRooms",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessionVideoRooms_IsDeleted",
                table: "ClassSessionVideoRooms",
                column: "IsDeleted");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassSessionVideoRooms");
        }
    }
}
