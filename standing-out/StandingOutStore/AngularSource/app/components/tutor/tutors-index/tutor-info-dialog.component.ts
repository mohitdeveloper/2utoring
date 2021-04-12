import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'tutor-info-dialog',
    templateUrl: 'tutor-info-dialog.html',
    encapsulation: ViewEncapsulation.None
})
export class TutorInfoDialogComponent {
    public type: string = '';
    public page: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<TutorInfoDialogComponent>) {
        this.type = data && data.type ? data.type : 'default';
        this.page = data && data.page ? data.page : false;
    }
    onCancelClick(): void {
        this.dialogRef.close(false);
    }

}