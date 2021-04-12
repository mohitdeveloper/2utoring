using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class PromoCodeAndAttendeeMods : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_AspNetUsers_PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.DropTable(
                name: "FamilyLink");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "EmailPurchasedBy",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "PurchasedById",
                table: "SessionAttendees");

            migrationBuilder.AddColumn<Guid>(
                name: "PromoCodeId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PromoCodes",
                columns: table => new
                {
                    PromoCodeId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    AmountOff = table.Column<decimal>(nullable: true),
                    PercentOff = table.Column<decimal>(nullable: true),
                    MaxUses = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromoCodes", x => x.PromoCodeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_PromoCodeId",
                table: "SessionAttendees",
                column: "PromoCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodes_IsDeleted",
                table: "PromoCodes",
                column: "IsDeleted");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_PromoCodes_PromoCodeId",
                table: "SessionAttendees",
                column: "PromoCodeId",
                principalTable: "PromoCodes",
                principalColumn: "PromoCodeId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_PromoCodes_PromoCodeId",
                table: "SessionAttendees");

            migrationBuilder.DropTable(
                name: "PromoCodes");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_PromoCodeId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "PromoCodeId",
                table: "SessionAttendees");

            migrationBuilder.AddColumn<int>(
                name: "AppointmentId",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "EmailPurchasedBy",
                table: "SessionAttendees",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PurchasedById",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FamilyLink",
                columns: table => new
                {
                    FamilyLinkId = table.Column<Guid>(nullable: false),
                    ChildEmail = table.Column<string>(maxLength: 250, nullable: false),
                    ChildUserId = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    LastRequestAt = table.Column<DateTime>(nullable: true),
                    Linked = table.Column<bool>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    ParentUserId = table.Column<string>(nullable: false),
                    RequestId = table.Column<Guid>(nullable: true)
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
                name: "IX_SessionAttendees_PurchasedById",
                table: "SessionAttendees",
                column: "PurchasedById");

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

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_AspNetUsers_PurchasedById",
                table: "SessionAttendees",
                column: "PurchasedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
