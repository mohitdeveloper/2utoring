export class Company {
    companyId: string;
    stripePlanId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    paymentStatus: string;
    initialRegistrationComplete: boolean;
    initialRegistrationStep: number;
    //profileAuthorized: boolean;
    profileApprovalStatus: string;
    profileAuthorizedMessageRead: boolean;
    stripeConnectAccountId: string;
    stripeConnectBankAccountId: string;
    urlSlug: string;
    linkAccountMessageRead: boolean;
    
    // CompanyRegisterBasicInfo
    companyName:string;
    companyRegistrationNumber:string;
    addressLine1:string;
    addressLine2:string;
    country:string;
    companyPostcode:string;
    termsAndConditionsAccepted: boolean;
    marketingAccepted: boolean;
    companyEmail:string;
    companyTelephoneNumber:string;
    companyMobileNumber:string;

    hasGoogleAccountLinked: boolean;
    localLogin: boolean;
    userTitle: string;
    storeProfileImageDownload: string;
    // TODO continue here..
    userId: string;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    email: string;
    mobileNumber:string;
    //companyAddress:string;

    companyDescription:string;

    //meet the team form
    teamName:string;
    teamRole:string;
    teamDescription:string;
    
    //profile third form
    whoWeAre:string;
    whatWeDo:string;
    whyWeDoIt:string;
    whyChooseUs: string;

    pricePerPerson: number;
    status: number;
    baseTutorDirectoryId: string;

    //payment fields
    cardName: string;
    courseId: string;
    groupPricePerPerson: number;
    subjectNameList: any;
    userFullName: string;
    emailAddress: string;
    tutorId: string;
    stripeCountryID: string;
}
