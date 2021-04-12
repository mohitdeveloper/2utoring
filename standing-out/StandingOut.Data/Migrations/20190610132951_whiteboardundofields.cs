using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class whiteboardundofields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "UnDone",
                table: "SessionWhiteBoardHistory",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UnDoneDate",
                table: "SessionWhiteBoardHistory",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnDone",
                table: "SessionWhiteBoardHistory");

            migrationBuilder.DropColumn(
                name: "UnDoneDate",
                table: "SessionWhiteBoardHistory");
        }
    }
}
