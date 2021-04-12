import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-google-link-modal',
    templateUrl: './google-link-modal.html',
    styleUrls: ['./google-link-modal.css'],
    encapsulation: ViewEncapsulation.None
})
export class GoogleLinkModal {
    //currentUrl: string = window.location.href;
    currentUrl: string = '';
    constructor(public dialogRef: MatDialogRef<GoogleLinkModal>,
        @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService) {
    }

    closeDialog() {
        this.dialogRef.close(true);
    }

}

