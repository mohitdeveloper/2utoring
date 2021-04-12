using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorStripe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaymentStatus",
                table: "Tutors",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StripePlanId",
                table: "Tutors",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeSubscriptionId",
                table: "Tutors",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeKey",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "StripePlans",
                columns: table => new
                {
                    StripePlanId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    StripePlanType = table.Column<int>(nullable: false),
                    StripePlanLevel = table.Column<int>(nullable: false),
                    StripeProductId = table.Column<string>(maxLength: 1000, nullable: false),
                    Description = table.Column<string>(maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StripePlans", x => x.StripePlanId);
                });



            migrationBuilder.CreateIndex(
                name: "IX_StripePlans_IsDeleted",
                table: "StripePlans",
                column: "IsDeleted");

            migrationBuilder.AddForeignKey(
                name: "FK_Tutors_StripePlans_StripePlanId",
                table: "Tutors",
                column: "StripePlanId",
                principalTable: "StripePlans",
                principalColumn: "StripePlanId",
                onDelete: ReferentialAction.Restrict);


            migrationBuilder.Sql("insert into stripeplans values (newid(), null, null, null, null, 0, 0, 0, 'xxx', 'xxx')");
            migrationBuilder.Sql("update tutors set StripePlanId = (select top 1 stripeplanid from stripeplans)");

            migrationBuilder.AlterColumn<Guid>(
               name: "StripePlanId",
               table: "Tutors",
               nullable: false);

            migrationBuilder.CreateIndex(
    name: "IX_Tutors_StripePlanId",
    table: "Tutors",
    column: "StripePlanId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tutors_StripePlans_StripePlanId",
                table: "Tutors");

            migrationBuilder.DropTable(
                name: "StripePlans");

            migrationBuilder.DropIndex(
                name: "IX_Tutors_StripePlanId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripePlanId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripeSubscriptionId",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "StripeKey",
                table: "Settings");
        }
    }
}
