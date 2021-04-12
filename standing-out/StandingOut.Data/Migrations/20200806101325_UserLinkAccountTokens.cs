using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class UserLinkAccountTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkAccountKeyOne",
                table: "AspNetUsers",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkAccountKeyTwo",
                table: "AspNetUsers",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LinkAccountRequestDate",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkAccountKeyOne",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LinkAccountKeyTwo",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LinkAccountRequestDate",
                table: "AspNetUsers");
        }
    }
}
