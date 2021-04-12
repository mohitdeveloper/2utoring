using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class HubObject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "HubId",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Hub",
                columns: table => new
                {
                    HubId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SubDomain = table.Column<string>(maxLength: 8, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hub", x => x.HubId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessions_HubId",
                table: "ClassSessions",
                column: "HubId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessions_Hub_HubId",
                table: "ClassSessions",
                column: "HubId",
                principalTable: "Hub",
                principalColumn: "HubId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessions_Hub_HubId",
                table: "ClassSessions");

            migrationBuilder.DropTable(
                name: "Hub");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessions_HubId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "HubId",
                table: "ClassSessions");
        }
    }
}
