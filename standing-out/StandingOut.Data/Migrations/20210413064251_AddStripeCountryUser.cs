using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddStripeCountryUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_StripeCountryID",
                table: "AspNetUsers",
                column: "StripeCountryID");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_StripeCountrys_StripeCountryID",
                table: "AspNetUsers",
                column: "StripeCountryID",
                principalTable: "StripeCountrys",
                principalColumn: "StripeCountryId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_StripeCountrys_StripeCountryID",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_StripeCountryID",
                table: "AspNetUsers");
        }
    }
}
