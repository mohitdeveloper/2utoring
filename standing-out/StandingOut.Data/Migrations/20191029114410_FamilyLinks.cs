using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class FamilyLinks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyLink",
                columns: table => new
                {
                    FamilyLinkId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ParentUserId = table.Column<string>(nullable: false),
                    ChildUserId = table.Column<string>(nullable: true),
                    ChildEmail = table.Column<string>(maxLength: 250, nullable: false),
                    RequestId = table.Column<Guid>(nullable: false),
                    LastRequestAt = table.Column<DateTime>(nullable: true),
                    Linked = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyLink", x => x.FamilyLinkId);
                    table.ForeignKey(
                        name: "FK_FamilyLink_AspNetUsers_ChildUserId",
                        column: x => x.ChildUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FamilyLink_AspNetUsers_ParentUserId",
                        column: x => x.ParentUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyLink_ChildUserId",
                table: "FamilyLink",
                column: "ChildUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyLink_IsDeleted",
                table: "FamilyLink",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyLink_ParentUserId",
                table: "FamilyLink",
                column: "ParentUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyLink");
        }
    }
}
