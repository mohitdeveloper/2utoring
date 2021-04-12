using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class userDateFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update AspNetUsers set CreatedDate = GETDATE() where CreatedDate is null");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
