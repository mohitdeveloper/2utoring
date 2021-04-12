using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class TieredCommissionsByStudentCount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RuleCriteria",
                table: "SubscriptionFeatures",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RuleMax",
                table: "SubscriptionFeatures",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RuleMin",
                table: "SubscriptionFeatures",
                nullable: true);

            Drop_SubscriptionFeatures(migrationBuilder);
            Drop_Features(migrationBuilder);
            Create_Features(migrationBuilder);

            Setup_FeaturesFor_NoFeeTutorPlan(migrationBuilder);
            Setup_FeaturesFor_StarterTutorPlan(migrationBuilder);
            Setup_FeaturesFor_ProfessionalTutorPlan(migrationBuilder);
            Setup_FeaturesFor_CompanyPlan(migrationBuilder);
        }

        private void Drop_SubscriptionFeatures(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Delete from [dbo].[SubscriptionFeatures] 
            ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Drop_Features(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
                Delete from [dbo].[Features] 
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void Create_Features(MigrationBuilder migrationBuilder)
        {
            // -- 9 new switches added at end
            var sqlStatement = @"

Declare @migrationName nvarchar(2000) = 'TieredCommissionsByStudentCount-Migration'

Insert Into [dbo].[Features](FeatureId, [Name], FeatureArea, Context, IsDeleted, CreatedBy, CreatedDate) 
	Values 
		(NewID(),'ClassSize',								'TutorDashboard','CreateLesson'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'ClassSize',								'TutorDashboard','EditLesson'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Course',									'TutorDashboard','CreateCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Course',									'TutorDashboard','EditCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Course',									'Website','CreateCourse'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'Course',									'Website','BuyCourse'					,0, @migrationName, GETUTCDATE()),
		(NewID(),'PrivateLessonCount',						'TutorDashboard','CreateCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'PrivateLessonCount',						'TutorDashboard','EditCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'PublicLessonCount',						'TutorDashboard','CreateCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'PublicLessonCount',						'TutorDashboard','EditCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'MinutesBeforeEntry',						'Classroom','ClassroomEntryTime'		,0, @migrationName, GETUTCDATE()),
		(NewID(),'MaxGroups',								'ClassroomTutorCommand','Groups'		,0, @migrationName, GETUTCDATE()),
		(NewID(),'MaxGroups',								'TutorDashboard', 'Lesson'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'TriPane',									'ClassroomMenu','Panes'					,0, @migrationName, GETUTCDATE()),
		(NewID(),'QuadPane',								'ClassroomMenu' , 'Panes'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'ProfileLink',								'Website','TutorProfile'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'ProfilePage',								'Website','TutorProfile'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'Availability',							'TutorDashboard','CreateCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Availability',							'TutorDashboard','EditCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Availability',							'Website','CreateCourse'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'Availability',							'Website','BuyCourse'					,0, @migrationName, GETUTCDATE()),
		(NewID(),'ClientBooking',							'Website','CreateLesson'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'ClientBooking',							'Website','CreateCourse'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'SessionRecording',						'Classroom','EnterClass'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'StudentAttendancePerMonthTier',			'Admin','CommissionPerStudent'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'CompletedLesson',							'TutorDashboard','View'					,0, @migrationName, GETUTCDATE()),
		(NewID(),'CompletedLesson',							'StudentDashboard','View'				,0, @migrationName, GETUTCDATE()),
		(NewID(),'Under18',									'TutorDashboard','CreateCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'Under18',									'TutorDashboard','EditCourse'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'ApprovalRequired',						'AdminDashboard','DBSApproval'			,0, @migrationName, GETUTCDATE()),
		(NewID(),'ApprovalRequired',						'AdminDashboard','ProfileApproval'		,0, @migrationName, GETUTCDATE());
            ";
            migrationBuilder.Sql(sqlStatement);
        }

        private void Setup_FeaturesFor_NoFeeTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
Declare @RowDone int = 0

Declare @subsId nvarchar(1000)
Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'NoFeeTutorPlan' 
-- Select @subsId

Declare @FeatureId nvarchar(1000)

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	AND f.Context='CreateLesson' AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'2',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	AND f.Context='EditLesson'	 AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'2',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'		 AND f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard' AND f.Context='Lesson'			 AND  f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'0',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND f.[Name]='TriPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND  f.[Name]='QuadPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfileLink'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfilePage'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateLesson' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='EnterClass'	 AND f.[Name]='SessionRecording'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 0, 15, '4.00',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 16, 30, '3.75',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 31, 50, '3.50',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 51, 999999, '3.25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard' AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard' AND f.Context='EditCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard'	 AND f.Context='DBSApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard' AND f.Context='ProfileApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;


                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_StarterTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
Declare @RowDone int = 0

Declare @subsId nvarchar(1000)
Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'StarterTutorPlan' 
-- Select @subsId

Declare @FeatureId nvarchar(1000)

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateLesson' AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditLesson'	 AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'15',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'		 AND f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard' AND f.Context='Lesson'			 AND  f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'1',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND  f.[Name]='TriPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND  f.[Name]='QuadPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfileLink'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfilePage'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateLesson' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='EnterClass'	 AND f.[Name]='SessionRecording'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 0, 15, '4.00',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 16, 30, '3.75',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 31, 50, '3.50',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 51, 999999, '3.25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard' AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'Off',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard' AND f.Context='EditCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard'	 AND f.Context='DBSApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard' AND f.Context='ProfileApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_ProfessionalTutorPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"

Declare @RowDone int = 0

Declare @subsId nvarchar(1000)
Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'ProfessionalTutorPlan' 
-- Select @subsId

Declare @FeatureId nvarchar(1000)

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateLesson' AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditLesson'	 AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'25',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'		 AND f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard' AND f.Context='Lesson'			 AND  f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND f.[Name]='TriPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND  f.[Name]='QuadPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfileLink'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfilePage'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateLesson' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='EnterClass'	 AND f.[Name]='SessionRecording'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 0, 10, '3.50',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 11, 20, '3.25',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 21, 30, '3.00',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 31, 999999, '2.75',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard' AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard' AND f.Context='EditCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

	Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard'	 AND f.Context='DBSApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard' AND f.Context='ProfileApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

                ";
            migrationBuilder.Sql(sqlStatement);
        }
        private void Setup_FeaturesFor_CompanyPlan(MigrationBuilder migrationBuilder)
        {
            var sqlStatement = @"
Declare @RowDone int = 0

Declare @subsId nvarchar(1000)
Select @subsId = s.SubscriptionId from Subscriptions s Where s.SubscriptionName = 'CompanyPlan' 
Select @subsId

Declare @FeatureId nvarchar(1000)

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateLesson' AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditLesson'	 AND f.[Name]='ClassSize'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'10',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Course'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'100',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PrivateLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'100',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'100',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='PublicLessonCount'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'100',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='ClassroomEntryTime'	AND f.[Name]='MinutesBeforeEntry'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'30',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomTutorCommand'	AND f.Context='Groups'		 AND f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where	f.FeatureArea='TutorDashboard' AND f.Context='Lesson'			 AND  f.[Name]='MaxGroups'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'5',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND f.[Name]='TriPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='ClassroomMenu'	 AND f.Context='Panes'		 AND  f.[Name]='QuadPane'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfileLink'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='TutorProfile' AND f.[Name]='ProfilePage'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='EditCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='BuyCourse'	 AND f.[Name]='Availability'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateLesson' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Website'			 AND f.Context='CreateCourse' AND f.[Name]='ClientBooking'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Classroom'		 AND f.Context='EnterClass'	 AND f.[Name]='SessionRecording'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 0, 10, '3.50',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 11, 20, '3.25',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 21, 30, '3.00',0)
	Select @RowDone = @RowDone + 1;
Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='Admin'			 AND f.Context='CommissionPerStudent'	AND f.[Name]='StudentAttendancePerMonthTier'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, RuleCriteria, RuleMin, RuleMax, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId, 'StudentAttendanceRange', 31, 999999, '2.75',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='StudentDashboard' AND f.Context='View'		 AND f.[Name]='CompletedLesson'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard'	 AND f.Context='CreateCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='TutorDashboard' AND f.Context='EditCourse'		 AND f.[Name]='Under18'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

	Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard'	 AND f.Context='DBSApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

Select Top 1 @FeatureId = f.FeatureId from Features f Where f.FeatureArea='AdminDashboard' AND f.Context='ProfileApproval'		 AND f.[Name]='ApprovalRequired'
Insert Into SubscriptionFeatures (SubscriptionFeatureId, SubscriptionId, FeatureId, Setting, IsDeleted) Values (NewID(),@subsId,@FeatureId,'On',0)
	Select @RowDone = @RowDone + 1;

                ";
            migrationBuilder.Sql(sqlStatement);
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RuleCriteria",
                table: "SubscriptionFeatures");

            migrationBuilder.DropColumn(
                name: "RuleMax",
                table: "SubscriptionFeatures");

            migrationBuilder.DropColumn(
                name: "RuleMin",
                table: "SubscriptionFeatures");
        }
    }
}
