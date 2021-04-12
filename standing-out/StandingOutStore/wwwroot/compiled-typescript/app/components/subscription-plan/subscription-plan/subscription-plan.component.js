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
exports.SubscriptionPlanComponent = void 0;
var core_1 = require("@angular/core");
var SubscriptionPlanComponent = /** @class */ (function () {
    function SubscriptionPlanComponent() {
    }
    SubscriptionPlanComponent.prototype.ngOnInit = function () {
        this.planSubscriptoinPrice = this.subscriptoinPrice;
        debugger;
    };
    ;
    SubscriptionPlanComponent.prototype.isCompanyPlan = function () {
        return this.stripePlanId == "1B503C8E-972E-4C5F-BB81-69E74DFDF947" || (this.subscriptionName == "CompanyPlan" || this.subscriptionName == "Company Plan");
    };
    SubscriptionPlanComponent.prototype.isProfessionalTutorPlan = function () {
        return this.stripePlanId == "FAE8397A-98CC-4CDA-8865-BDF5E279EB96" ||
            this.subscriptionName == "ProfessionalTutorPlan";
    };
    SubscriptionPlanComponent.prototype.isStarterTutorPlan = function () {
        return this.stripePlanId == "058C4FDC-43FE-410F-87C2-13EDDF96F2E2" ||
            this.subscriptionName == "StarterTutorPlan";
    };
    SubscriptionPlanComponent.prototype.isNoFeeTutorPlan = function () {
        return this.stripePlanId == "35612992-A2CB-45AE-A9E9-433F928DB119" ||
            this.subscriptionName == "NoFeeTutorPlan";
    };
    SubscriptionPlanComponent.prototype.isPrivateTutorPlan = function () {
        return this.stripePlanId == "81070046-8DC3-4CA9-3129-08D7E6C57421" ||
            this.subscriptionName == "PrivateTutorPlan"; // to be retireds
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SubscriptionPlanComponent.prototype, "stripePlanId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SubscriptionPlanComponent.prototype, "subscriptionName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SubscriptionPlanComponent.prototype, "subscriptoinPrice", void 0);
    SubscriptionPlanComponent = __decorate([
        core_1.Component({
            selector: 'subscription-plan',
            templateUrl: './subscription-plan.component.html',
            styleUrls: ['./subscription-plan.component.scss'],
        }),
        __metadata("design:paramtypes", [])
    ], SubscriptionPlanComponent);
    return SubscriptionPlanComponent;
}());
exports.SubscriptionPlanComponent = SubscriptionPlanComponent;
//# sourceMappingURL=subscription-plan.component.js.map