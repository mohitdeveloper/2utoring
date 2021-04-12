import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-tick-modal',
    templateUrl: './tick-modal.html'
})

export class TickModal {
    constructor(private activeModal: NgbActiveModal) { }

    title: string;
    navTo: string;
    button: string;

    toNav(): void {
        window.location.href = this.navTo;
    };
}
