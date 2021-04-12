using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SessionStartEndFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DueEndDate",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Ended",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndedAtDate",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Started",
                table: "ClassSessions",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAtDate",
                table: "ClassSessions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueEndDate",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "Ended",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "EndedAtDate",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "Started",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "StartedAtDate",
                table: "ClassSessions");
        }
    }
}
