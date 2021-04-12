using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class MissedPartsRework : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionWhiteBoardSave_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropIndex(
                name: "IX_SessionWhiteBoardSave_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.DropColumn(
                name: "SessionWhiteBoardId",
                table: "SessionWhiteBoardSave");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SessionWhiteBoardSave",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SessionWhiteBoardSave",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);


            migrationBuilder.Sql("UPDATE SessionWhiteBoardSave SET FileLocation = 'Placeholder'");

            migrationBuilder.AlterColumn<string>(
                name: "FileLocation",
                table: "SessionWhiteBoardSave",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SessionWhiteBoardSave",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SessionWhiteBoardSave",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "FileLocation",
                table: "SessionWhiteBoardSave",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<Guid>(
                name: "SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SessionWhiteBoardSave_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                column: "SessionWhiteBoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionWhiteBoardSave_SessionWhiteBoards_SessionWhiteBoardId",
                table: "SessionWhiteBoardSave",
                column: "SessionWhiteBoardId",
                principalTable: "SessionWhiteBoards",
                principalColumn: "SessionWhiteBoardId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
