import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'company-plan-card',
    templateUrl: './company-plan-card.component.html',
})
export class CompanyPlanCardComponent implements OnInit {

    @Input() subscriptionName: string;
    @Input() planSubscriptoinPrice: number;

    constructor() { }
    

    ngOnInit() {
        this.subscriptionName;
        this.planSubscriptoinPrice;
    };

}
