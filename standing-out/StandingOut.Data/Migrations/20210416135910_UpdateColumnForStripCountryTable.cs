using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class UpdateColumnForStripCountryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "DecimalMultiplier",
                table: "StripeCountrys",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CurrencyOrder",
                table: "StripeCountrys",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "DecimalMultiplier",
                table: "StripeCountrys",
                nullable: true,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<int>(
                name: "CurrencyOrder",
                table: "StripeCountrys",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
