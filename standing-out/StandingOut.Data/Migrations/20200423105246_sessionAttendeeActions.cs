using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class sessionAttendeeActions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Refunded",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RefundedBy",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefundedDate",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Removed",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RemovedBy",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RemovedDate",
                table: "SessionAttendees",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "Refunded",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RefundedBy",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RefundedDate",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "Removed",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RemovedBy",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RemovedDate",
                table: "SessionAttendees");
        }
    }
}
