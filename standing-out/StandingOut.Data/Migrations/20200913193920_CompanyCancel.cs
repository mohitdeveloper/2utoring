using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class CompanyCancel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompanyCancelAccountReason",
                table: "Companys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyCancelAccountReasonDescription",
                table: "Companys",
                maxLength: 1000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyCancelAccountReason",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "CompanyCancelAccountReasonDescription",
                table: "Companys");
        }
    }
}
