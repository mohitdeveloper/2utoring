export class UserDetail {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    telephoneNumber: string;
    mobileNumber: string;
    marketingAccepted: boolean;
    termsAndConditionsAccepted: boolean;
    isSetupComplete: boolean;
    hasGoogleAccountLinked: boolean;
    localLogin: boolean;
}

export class MessageStatusUpdate {
    referenceId: any;
    userType: any;
    messageColumnName: string;
    messageStatus: boolean;
}