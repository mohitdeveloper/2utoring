using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class StudentInitiatedRefund : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRefundStudentInitiated",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(@"
                        Update [SessionAttendees]
                        Set IsRefundStudentInitiated = 1
                        From 
                        [SessionAttendees] sa Inner Join AspNetUsers u On sa.UserId = u.Id
                        WHERE 
                        sa.RefundedBy is not null AND sa.Refunded = 1 AND sa.UserId is not null 
                        and (
                        UPPER(sa.RefundedBy) = UPPER(COALESCE(u.Email, '-')) 
                        OR
                        UPPER(sa.RefundedBy) = UPPER(COALESCE(u.GoogleEmail, '-')) 
                        OR
                        UPPER(sa.RefundedBy) = UPPER(COALESCE(u.ContactEmail, '-')) 
                        )
                        AND NOT Exists(Select ur.RoleId from AspNetUserRoles ur Where ur.UserId = u.Id)
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRefundStudentInitiated",
                table: "SessionAttendees");
        }
    }
}
