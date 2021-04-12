using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class NewSetting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactUsEmail",
                table: "Settings",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyTutors_IsDeleted",
                table: "CompanyTutors",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Companys_IsDeleted",
                table: "Companys",
                column: "IsDeleted");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CompanyTutors_IsDeleted",
                table: "CompanyTutors");

            migrationBuilder.DropIndex(
                name: "IX_Companys_IsDeleted",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "ContactUsEmail",
                table: "Settings");
        }
    }
}
