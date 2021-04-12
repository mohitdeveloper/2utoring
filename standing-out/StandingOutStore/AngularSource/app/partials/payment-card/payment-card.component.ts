import { Component } from '@angular/core';
import { StripeCard, StripeCountry } from '../../models/index';
import { StripeService, StripeCountrysService, PromoCodeService } from '../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

declare var Stripe: Function;

@Component({
    selector: 'app-payment-card',
    templateUrl: './payment-card.component.html'
})

export class PaymentCardComponent {
    constructor(private stripeService: StripeService, private formBuilder: FormBuilder,
        private stripeCountrysService: StripeCountrysService) { }

    stripeCountrys: StripeCountry[] = [];
    paymentCard: StripeCard = null;

    stripe: any = Stripe(environment.stripeKey);
    card: any;
    showStripeError: boolean = false;
    stripeError: string = null;

    paymentMethodId: string = null;

    paymentForm: FormGroup;
    paymentFormSubmitted: boolean;
    get paymentFormControls() { return this.paymentForm.controls; };

    submitPaymentForm(): void {
        this.paymentFormSubmitted = true;
        if (this.paymentForm.valid) {
            $('.loading').show();
            this.stripe.createPaymentMethod('card', this.card, {
                billing_details: {
                    name: this.paymentForm.controls.cardName.value,
                    address: {
                        line1: this.paymentForm.controls.addressLine1.value
                    }
                }
            }).then(response => {
                if (response.error) {
                    this.showStripeError = true;
                    this.stripeError = response.error;
                    $('.loading').hide();
                } else {
                    this.stripeService.connectPaymentMethod({ paymentMethodId: response.paymentMethod.id, cardName: this.paymentForm.controls.cardName.value })
                        .subscribe(success => {
                            this.paymentCard = success;
                            this.showStripeError = false;
                            this.stripeError = null;
                            $('.loading').hide();
                        }, error => {
                                this.showStripeError = true;
                                this.stripeError = 'There was an error adding your card. Please check your details and try again.';
                                $('.loading').hide();
                        });
                }
            });
        }
    };

    getCard(): void {
        this.stripeService.getCard()
            .subscribe(success => {
                this.paymentCard = success;
                if (this.paymentCard == null) {
                    this.setupPaymentForm();
                }
            }, error => {
                    console.log(error);
            });
    };

    getStripeCountries(): void {
        this.stripeCountrysService.get()
            .subscribe(success => {
                this.stripeCountrys = success;
            }, error => {
            });
    };
    

    setupPaymentForm(): void {
        this.paymentForm = this.formBuilder.group({
            cardName: ['', [Validators.required, Validators.maxLength(250)]],
            stripeCountryId: [null, [Validators.required]],
            addressLine1: ['', [Validators.required, Validators.maxLength(250)]]
        });
        this.setupCardField();
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

    removeCard(): void {
        this.stripeService.deleteCard(this.paymentCard.paymentMethodId)
            .subscribe(success => {
                this.paymentCard = null;
                this.setupPaymentForm();
            }, error => {
                    console.log(error);
            });
    };

    ngOnInit() {
        this.getCard();
        this.getStripeCountries();
    };
}
