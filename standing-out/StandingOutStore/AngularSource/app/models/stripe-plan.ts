import {Subscription} from '../models/index';

export class StripePlan {
    stripePlanId: string;
    stripePlanType: number;
    stripePlanLevel: number;
    stripeProductId: string;
    description: string;
    subscription: Subscription;
    subscriptionId: string;
    freeDays: number;
}