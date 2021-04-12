import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-utilities-alert-modal',
    templateUrl: './utilities-alert-modal.html'
})
export class UtilitiesAlertModal {
    constructor(private activeModal: NgbActiveModal) { }

    confirmButtons: boolean = false;
    title: string;
    message: string;
    htmlMessage: string = '';
    noButtonText: string;
    yesButtonText: string;

    noButtonClass: string = 'btn btn-primary mr-7';
    yesButtonClass: string = 'btn btn-danger mr-7';


    confirm(result: boolean): void {
        this.activeModal.close(result);
    }

    closeModal(): void {
        this.activeModal.dismiss(false);
    }
}