using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class classSessionNewFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduleEndDate",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ScheduleType",
                table: "ClassSessions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "ClassSessions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScheduleEndDate",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "ScheduleType",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "ClassSessions");
        }
    }
}
