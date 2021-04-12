using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class FixSubscriptionRates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
Update Subscriptions Set Description = 'Basic' Where SubscriptionName = 'NoFeeTutorPlan';
Update Subscriptions Set SubscriptionPrice = 9.99 Where SubscriptionName = 'StarterTutorPlan';
Update Subscriptions Set SubscriptionPrice = 19.99 Where SubscriptionName = 'ProfessionalTutorPlan';
Update Subscriptions Set SubscriptionPrice = 29.99 Where SubscriptionName = 'CompanyPlan';
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
