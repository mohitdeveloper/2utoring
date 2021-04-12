using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class whatsAppAdditionalFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "SessionOneToOneChatInstances",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SessionOneToOneChatInstanceId",
                table: "SessionMessages",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SessionMessages_SessionOneToOneChatInstanceId",
                table: "SessionMessages",
                column: "SessionOneToOneChatInstanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionMessages_SessionOneToOneChatInstances_SessionOneToOneChatInstanceId",
                table: "SessionMessages",
                column: "SessionOneToOneChatInstanceId",
                principalTable: "SessionOneToOneChatInstances",
                principalColumn: "SessionOneToOneChatInstanceId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionMessages_SessionOneToOneChatInstances_SessionOneToOneChatInstanceId",
                table: "SessionMessages");

            migrationBuilder.DropIndex(
                name: "IX_SessionMessages_SessionOneToOneChatInstanceId",
                table: "SessionMessages");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "SessionOneToOneChatInstances");

            migrationBuilder.DropColumn(
                name: "SessionOneToOneChatInstanceId",
                table: "SessionMessages");
        }
    }
}
