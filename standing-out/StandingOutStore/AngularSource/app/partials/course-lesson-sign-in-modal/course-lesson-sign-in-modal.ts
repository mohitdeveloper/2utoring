import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services';

@Component({
    selector: 'app-course-lesson-sign-in-modal',
    templateUrl: './course-lesson-sign-in-modal.html'
})

export class CourseLessonSignInModal {
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
        window.location.href = '/course-student-enroll/' + this.classSessionId;
    };
    signInGaurdian(): void {
        debugger;
        window.location.href = '/course-guardian-enroll/' + this.classSessionId;
    };
    close(): void {
        this.activeModal.dismiss();
    };
}
