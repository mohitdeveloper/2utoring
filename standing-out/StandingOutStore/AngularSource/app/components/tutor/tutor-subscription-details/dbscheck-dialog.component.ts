import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-dbscheck-dialog',
    templateUrl: 'dbscheck-dialog.html',
})


export class DbsCheckDialog {
  
    dbsCheckForm: FormGroup;
    dbsCheckFormSubmitted: boolean = false;
    get dbsCheckFormControls() { return this.dbsCheckForm.controls };

    dbsCheckData: {};

    constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DbsCheckDialog >) {}

    ngOnInit() {
        this.dbsCheckForm = this.fb.group({
            dbsCertificateNumber: ['', [Validators.required, Validators.maxLength(250)]],
            hasDbsCheck: [false, [Validators.required]]
        });
    } 

    closeModal(dbsCheckData): void {
        this.dialogRef.close(dbsCheckData);
    }


    hasDbsCheckValueChange() {
        this.dbsCheckForm.get('dbsCertificateNumber').clearValidators();
        if (this.dbsCheckFormControls.hasDbsCheck.value == true) {
            this.dbsCheckForm.get('dbsCertificateNumber').setValidators([Validators.required, Validators.maxLength(250)]);
        }
        this.dbsCheckForm.get('dbsCertificateNumber').updateValueAndValidity();
    };

    submitDbsCheckFormSub() {
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            this.dbsCheckData = this.dbsCheckForm.getRawValue();
        } else {
            this.dbsCheckData = {
                'dbsCertificateNumber': '',
                'hasDbsCheck': false
            };
        }
        this.closeModal(this.dbsCheckData);
        var $container = $("html,body");
        var $scrollTo = $('.Form_Block-Controls');
        $container.animate({ scrollTop: $scrollTo.offset().top + 1000, scrollLeft: 0 }, 300); 
    };


}