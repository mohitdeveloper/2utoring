import { Company } from "./company";

export class Tutor {
    tutorId: string;
    stripePlanId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    paymentStatus: string;
    initialRegistrationComplete: boolean;
    initialRegistrationStep: number;
    //profileAuthorized: boolean;
    profileApprovalStatus: string;
    profileAuthorizedMessageRead: boolean;
    hasDbsCheck: boolean;
    dbsCertificateNumber: string;
    //dbsAdminApproved: boolean;
    dbsApprovalStatus: string;

    dbsAdminApprovedMessageRead: boolean;
    dbsCertificateFileLocation: string;
    dbsCertificateFileName: string;
    header: string;
    subHeader: string;
    profileTeachingExperiance: string;
    profileHowITeach: string;
    stripeConnectAccountId: string;
    stripeConnectBankAccountId: string;
    urlSlug: string;
    linkAccountMessageRead: boolean;

    hasGoogleAccountLinked: boolean;
    localLogin: boolean;
    userFullName: string;
    userFirstName: string;
    userTitle: string;
    userId: string;
    userEmail: string;
    storeProfileImageDownload: string;
        
    currentCompany: Company;

    bankAccountNumber: string;
    bankSortCode: string;
    addressLine1: string;
    postCode: string;
    registerdEvents: any;
    tutorCourseList: any;
    subjectStudyLevelSetup: any;
    biography: any;
    tutorSubjectNameList: any;
    tutorPriceLesson: any;
    tutorQualification: any;
    tutorCertificates: any;
    profileImageFileLocation: any;
    stripeCountry: any;
}