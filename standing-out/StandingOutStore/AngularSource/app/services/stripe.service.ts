import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { StripeCard, Payment, StripeBankAccount, PaymentCardConnect, TableSearch, ReceiptIndex, 
    PagedList, StripeTableSearch, StripePagedList, Basket, CreateBasketOrderResponse } from '../models/index';
//import { PromoCode } from '../models/promo-code';

@Injectable()
export class StripeService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    validatePromoCode(promoCode: string): Observable<boolean> {
        return this.http.get<boolean>(this.serviceHelper.baseApi + '/api/stripe/ValidatePromoCode?promoCode=' + promoCode, { headers: this.serviceHelper.buildHeader() });
    }

    getCard(): Observable<StripeCard> {
        return this.http.get<StripeCard>(this.serviceHelper.baseApi + '/api/stripe/card', { headers: this.serviceHelper.buildHeader() });
    }

    deleteCard(paymentMethodId: string): Observable<void> {
        return this.http.delete<void>(this.serviceHelper.baseApi + '/api/stripe/card', { headers: this.serviceHelper.buildHeader() });
    }

    confirmSessionPayment(model: Payment): Observable<void> {
        return this.http.post<void>(this.serviceHelper.baseApi + '/api/stripe/confirmSessionPayment', model, { headers: this.serviceHelper.buildHeader() });
    }
    createBasketOrder(basketModel: Basket): Observable<CreateBasketOrderResponse> {
        return this.http.post<CreateBasketOrderResponse>(this.serviceHelper.baseApi + '/api/stripe/createBasketOrder', basketModel, { headers: this.serviceHelper.buildHeader() });
    }
    confirmBasketPayment(basketModel: Basket): Observable<void> {
        return this.http.post<void>(this.serviceHelper.baseApi + '/api/stripe/confirmBasketPayment', basketModel, { headers: this.serviceHelper.buildHeader() });
    }

    connectPaymentMethod(model: PaymentCardConnect): Observable<StripeCard> {
        return this.http.patch<StripeCard>(this.serviceHelper.baseApi + '/api/stripe/connectPaymentMethod', model, { headers: this.serviceHelper.buildHeader() });
    }

    getPagedReceipts(model: StripeTableSearch): Observable<StripePagedList<ReceiptIndex>> {
        return this.http.post<StripePagedList<ReceiptIndex>>(this.serviceHelper.baseApi + '/api/stripe/pagedReceipts', model, { headers: this.serviceHelper.buildHeader() });
    }

    getStripeConnectRedirect(): Observable<string> {
        return this.http.get<string>(this.serviceHelper.baseApi + '/api/stripe/StripeConnectRedirect', { headers: this.serviceHelper.buildHeader() });
    }

    getMyBankAccounts(): Observable<StripeBankAccount[]> {
        return this.http.get<StripeBankAccount[]>(this.serviceHelper.baseApi + '/api/stripe/BankAccounts', { headers: this.serviceHelper.buildHeader() });
    }

    getLoginLink(): Observable<string> {
        return this.http.get<string>(this.serviceHelper.baseApi + '/api/stripe/LoginLink', { headers: this.serviceHelper.buildHeader() });
    }

    patchBankId(id: string): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + `/api/stripe/StripeConnect/Bank/${id}`, null, { headers: this.serviceHelper.buildHeader() });
    }
}
    