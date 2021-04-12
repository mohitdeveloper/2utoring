export class ClassSession {
    classSessionId: string;
    ownerId: string;
    requiresGoogleAccount: boolean;
    name: string;
    subjectId: string;
    subjectCategoryId: string;
    studyLevelId: string;
    maxPersons: number;
    isUnder16: boolean;
    type: number;
    lessonDescriptionBody: string;
    startDate: Date;
    startDateDate: Date;
    startDateTime: Date;
    detailsDuration: number;
    scheduleType: string;
    scheduleEndDate?: Date;
    pricePerPerson: number;
    ended: boolean;
    complete: boolean;
    started: boolean;

    studentFees: number;
    standingOutFees: number;
    //tutorEarnings: number;
    earningsPaid: boolean;
    paymentStatus: string;
    vendorEarningAmount: number;

    sessionAttendeesCount: number;
    disableDateEdit: boolean = false;

    baseTutorDirectoryId: string; 

    sessionDirectoryName: string; 
    sessionDirectoryId: string; 
    baseStudentDirectoryId: string; 
    sharedStudentDirectoryId: string; 
    masterStudentDirectoryName: string; 
    masterStudentDirectoryId: string; 
  
    classSessions: [];

    constructor() { this.isUnder16 = false; this.scheduleType = 'Never'; }
}