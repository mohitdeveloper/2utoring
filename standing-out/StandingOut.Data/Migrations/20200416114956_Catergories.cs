using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class Catergories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LessonDescripionHeader",
                table: "ClassSessions",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LessonDescriptionBody",
                table: "ClassSessions",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxPersons",
                table: "ClassSessions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "PricePerPerson",
                table: "ClassSessions",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "StudyLevelId",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectCategoryId",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectId",
                table: "ClassSessions",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StudyLevels",
                columns: table => new
                {
                    StudyLevelId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyLevels", x => x.StudyLevelId);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    SubjectId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.SubjectId);
                });

            migrationBuilder.CreateTable(
                name: "SubjectCategories",
                columns: table => new
                {
                    SubjectCategoryId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    SubjectId = table.Column<Guid>(nullable: true),
                    Name = table.Column<string>(maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectCategories", x => x.SubjectCategoryId);
                    table.ForeignKey(
                        name: "FK_SubjectCategories_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessions_StudyLevelId",
                table: "ClassSessions",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessions_SubjectCategoryId",
                table: "ClassSessions",
                column: "SubjectCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSessions_SubjectId",
                table: "ClassSessions",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudyLevels_IsDeleted",
                table: "StudyLevels",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectCategories_IsDeleted",
                table: "SubjectCategories",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectCategories_SubjectId",
                table: "SubjectCategories",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_IsDeleted",
                table: "Subjects",
                column: "IsDeleted");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessions_StudyLevels_StudyLevelId",
                table: "ClassSessions",
                column: "StudyLevelId",
                principalTable: "StudyLevels",
                principalColumn: "StudyLevelId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessions_SubjectCategories_SubjectCategoryId",
                table: "ClassSessions",
                column: "SubjectCategoryId",
                principalTable: "SubjectCategories",
                principalColumn: "SubjectCategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSessions_Subjects_SubjectId",
                table: "ClassSessions",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "SubjectId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessions_StudyLevels_StudyLevelId",
                table: "ClassSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessions_SubjectCategories_SubjectCategoryId",
                table: "ClassSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSessions_Subjects_SubjectId",
                table: "ClassSessions");

            migrationBuilder.DropTable(
                name: "StudyLevels");

            migrationBuilder.DropTable(
                name: "SubjectCategories");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessions_StudyLevelId",
                table: "ClassSessions");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessions_SubjectCategoryId",
                table: "ClassSessions");

            migrationBuilder.DropIndex(
                name: "IX_ClassSessions_SubjectId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "LessonDescripionHeader",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "LessonDescriptionBody",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "MaxPersons",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "PricePerPerson",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "StudyLevelId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "SubjectCategoryId",
                table: "ClassSessions");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "ClassSessions");
        }
    }
}
