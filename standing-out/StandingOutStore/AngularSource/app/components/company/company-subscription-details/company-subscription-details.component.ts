import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CompanyService, StripeCountrysService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { StripeCountry, Company, StripeCard, StripeSubscription } from '../../../models';

declare var Stripe: Function;

@Component({
    selector: 'app-company-subscription-details',
    templateUrl: './company-subscription-details.component.html',
    styleUrls: ['./company-subscription-details.component.css']
})
export class CompanySubscriptionDetailsComponent implements OnInit {

    stripe: any = Stripe(environment.stripeKey);
    company: Company;
    paymentCard: StripeCard;
    subscription: StripeSubscription;
    stripeCountrys: StripeCountry[] = [];
    paymentForm: FormGroup;
    paymentFormSubmitted: boolean = false;
    get paymentFormControls() { return this.paymentForm.controls };
    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;

    constructor(private fb: FormBuilder, private companysService: CompanyService, private stripeCountrysService: StripeCountrysService, private toastrService: ToastrService) { }

    ngOnInit(): void {
        this.companysService.getMy()
            .subscribe(success => {
                this.company = success;
                this.setUpPaymentForm();
                this.loadPaymentMethod();
                this.loadSubscription();
            }, error => {
            });
    };

    loadSubscription(): void {
        this.companysService.getSubscriptionByCompany(this.company.companyId)
            .subscribe(success => {
                this.subscription = success;
            }, error => {
            });
    };

    loadPaymentMethod(): void {
        this.companysService.getDefaultPaymentMethodByCompany(this.company.companyId)
            .subscribe(success => {
                this.paymentCard = success;
            }, error => {
            });
    };

    setUpPaymentForm(): void {
        this.stripeCountrysService.get()
            .subscribe(countrySuccess => {
                this.stripeCountrys = countrySuccess;
                this.paymentFormSubmitted = false;
                this.paymentForm = this.fb.group({
                    companyId: [this.company.companyId],
                    stripePlanId: [this.company.stripePlanId, [Validators.required]],
                    stripeCountryId: [this.stripeCountrys[0].stripeCountryId, [Validators.required]],
                    cardName: ['', [Validators.required, Validators.maxLength(250)]],
                    addressLine1: ['', [Validators.required, Validators.maxLength(250)]],
                    paymentMethodId: [''],
                    intentId: [''],
                    stripeSubscriptionId: [''],
                    intentClientSecret: [''],
                    stripeCustomerId: [''],
                    requiresAction: [false],
                    promoCode: [null, [Validators.maxLength(250)]]
                });
                this.setupCardField();
            }, error => {
            });
    };

    submitPaymentForm() {
        this.paymentFormSubmitted = true;
        console.log(this.paymentForm);
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.createPaymentCard();
        }
        else {
            console.log("Errors:", this.paymentForm.errors);
            this.toastrService.error("Sorry, cannot update right now.. Please retry later.");
        }
    };

    setupCardField(): void {
        setTimeout(() => {
            var elements = this.stripe.elements();
            this.card = elements.create('card');
            this.card.mount('#card-info');
            this.card.addEventListener('change', event => {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.style.display = 'block';
                    displayError.textContent = event.error.message;
                } else {
                    displayError.style.display = 'none';
                    displayError.textContent = '';
                }
            });
        }, 1000);
    };

    createPaymentCard(): void {
        this.stripe.createPaymentMethod('card', this.card, {
            billing_details: {
                name: this.paymentForm.controls.cardName.value,
                address: {
                    line1: this.paymentForm.controls.addressLine1.value
                }
            }
        }).then(response => {
            console.log("paymentCardResponse", response);
            this.paymentCardResponse(response);
        });
    };

    paymentCardResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error);
            $('.loading').hide();
        } else {
            this.paymentForm.controls.paymentMethodId.setValue(result.paymentMethod.id);
            this.confirmSubscriptionSend();
        }
    };

    confirmSubscriptionSend(): void {
        $('.loading').show();
        this.companysService.updatePayment(this.paymentForm.getRawValue())
            .subscribe(success => {
                this.handleServerResponse(success);
                $('.loading').hide();
            }, err => {
                this.handleStripeError(err.error);
                $('.loading').hide();
            });
    };

    handleServerResponse(fetchResult): void {
        this.paymentForm.controls.intentId.setValue(fetchResult.intentId);
        this.paymentForm.controls.stripeSubscriptionId.setValue(fetchResult.stripeSubscriptionId);
        this.paymentForm.controls.stripeCustomerId.setValue(fetchResult.stripeCustomerId);
        if (fetchResult.requiresAction) {
            this.stripe.handleCardPayment(fetchResult.intentClientSecret).then(response => {
                this.cardActionResponse(response);
            });
        } else {
            this.toastrService.success('Success');
            this.ngOnInit();
        }
    };

    cardActionResponse(result): void {
        if (result.error) {
            this.handleStripeError(result.error);
        } else {
            this.confirmSubscriptionSend();
        }
    };

    handleStripeError(error: string): void {
        this.showStripeError = true;
        this.stripeError = error;
        this.setupCardField();
    };
}
