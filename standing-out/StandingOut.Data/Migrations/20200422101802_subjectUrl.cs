using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class subjectUrl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Subjects",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "SubjectCategories",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "StudyLevels",
                maxLength: 300,
                nullable: true);



            migrationBuilder.Sql("UPDATE StudyLevels SET IsDeleted = 1 WHERE StudyLevelId = '91AB5876-0766-4AA2-D085-08D7E1FCA40D'");
            migrationBuilder.Sql("UPDATE StudyLevels SET Url = 'gcse' WHERE StudyLevelId = '070461A8-461C-4456-9D8C-0E51D48D744B'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "Subjects");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "SubjectCategories");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "StudyLevels");
        }
    }
}
