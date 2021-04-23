using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class AddColumntInSettingTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ConversionFlat",
                table: "Settings",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ConversionPercent",
                table: "Settings",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConversionFlat",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "ConversionPercent",
                table: "Settings");
        }
    }
}
