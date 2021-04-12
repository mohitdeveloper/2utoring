using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class CatergoryMove : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Subjects (SubjectId, [Name], CreatedDate, CreatedBy, IsDeleted) " +
                "VALUES (NEWID(), 'Maths', GETDATE(), 'Migration', 0)");
            migrationBuilder.Sql("INSERT INTO StudyLevels (StudyLevelId, [Name], [Order], CreatedDate, CreatedBy, IsDeleted) " +
                "VALUES (NEWID(), 'GCSE', 1, GETDATE(), 'Migration', 0)");

            migrationBuilder.Sql("UPDATE ClassSessions " +
                "SET SubjectId = (SELECT TOP 1 SubjectId FROM Subjects), " +
                "StudyLevelId = (SELECT TOP 1 StudyLevelId FROM StudyLevels)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE ClassSessions " +
                "SET SubjectId = NULL, " +
                "StudyLevelId = NULL");
            migrationBuilder.Sql("DELETE FROM StudyLevels");
            migrationBuilder.Sql("DELETE FROM Subjects");
        }
    }
}
