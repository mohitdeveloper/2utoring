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
exports.TutorSubscriptionDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var dbscheck_dialog_component_1 = require("./dbscheck-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var TutorSubscriptionDetailsComponent = /** @class */ (function () {
    function TutorSubscriptionDetailsComponent(dialog, fb, tutorsService, stripeCountrysService, toastrService, stripePlansService) {
        this.dialog = dialog;
        this.fb = fb;
        this.tutorsService = tutorsService;
        this.stripeCountrysService = stripeCountrysService;
        this.toastrService = toastrService;
        this.stripePlansService = stripePlansService;
        this.stripe = Stripe(environment_1.environment.stripeKey);
        this.stripeCountrys = [];
        this.paymentFormSubmitted = false;
        this.showStripeError = false;
        this.stripeError = null;
        this.buttonText = 'Update changes';
    }
    Object.defineProperty(TutorSubscriptionDetailsComponent.prototype, "paymentFormControls", {
        get: function () { return this.paymentForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    TutorSubscriptionDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tutorsService.getMy()
            .subscribe(function (successOne) {
            _this.currentStripePlanId = successOne.stripePlanId;
            _this.tutor = successOne;
            _this.setUpPaymentForm();
            _this.loadPaymentMethod();
            _this.loadSubscription();
            _this.stripePlansService.getSubscriptionPlan().subscribe(function (success) {
                _this.stripePlans = success;
                debugger;
                if (success[0].stripePlanId == _this.currentStripePlanId) {
                    _this.selectedPlan(success[0].stripePlanId, success[0].subscription.subscriptionId);
                }
                if (success[2].stripePlanId == _this.currentStripePlanId) {
                    _this.selectedPlan(success[2].stripePlanId, success[2].subscription.subscriptionId);
                }
                if (success[3].stripePlanId == _this.currentStripePlanId) {
                    _this.selectedPlan(success[3].stripePlanId, success[3].subscription.subscriptionId);
                }
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.loadSubscription = function () {
        var _this = this;
        this.tutorsService.getSubscriptionByTutor(this.tutor.tutorId)
            .subscribe(function (success) {
            _this.subscription = success;
        }, function (error) {
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.loadPaymentMethod = function () {
        var _this = this;
        this.tutorsService.getDefaultPaymentMethodByTutor(this.tutor.tutorId)
            .subscribe(function (success) {
            _this.paymentCard = success;
        }, function (error) {
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.setUpPaymentForm = function () {
        var _this = this;
        this.stripeCountrysService.get()
            .subscribe(function (countrySuccess) {
            _this.stripeCountrys = countrySuccess;
            _this.paymentFormSubmitted = false;
            _this.paymentForm = _this.fb.group({
                tutorId: [_this.tutor.tutorId],
                stripePlanId: [_this.tutor.stripePlanId, [forms_1.Validators.required]],
                stripeCountryId: [_this.stripeCountrys[0].stripeCountryId, [forms_1.Validators.required]],
                cardName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                addressLine1: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(250)]],
                paymentMethodId: [''],
                intentId: [''],
                stripeSubscriptionId: [''],
                intentClientSecret: [''],
                stripeCustomerId: [''],
                requiresAction: [false],
                promoCode: [null, [forms_1.Validators.maxLength(250)]],
                dbsCheckData: [null],
                newStripePlanId: [null],
                newSubscriptionId: [null],
            });
            _this.setupCardField();
        }, function (error) {
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.submitPaymentForm = function () {
        debugger;
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            //this.toGetStatusOfSubscription(this.ProfileApprovalCheckNoFee, this.DBSApprovalCheckNoFee);
            //if (this.updateSubscriptionStatus == 'Not Set') {
            //    this.toGetStatusOfSubscription(this.ProfileApprovalCheckStarter, this.DBSApprovalCheckStarter);
            //}
            //if (this.updateSubscriptionStatus == 'Not Set') {
            //    this.toGetStatusOfSubscription(this.ProfileApprovalCheckPro, this.DBSApprovalCheckPro);
            //}
            //this.toGetStatusOfSelectedSubscription(this.ProfileApprovalSelectedPlan, this.DBSApprovalSelectedPlan);
            $('.loading').show();
            this.createPaymentCard();
        }
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.setupCardField = function () {
        var _this = this;
        setTimeout(function () {
            var elements = _this.stripe.elements();
            _this.card = elements.create('card');
            _this.card.mount('#card-info');
            _this.card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.style.display = 'block';
                    displayError.textContent = event.error.message;
                }
                else {
                    displayError.style.display = 'none';
                    displayError.textContent = '';
                }
            });
        }, 1000);
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.createPaymentCard = function () {
        var _this = this;
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(function (response) {
            _this.paymentCardResponse(response);
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.paymentCardResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        }
        else {
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.confirmSubscriptionSend = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.updatePayment(this.paymentForm.getRawValue())
            .subscribe(function (success) {
            _this.handleServerResponse(success);
            _this.buttonText = 'Update Changes';
            $('.loading').hide();
        }, function (err) {
            _this.handleStripeError(err.error);
            _this.buttonText = 'Update Changes';
            $('.loading').hide();
        });
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.handleServerResponse = function (fetchResult) {
        var _this = this;
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(function (response) {
                _this.cardActionResponse(response);
            });
        }
        else {
            //if (this.updateSubscriptionStatus == 'Off' && this.updateSubscriptionSelectedStatus == 'On') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 0; //we set directly 0 for both columns
            //}
            //if (this.updateSubscriptionStatus == 'On' && this.updateSubscriptionSelectedStatus == 'Off') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 99; //we need to check tutor record pending or rejected then only we need to update 99 , need to check both seprately
            //}
            //if (this.updateSubscriptionStatus == 'On' && this.updateSubscriptionSelectedStatus == 'On') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 100; //no need to do anything
            //}
            //if (this.updateSubscriptionStatus == 'Off' && this.updateSubscriptionSelectedStatus == 'Off') {
            //    this.currentStatusForTuorDbsApprovalAndProfileApproval = 100; //no need to do anything
            //}
            //this.mySubscriptionUpdateObj = {
            //    'dbsProfileApproval': this.currentStatusForTuorDbsApprovalAndProfileApproval,
            //    'tutorId': this.tutor.tutorId,
            //    'subscriptionId': this.selectedSubscriptionId,
            //}
            this.mySubscriptionUpdateObj = {
                'stripePlanId': this.selectedStripePlanId,
                'subscriptionId': this.selectedSubscriptionId,
            };
            //if (this.subscriptionSelected) {
            //    this.tutorsService.updateTutorSubscription(this.mySubscriptionUpdateObj) //insert/update tutor subscription
            //        .subscribe(res => {
            //            this.toastrService.success('Success');
            //        }, error => {
            //        });
            //} else {
            this.toastrService.success('Success');
            //}
            this.ngOnInit();
        }
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.cardActionResponse = function (result) {
        if (result.error) {
            this.handleStripeError(result.error);
        }
        else {
            this.confirmSubscriptionSend();
        }
    };
    ;
    TutorSubscriptionDetailsComponent.prototype.handleStripeError = function (error) {
        this.showStripeError = true;
        this.stripeError = error;
        this.setupCardField();
    };
    ;
    //selected plan for subscription by tutor
    TutorSubscriptionDetailsComponent.prototype.selectedPlan = function (stripePlanID, subscriptionId) {
        debugger;
        if (this.stripePlans[3].stripePlanId == this.currentStripePlanId) {
            this.buttonText = 'Downgrade Subscription';
        }
        if (this.stripePlans[2].stripePlanId == this.currentStripePlanId) {
            if (this.stripePlans[0].stripePlanId == stripePlanID) {
                this.buttonText = 'Downgrade Subscription';
            }
            if (this.stripePlans[3].stripePlanId == stripePlanID) {
                this.buttonText = 'Upgrade Subscription';
            }
        }
        if (this.stripePlans[0].stripePlanId == this.currentStripePlanId) {
            this.buttonText = 'Upgrade Subscription';
        }
        this.paymentForm.controls.newStripePlanId.setValue(stripePlanID);
        this.paymentForm.controls.newSubscriptionId.setValue(subscriptionId);
        if (this.currentStripePlanId.toLocaleUpperCase() === '35612992-A2CB-45AE-A9E9-433F928DB119') {
            this.getDbsCheckDialog();
        }
        else {
            var $container = $("html,body");
            var $scrollTo = $('.Form_Block-Controls');
            $container.animate({ scrollTop: $scrollTo.offset().top + 1000, scrollLeft: 0 }, 300);
        }
    };
    //get popup to select dbs check 
    TutorSubscriptionDetailsComponent.prototype.getDbsCheckDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(dbscheck_dialog_component_1.DbsCheckDialog, {});
        dialogRef.afterClosed().subscribe(function (data) {
            _this.paymentForm.controls.dbsCheckData.setValue(data);
            debugger;
        });
    };
    TutorSubscriptionDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-subscription-details',
            templateUrl: './tutor-subscription-details.component.html',
            styleUrls: ['./tutor-subscription-details.component.css']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, forms_1.FormBuilder, services_1.TutorsService, services_1.StripeCountrysService, ngx_toastr_1.ToastrService, services_1.StripePlansService])
    ], TutorSubscriptionDetailsComponent);
    return TutorSubscriptionDetailsComponent;
}());
exports.TutorSubscriptionDetailsComponent = TutorSubscriptionDetailsComponent;
//# sourceMappingURL=tutor-subscription-details.component.js.map