"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StripePaymentMethod = /** @class */ (function () {
    function StripePaymentMethod() {
        this.card = new StripePaymentMethodCard();
    }
    return StripePaymentMethod;
}());
exports.StripePaymentMethod = StripePaymentMethod;
var StripePaymentMethodCard = /** @class */ (function () {
    function StripePaymentMethodCard() {
    }
    return StripePaymentMethodCard;
}());
exports.StripePaymentMethodCard = StripePaymentMethodCard;
//# sourceMappingURL=stripe-payment-method.js.map