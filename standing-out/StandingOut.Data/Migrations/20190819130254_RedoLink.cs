using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class RedoLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReDoneId",
                table: "SessionWhiteBoardHistory",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardHistory_ReDoneId",
                table: "SessionWhiteBoardHistory",
                column: "ReDoneId");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardHistory_SessionWhiteBoardHistory_ReDoneId",
                table: "SessionWhiteBoardHistory",
                column: "ReDoneId",
                principalTable: "SessionWhiteBoardHistory",
                principalColumn: "SessionWhiteBoardHistoryId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardHistory_SessionWhiteBoardHistory_ReDoneId",
                table: "SessionWhiteBoardHistory");

            migrationBuilder.DropIndex(
                name: "IX_SessionWhiteBoardHistory_ReDoneId",
                table: "SessionWhiteBoardHistory");

            migrationBuilder.DropColumn(
                name: "ReDoneId",
                table: "SessionWhiteBoardHistory");
        }
    }
}
