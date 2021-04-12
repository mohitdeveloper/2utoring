using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SaveRework : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<string>(
                name: "FileLocation",
                table: "SessionWhiteBoardSave",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileLocation",
                table: "SessionWhiteBoardSave");

            migrationBuilder.AlterColumn<Guid>(
                name: "SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);
        }
    }
}
