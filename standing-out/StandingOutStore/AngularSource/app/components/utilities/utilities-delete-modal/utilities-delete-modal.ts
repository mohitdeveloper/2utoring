import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-utilities-delete-modal',
    templateUrl: './utilities-delete-modal.html'
})
export class UtilitiesDeleteModal {
    constructor(private activeModal: NgbActiveModal) { }

    remove(result: boolean): void {
        this.activeModal.close(result);
    }

    closeModal(): void {
        this.activeModal.dismiss(false);
    }
}