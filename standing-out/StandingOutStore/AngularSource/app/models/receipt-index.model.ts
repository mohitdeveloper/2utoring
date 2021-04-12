export class ReceiptIndex {
    id: string;
    amount: number;
    amountRefunded: number;
    created: Date;
    currency: string;
    status: string;
    lessonStartDate: Date;
    classSessionId: string;
    sessionAttendeeId: string;
    refunded: boolean;

    classSessionName: string;
}