import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-subject-studylevel-info-dialog',
    templateUrl: './subject-studylevel-info-dialog.component.html',
    styleUrls: ['./subject-studylevel-info-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SubjectStudylevelInfoDialogComponent {

    userType: string;
    isFilterVisible: number;

    constructor(public dialogRef: MatDialogRef<SubjectStudylevelInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        debugger;
        this.userType = data.userType;
        this.isFilterVisible = data.isFilterVisible;
    }

    ngOnInit() {}
    onCancelClick(): void {
        this.dialogRef.close(false);
    }      
}

