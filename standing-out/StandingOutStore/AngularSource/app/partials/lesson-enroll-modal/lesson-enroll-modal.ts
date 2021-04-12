import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-lesson-enroll-modal',
    templateUrl: './lesson-enroll-modal.html'
})

export class LessonEnrollModal {
    constructor(private activeModal: NgbActiveModal) { }

    currentUrl: string = window.location.href;

    ngOnInit() {
    }

    close(): void {
        this.activeModal.dismiss();
    };
}
