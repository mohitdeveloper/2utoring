using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class tutorSubjectLevels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TutorSubjects_StudyLevels_StudyLevelId",
                table: "TutorSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TutorSubjects_StudyLevelId",
                table: "TutorSubjects");

            migrationBuilder.DropColumn(
                name: "StudyLevelId",
                table: "TutorSubjects");

            migrationBuilder.CreateTable(
                name: "TutorSubjectStudyLevels",
                columns: table => new
                {
                    TutorSubjectStudyLevelId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorSubjectId = table.Column<Guid>(nullable: false),
                    StudyLevelId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorSubjectStudyLevels", x => x.TutorSubjectStudyLevelId);
                    table.ForeignKey(
                        name: "FK_TutorSubjectStudyLevels_StudyLevels_StudyLevelId",
                        column: x => x.StudyLevelId,
                        principalTable: "StudyLevels",
                        principalColumn: "StudyLevelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorSubjectStudyLevels_TutorSubjects_TutorSubjectId",
                        column: x => x.TutorSubjectId,
                        principalTable: "TutorSubjects",
                        principalColumn: "TutorSubjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectStudyLevels_IsDeleted",
                table: "TutorSubjectStudyLevels",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectStudyLevels_StudyLevelId",
                table: "TutorSubjectStudyLevels",
                column: "StudyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectStudyLevels_TutorSubjectId",
                table: "TutorSubjectStudyLevels",
                column: "TutorSubjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TutorSubjectStudyLevels");

            migrationBuilder.AddColumn<Guid>(
                name: "StudyLevelId",
                table: "TutorSubjects",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjects_StudyLevelId",
                table: "TutorSubjects",
                column: "StudyLevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_TutorSubjects_StudyLevels_StudyLevelId",
                table: "TutorSubjects",
                column: "StudyLevelId",
                principalTable: "StudyLevels",
                principalColumn: "StudyLevelId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
