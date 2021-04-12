import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services';

@Component({
    selector: 'app-lesson-sign-in-modal',
    templateUrl: './lesson-sign-in-modal.html'
})

export class LessonSignInModal {
    constructor(private activeModal: NgbActiveModal, private settingsService: SettingsService) { }

    classSessionId: string;
    name: string;
    subject: string;
    subjectCategory: string = null;
    studyLevel: string;
    identitySiteUrl: string;

    ngOnInit() {
        this.settingsService.getIdentitySiteUrl()
            .subscribe(success => {
                this.identitySiteUrl = success;
            }, error => {
            });
    }

    signInStudent(): void {
        debugger;
        window.location.href = '/student-enroll/' + this.classSessionId;
    };
    signInGaurdian(): void {
        debugger;
        window.location.href = '/guardian-enroll/' + this.classSessionId;
    };
    close(): void {
        this.activeModal.dismiss();
    };
}
