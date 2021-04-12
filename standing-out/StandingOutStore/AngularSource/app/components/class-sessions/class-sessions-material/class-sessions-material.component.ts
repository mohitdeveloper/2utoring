import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TutorsService, SessionMediasService, EnumsService, ClassSessionsService, CompanyService } from '../../../services';
import { Tutor, SessionMedia, EnumOption, SessionDocument, ClassSession } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { ServiceHelper } from '../../../helpers/service.helper';
import * as $ from 'jquery';
import { MatDialogRef } from '@angular/material/dialog';
import { CourseUploadDialogComponent } from '../../courses/course-upload-dialog/course-upload-dialog.component';

declare var classSessionId: any;

@Component({
    selector: 'app-class-sessions-material',
    templateUrl: './class-sessions-material.component.html',
    styleUrls: ['./class-sessions-material.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class ClassSessionsMaterialComponent implements OnInit {

    @Input() classSessionIdDialog: string;
    @Input() selectedTutorId: string;

    serviceHelper: ServiceHelper = new ServiceHelper();

    classSessionId: string = '';
    classSession: ClassSession;
    loaded: number = 0;
    toLoad: number = 4;
    tutor: Tutor;
    sessionMedias: SessionMedia[] = [];
    sessionMediaTypes: EnumOption[] = [];
    sessionDocuments: SessionDocument[] = [];
    currentUrl: string = window.location.href;
    ProfileApproval: boolean;


    sessionMediaForm: FormGroup;
    sessionMediaFormSubmitted: boolean = false;
    get sessionMediaFormControls() { return this.sessionMediaForm.controls };

    constructor(public dialogRef: MatDialogRef<CourseUploadDialogComponent>, private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private sessionMediasService: SessionMediasService, private enumsService: EnumsService, private classSessionsService: ClassSessionsService, private companyService: CompanyService,) { }

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit(): void {
        $('.loading').show();
        $('.myClass').removeClass('my-dialog');
        if (this.selectedTutorId && this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getCompanyTutorData(this.selectedTutorId)
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                }, error => {
                });
        } else if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                }, error => {
                });
        }else {
            this.classSessionId = classSessionId;
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                }, error => {
                });
        }
        
        this.enumsService.get('SessionMediaType')
            .subscribe(success => {
                this.sessionMediaTypes = success;
                this.incrementLoad();
            }, error => {
            });
        this.classSessionsService.getById(this.classSessionId)
            .subscribe(success => {
                this.classSession = success;
                this.incrementLoad();
            }, error => {
            });

        this.loadSessionMedia();
        this.resetSessionMediaForm();
        //To get subscription

        if (!this.selectedTutorId) {
            this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
                debugger;
                this.ProfileApproval = res.adminDashboard_ProfileApproval_ApprovalRequired;
            }, err => { })
        }
    }

    loadSessionMedia(): void {
        this.sessionMediasService.getByClassSession(this.classSessionId)
            .subscribe(success => {
                this.sessionMedias = success;
                this.incrementLoad();
            }, error => {
            });
    };

    resetSessionMediaForm(): void {
        this.sessionMediaFormSubmitted = false;
        this.sessionMediaForm = this.fb.group({
            classSessionId: [this.classSessionId],
            name: ['', [Validators.required, Validators.maxLength(250)]],
            content: ['', [Validators.required, Validators.maxLength(2000)]],
            type: [null, [Validators.required]],
        });
    };

    submitSessionMediaForm(): void {
        this.sessionMediaFormSubmitted = true;
        if (this.sessionMediaForm.valid) {
            $('.loading').show();
            this.sessionMediasService.create(this.sessionMediaForm.getRawValue())
                .subscribe(success => {
                    this.loadSessionMedia();
                    this.resetSessionMediaForm();
                    $('.loading').hide();
                }, error => {
                });
        }
    };

    deleteSessionMedia(sessionMedia: SessionMedia): void {
        $('.loading').show();
        this.sessionMediasService.delete(sessionMedia.sessionMediaId)
            .subscribe(success => {
                this.loadSessionMedia();
                $('.loading').hide();
            }, error => {
            });
    };

    ngAfterViewChecked() {
        if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.selectedTutorId = this.selectedTutorId;
        }else{
            this.classSessionId = classSessionId;
        }
    }

    closeLessonDialogs(): void {
        this.dialogRef.close();
    }
}
