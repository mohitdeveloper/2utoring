using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class HistoryTypeOnHistoryREQUIRED : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE SessionWhiteBoardHistory SET UserId = 'aaac4e58-a870-4b30-a287-ac707bc8514f', HistoryType = 'Unknown'");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SessionWhiteBoardHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HistoryType",
                table: "SessionWhiteBoardHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SessionWhiteBoardHistory",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "HistoryType",
                table: "SessionWhiteBoardHistory",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
