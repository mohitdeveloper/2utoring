export class LessonCard {
    subjectName: string;
    subjectCategoryName: string;
    sessionName: string;
    studyLevelName: string;

    tutorId: string;
    tutorSalutation: string;
    tutorFirstName: string;
    tutorLastName: string;
    tutorProfileImageFileLocation: string;
    isApproved: boolean;
    tutorSubjects: string[];

    sessionDuration: number; // minutes
    sessionRemainingSpaces: number;
    sessionDate: Date;

    sessionDescriptionBody: string;

    sessionPrice: number;
    sessionCurrency: string;

    classSessionId: string;

    isUnder16: boolean;
    isUnder18: boolean;
    requiresGoogleAccount: boolean;
}