import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { StudyLevelsService, SubjectsService, SubjectStudyLevelSetupService } from '../../../services';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-subject-studylevel-create-dialog',
    templateUrl: './subject-studylevel-create-dialog.component.html',
    styleUrls: ['./subject-studylevel-create-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SubjectStudylevelCreateDialogComponent {

    subjectData: Array<any> = [];
    StudyLevels: Array<any> = [];
    subjectPriceData: any;
    subjectPriceId: string;
    selectedSubjectId: string;
    existingLevels: Array<any> = [];
    selectsubjectPriceId: string;
    subjectIdOnUpdate: any = '';
    subjectStudyLevelSetupId: string;
    pricePerPerson: string;
    groupPricePerPerson: string;
    allowEdit: boolean = true;
    userType: string;

    CreateSubjectPrice: FormGroup;
    CreateSubjectPriceSubmitted: boolean = false;
    get CreateSubjectPriceControls() { return this.CreateSubjectPrice.controls };


    constructor(public dialogRef: MatDialogRef<SubjectStudylevelCreateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private StudyLevelsService: StudyLevelsService, private subjectService: SubjectsService, private SubjectStudyLevelSetupService: SubjectStudyLevelSetupService, private toastr: ToastrService) {
        this.subjectPriceId = data.id;
        debugger;
        if (data.subjectId) {
            this.selectedSubjectId = data.subjectId;
            this.getStudyLevelsBySubject(data.subjectId);
        }
        if (data.allowEdit == undefined) {
            this.allowEdit = true;
        } else {
            this.allowEdit = data.allowEdit;
        }

        this.userType = data.userType;
        

    }

    ngOnInit() {
        this.getAllSubject();
        this.getStudyLevels();

        //on edit case
        if (this.subjectPriceId) {
            this.SubjectStudyLevelSetupService.getById(this.subjectPriceId)
                .subscribe(success => {
                    this.subjectIdOnUpdate = success.subjectStudyLevelSetupId;
                    this.subjectPriceData = success;
                    this.CreateSubjectPrice.patchValue({
                        subjectId: success.subjectId,
                        studyLevelId: success.studyLevelId,
                        pricePerPerson: success.pricePerPerson,
                        groupPricePerPerson: success.groupPricePerPerson,
                        subjectStudyLevelSetupId: success.subjectStudyLevelSetupId,
                    });

                    $('.loading').hide();
                }, error => {
                });
        }

        this.CreateSubjectPrice = this.fb.group({
            subjectId: ['', [Validators.required]],
            studyLevelId: ['', [Validators.required]],
            pricePerPerson: ['', [Validators.required, Validators.min(5), Validators.max(999)]],
            groupPricePerPerson: ['', [Validators.required, Validators.min(5), Validators.max(999)]],
            subjectStudyLevelSetupId: [null],
        });
    }


    //get all subjects list
    getAllSubject() {
        this.subjectService.get()
            .subscribe(success => {
                this.subjectData = success;
                $('.loading').hide();
            }, error => {
            });
    }

    //get all study levels
    getStudyLevels() {
        this.StudyLevelsService.get()
            .subscribe(success => {
                this.StudyLevels = success;
                $('.loading').hide();
            }, error => {
            });
    }

    closeDialog() {
        this.dialogRef.close(true);
    }

    //submit form
    submitCreateSubjectPriceForm() {
        this.CreateSubjectPriceSubmitted = true;
        if (!this.CreateSubjectPrice.valid) {
            return false;
        }
        $('.loading').show();
        if (this.selectedSubjectId) {
            var priceData = this.CreateSubjectPrice.getRawValue();
            var idx = this.existingLevels.findIndex(x => x.studyLevelId === priceData.studyLevelId);
            if (idx != -1 && this.selectedSubjectId == priceData.subjectId) {
                this.toastr.success('Level already associate with selected subject!');
                return false;
            }
        }


        if (this.subjectIdOnUpdate) {
            //this.CreateSubjectPrice.controls["subjectStudyLevelSetupId"].setValue(this.subjectIdOnUpdate);
            this.SubjectStudyLevelSetupService.update(this.CreateSubjectPrice.getRawValue())
                .subscribe(success => {
                    this.toastr.success('Price update successfully!');
                    $('.loading').hide();
                    //this.CompanyCourseForm.reset();
                    this.closeDialog()
                }, error => {
                    $('.loading').hide();
                });

        } else {
            this.SubjectStudyLevelSetupService.create(this.CreateSubjectPrice.getRawValue())
                .subscribe(success => {
                    this.toastr.success('Price created successfully!');
                    $('.loading').hide();
                    //this.CompanyCourseForm.reset();
                    this.closeDialog()
                }, error => {
                    $('.loading').hide();
                });
        }
    }
    // get level by subject
    getStudyLevelsBySubject(id) {
        this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
            .subscribe(success => {
                this.existingLevels = success;
                $('.loading').hide();
            }, error => {
            });
    }

}

