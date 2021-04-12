import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TutorsService, UsersService, TutorCertificatesService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { ServiceHelper } from '../../../helpers';
import { Tutor } from '../../../models';
import { TutorInfoDialogComponent } from '../tutors-index/tutor-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-tutor-dbs-details',
    templateUrl: './tutor-dbs-details.component.html',
    styleUrls: ['./tutor-dbs-details.component.css']
})
export class TutorDbsDetailsComponent implements OnInit {

    serviceHelper: ServiceHelper = new ServiceHelper();

    tutor: Tutor;
    dbsCheckForm: FormGroup;
    dbsCheckFormSubmitted: boolean = false;
    get dbsCheckFormControls() { return this.dbsCheckForm.controls };
    public uploader: FileUploader = new FileUploader({ url: '', method: 'POST' });
    public dropZoneOver: boolean = false;
    uploaderShow: boolean = true;
    alertMessage: any = null;
    constructor(private tutorCertificatesService: TutorCertificatesService,private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, public dialog: MatDialog, private usersService: UsersService) { }

    ngOnInit(): void {
        this.resetForm();
        this.getUserAlertMessage();
    }

    resetForm(): void {
        $('.loading').show();
        this.tutorsService.getMy()
            .subscribe(success => {
                debugger;
                this.tutor = success;
                this.uploader.options.url = this.serviceHelper.baseApi + '/api/Tutors/DBSUpload/' + this.tutor.tutorId;
                this.dbsCheckFormSubmitted = false;
                this.dbsCheckForm = this.fb.group({
                    tutorId: [success.tutorId],
                    hasDbsCheck: [true],
                    dbsCertificateNumber: [success.dbsCertificateNumber, [Validators.maxLength(250), Validators.required]],
                    isProfileCheck: [false]
                });
                $('.loading').hide();
            }, error => {
            });
    };

    submitDbsCheckForm() {
        this.dbsCheckFormSubmitted = true;
        if (this.dbsCheckForm.valid) {
            $('.loading').show();
            this.tutorsService.saveDbsCheck(this.dbsCheckForm.getRawValue())
                .subscribe(success => {
                    this.toastr.success('Your DBS info has been updated');
                    this.resetForm();                   
                }, error => {
                });
        }
    };

    public fileOver(e: any): void {
        this.dropZoneOver = e;
    }

    public fileDropped(e: any): void {
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.tutorsService.getMy()
                        .subscribe(success => {
                            this.tutor = success;
                            $('.loading').hide();
                        }, error => {
                        });
                } else {
                    $('.loading').hide();
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.toastr.error('We were unable to upload your document');
                }
            }
        }
    }

    showInformation(type) {
        const dialogRef = this.dialog.open(TutorInfoDialogComponent, {
            maxWidth: type == 'RDBS' ? '75vw' : '75vw',
            data: { type: type }
        });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }

    markDbsStatusMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsStatusMessage').css('display', 'none');
            }, error => {
            });
    };

    markDbsStatusMessageReadBasicTutor(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsStatusMessageBasicTutor').css('display', 'none');
            }, error => {
            });
    };

    deleteCertificate(id,i) {
        this.tutorCertificatesService.delete(id).subscribe(res => {
            this.toastr.success("Certificate has been removed.");
            this.tutor.tutorCertificates.splice(i,1)
        })
    }


}
