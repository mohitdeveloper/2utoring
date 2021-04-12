using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class FixCommissionTierRuleMin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
Update SubscriptionFeatures Set RuleMin = 0 
Where RuleCriteria ='StudentAttendanceRange' and RuleMin = 1
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
