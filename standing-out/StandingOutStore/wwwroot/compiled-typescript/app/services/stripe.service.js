"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
//import { PromoCode } from '../models/promo-code';
var StripeService = /** @class */ (function () {
    function StripeService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    StripeService.prototype.validatePromoCode = function (promoCode) {
        return this.http.get(this.serviceHelper.baseApi + '/api/stripe/ValidatePromoCode?promoCode=' + promoCode, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.getCard = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/stripe/card', { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.deleteCard = function (paymentMethodId) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/stripe/card', { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.confirmSessionPayment = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/stripe/confirmSessionPayment', model, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.createBasketOrder = function (basketModel) {
        return this.http.post(this.serviceHelper.baseApi + '/api/stripe/createBasketOrder', basketModel, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.confirmBasketPayment = function (basketModel) {
        return this.http.post(this.serviceHelper.baseApi + '/api/stripe/confirmBasketPayment', basketModel, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.connectPaymentMethod = function (model) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/stripe/connectPaymentMethod', model, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.getPagedReceipts = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/stripe/pagedReceipts', model, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.getStripeConnectRedirect = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/stripe/StripeConnectRedirect', { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.getMyBankAccounts = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/stripe/BankAccounts', { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.getLoginLink = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/stripe/LoginLink', { headers: this.serviceHelper.buildHeader() });
    };
    StripeService.prototype.patchBankId = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + ("/api/stripe/StripeConnect/Bank/" + id), null, { headers: this.serviceHelper.buildHeader() });
    };
    StripeService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], StripeService);
    return StripeService;
}());
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map