import { StripeCountry } from "./stripe-country";

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
    stripeCountry: StripeCountry;
}

export class MessageStatusUpdate {
    referenceId: any;
    userType: any;
    messageColumnName: string;
    messageStatus: boolean;
}