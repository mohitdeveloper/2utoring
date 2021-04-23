import { StripeCountry } from "./stripe-country";

export class UserGuardianDetail {
    firstName: string;
    lastName: string;
    email: string;
    telephoneNumber: string;
    mobileNumber: string;

    childDateOfBirth: Date;
    childTitle: string;
    childFirstName: string;
    childLastName: string;

    marketingAccepted: boolean;
    termsAndConditionsAccepted: boolean;

    isSetupComplete: boolean;
    hasGoogleAccountLinked: boolean;
    localLogin: boolean;
    stripeCountry: StripeCountry;
}