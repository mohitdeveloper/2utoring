import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-subject-confirmation-dialog',
    templateUrl: 'subject-studylevel-delete-dialog.html',
})
export class subjectStudyLevelDeleteDialog {
    message: string = "Are you sure?"
    confirmButtonText = "Yes"
    cancelButtonText = "Cancel"
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<subjectStudyLevelDeleteDialog>) {
        if (data) {
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            }
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

}