using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class RefundedAmountInviteSent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "InviteSent",
                table: "SessionInvites",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "RefundedAmount",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.Sql("Update SessionInvites set InviteSent=1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InviteSent",
                table: "SessionInvites");

            migrationBuilder.DropColumn(
                name: "RefundedAmount",
                table: "SessionAttendees");
        }
    }
}
