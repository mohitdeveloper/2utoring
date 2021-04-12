export class StripeSubscription {
    name: string;
    status: string;
    amount: number;
    stripePlanId: string = null;
}

export class DbscheckApproval {
    adminDashboard_ProfileApproval_ApprovalRequired: boolean;
    adminDashboard_DBSApproval_ApprovalRequired: boolean;
}
