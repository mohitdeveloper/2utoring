using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class SubjectStudyLevelSetupAddCol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "GroupPricePerPerson",
                table: "SubjectStudyLevelSetups",
                type: "decimal(13,4)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupPricePerPerson",
                table: "SubjectStudyLevelSetups");
        }
    }
}
