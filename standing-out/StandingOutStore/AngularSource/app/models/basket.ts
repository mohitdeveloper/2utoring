import { Payment, CourseInvite } from '../models/index';

export class Basket {
    orderId: string;
    totalToPay: number; // not required by backend, UI may calc and display to user.
    payment: Payment;
    basketItems: BasketItem[];
}

export class BasketItem {
    courseId: string;
    courseInvites: CourseInvite[]; // Only one prop for now CourseInvite.email
}

export class CreateBasketOrderResponse {
    basket: Basket; // original basket returned
    orderId: string; // populated by backend, if order created
    order: any; // the order object as created
    successResponses: []; 
    failResponses: []; // list of error messages
}
