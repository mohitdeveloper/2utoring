using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddColumnsInStripeCountryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrencyCode",
                table: "StripeCountrys",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrencySymbol",
                table: "StripeCountrys",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DecimalMultiplier",
                table: "StripeCountrys",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrencyCode",
                table: "StripeCountrys");

            migrationBuilder.DropColumn(
                name: "CurrencySymbol",
                table: "StripeCountrys");

            migrationBuilder.DropColumn(
                name: "DecimalMultiplier",
                table: "StripeCountrys");
        }
    }
}
