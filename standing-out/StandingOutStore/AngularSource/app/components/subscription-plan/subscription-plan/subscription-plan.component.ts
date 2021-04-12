import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
    selector: 'subscription-plan',
    templateUrl: './subscription-plan.component.html',
    styleUrls: ['./subscription-plan.component.scss'],
})
export class SubscriptionPlanComponent implements OnInit {
    
    @Input() stripePlanId: string;
    @Input() subscriptionName: string;
    @Input() subscriptoinPrice: number;

    planSubscriptoinPrice: number;

    constructor() { }

    ngOnInit() {
        this.planSubscriptoinPrice = this.subscriptoinPrice;
        debugger;
    };

    isCompanyPlan():boolean {
        return this.stripePlanId == "1B503C8E-972E-4C5F-BB81-69E74DFDF947" || (this.subscriptionName == "CompanyPlan" || this.subscriptionName == "Company Plan");
    }
    isProfessionalTutorPlan():boolean {
        return this.stripePlanId == "FAE8397A-98CC-4CDA-8865-BDF5E279EB96" ||
            this.subscriptionName == "ProfessionalTutorPlan";
    }
    isStarterTutorPlan():boolean {
        return this.stripePlanId == "058C4FDC-43FE-410F-87C2-13EDDF96F2E2" ||
            this.subscriptionName == "StarterTutorPlan";
    }
    isNoFeeTutorPlan():boolean {
        return this.stripePlanId == "35612992-A2CB-45AE-A9E9-433F928DB119" ||
            this.subscriptionName == "NoFeeTutorPlan";
    }
    isPrivateTutorPlan():boolean {
        return this.stripePlanId == "81070046-8DC3-4CA9-3129-08D7E6C57421" ||
            this.subscriptionName == "PrivateTutorPlan"; // to be retireds
    }
}
