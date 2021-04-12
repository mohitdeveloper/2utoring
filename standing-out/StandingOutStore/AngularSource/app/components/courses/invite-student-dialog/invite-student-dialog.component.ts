import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-invite-student-dialog',
    templateUrl: './invite-student-dialog.component.html',
    styleUrls: ['./invite-student-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class InviteStudentDialogComponent  {

    classSessionId: string;
    selectedTutorId: string;
    
    constructor(
        public dialogRef: MatDialogRef<InviteStudentDialogComponent >,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.classSessionId = data.classSessionId;
        this.selectedTutorId = data.selectedTutorId;
        }
    closeLessonDialog(): void {
        this.dialogRef.close();
    }

    // ngOnInit() {
    //     this.classSessionId = this.data.classSessionId;
    // }

}

