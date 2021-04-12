import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-lesson-enroll-linked-account-modal',
    templateUrl: './lesson-enroll-linked-account-modal.html'
})

export class LessonEnrollLinkedAccountModal {
    constructor(private activeModal: NgbActiveModal) { }

    currentUrl: string = window.location.href;

    ngOnInit() {
    }

    close(): void {
        this.activeModal.dismiss();
    };
}
