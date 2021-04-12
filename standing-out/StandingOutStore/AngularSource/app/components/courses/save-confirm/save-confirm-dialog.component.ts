import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
    selector: 'app-save-confirm-dialog',
    templateUrl: './save-confirm-dialog.component.html',
})
export class SaveConfirmDialog {
    message: string = "Would you like to save your changes?"
    confirmButtonText = "Yes"
    cancelButtonText = "No"
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<SaveConfirmDialog>) {
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