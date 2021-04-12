export class ClassSessionFeatures {
    tutorDashboard_EditLesson_Session_MaxPersons: number
    tutorDashboard_CreateLesson_Session_MaxPersons: number
    //tutorDashboard_CreateLesson_PrivateLessonAllowed: boolean
    //tutorDashboard_EditLesson_PrivateLessonAllowed: boolean
    tutorDashboard_CreateCourse_PrivateLessonCount: number
    tutorDashboard_EditCourse_PrivateLessonCount: number
    tutorDashboard_CreateCourse_PublicLessonCount: number
    tutorDashboard_EditCourse_PublicLessonCount: number

    classroom_ClassroomEntryTime_MinutesBeforeEntry: number
    //tutorCommand_Groups_MaxGroupSize: number
    //tutorDashboard_Lesson_GroupSize: number
    classroomTutorCommand_Groups_MaxGroups: number
    tutorDashboard_Lesson_MaxGroups: number

    menu_Panes_TriPaneEnabled :boolean
    menu_Panes_QuadPaneEnabled:boolean
    //openDoc_Panes_TriPaneEnabled: boolean
    //openDoc_Panes_QuadPaneEnabled: boolean
    classroom_EnterClass_SessionRecordingEnabled: boolean
    tutorDashboard_View_CompletedLesson: boolean
    studentDashboard_View_CompletedLesson: boolean
    admin_CommissionPerStudent_StudentAttendancePerMonthTiers: any[]
    admin_CommissionPerStudent: number[]

    tutorDashboard_CreateCourse_Under18: boolean
    tutorDashboard_EditCourse_Under18: boolean
    adminDashboard_DBSApproval_ApprovalRequired: boolean
    adminDashboard_ProfileApproval_ApprovalRequired: boolean
}
    //  admin_CommissionPerStudent_StudentAttendancePerMonthTiers AN ITEM = 
    //  {  "ruleCriteria": "StudentAttendanceRange",
    //      "ruleMin": 11,
    //      "ruleMax": 20,
    //      "setting": 3.25 }

