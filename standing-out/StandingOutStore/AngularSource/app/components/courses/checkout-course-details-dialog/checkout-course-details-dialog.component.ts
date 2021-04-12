import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from '../../../services';

@Component({
    selector: 'app-checkout-course-details-dialog',
    templateUrl: './checkout-course-details-dialog.component.html',
    styleUrls: ['./checkout-course-details-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CheckoutCourseDetailsDialogComponent {

    courseId: string;
    parentStudentUserTypes: string = 'child';
    constructor(
        public dialogRef: MatDialogRef<CheckoutCourseDetailsDialogComponent>,
        private settingsService: SettingsService,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.courseId = data.courseId;
    }
    closeLessonDialog(): void {
        this.dialogRef.close();
    }

    exsistingUser() {
        //window.location.href = '/course-sign-in/' + this.courseId;
        window.location.href = '/course-sign-in/' + this.courseId + '/Others';
        $('#aboutYouPage').css('display', 'none');
    }

    newUser() {
        $('#aboutYouPage').css('display', 'block');
    }

    onAboutCourseSelections(userType) {
        this.parentStudentUserTypes = userType;
    }

    doRegister() {
        if (this.parentStudentUserTypes == 'child') {
            this.settingsService.getIdentitySiteUrl()
                .subscribe(success => {
                    window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-student-enroll/' + this.courseId
                }, error => {
                });
            return true;
        }
        if (this.parentStudentUserTypes == 'parent') {
            this.settingsService.getIdentitySiteUrl()
                .subscribe(success => {
                    window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-guardian-enroll/' + this.courseId
                }, error => {
                });
            return true;
        }
    }

}

