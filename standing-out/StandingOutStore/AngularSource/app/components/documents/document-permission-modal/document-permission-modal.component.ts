import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionDocumentsService } from '../../../services';
import { SessionAttendee, SessionAttendeeFileUploader } from '../../../models';


@Component({
    selector: 'app-document-permission-modal',
    templateUrl: './document-permission-modal.component.html',
    styleUrls: ['./document-permission-modal.component.scss']
})

// VIEW ONLY
export class DocumentPermissionModalComponent implements OnInit {

    constructor(private sessionDocumentsService: SessionDocumentsService, private toastr: ToastrService, private formBuilder: FormBuilder,
        private activeModal: NgbActiveModal) { }


    fileIds: string[];
    type: string;
    classSessionId: string;
    sessionAttendees: SessionAttendeeFileUploader[] = [];
    newSessionAttendees = [];
    newSessionAttendeesPermissionData = [];
    readToggle: boolean = false;
    writeToggle: boolean = false;
    isReadable: boolean = false;
    isWriteable: boolean = false;

    ngOnInit(): void {
        debugger;
        $('.loading').show();
        this.sessionDocumentsService.getAttendeesForFileUpload(this.classSessionId).subscribe(success => {
            this.sessionAttendees = success;
            var that = this;
            console.log(this.sessionAttendees );
            this.sessionDocumentsService.getGoogleFilePermission(this.classSessionId, this.fileIds[0]).subscribe(data => {
                this.newSessionAttendeesPermissionData = data;


//------------------------------------------------------------------------------------------------
                that.sessionAttendees.forEach(function (value, key) {
                    debugger;
                    data.forEach(function (value2, key2) {
                        if (value2.sessionAttendeeId == value.sessionAttendeeId) {
                            that.sessionAttendees[key].isReadable= value2.isReadable;
                            that.sessionAttendees[key].isWriteable = value2.isWriteable;
                            //that.sessionAttendees[key].folderName = that.type;
                        }
                    });
                    that.sessionAttendees[key].folderName = that.type;
                });  

//------------------------------------------------------------------------------------------------
    
                //this.sessionAttendees[0].isReadable = data[0].isReadable;
                //this.sessionAttendees[0].isWriteable = data[0].isWriteable;

                $('.loading').hide();
            }, err => {
            });


            $('.loading').hide();
        }, err => {
        });
    }

    readBulkToggle(): void {
        this.sessionAttendees.forEach(o =>
                    o.email ? o.isReadable = this.readToggle : false
                );
    };

    writeBulkToggle(): void {
        this.sessionAttendees.forEach(o =>
            o.email ? o.isWriteable = this.writeToggle : false,
        );
    };


    submit(): void {
        $('.loading').show();

        this.sessionAttendees.forEach(o => {
            if (o.email != null) {
                debugger;
                this.newSessionAttendees.push(o);
            }
        });

        debugger;
        this.sessionDocumentsService.updatePermissions(this.classSessionId, { fileIds: this.fileIds, sessionAttendees: this.newSessionAttendees })
            .subscribe(success => {
                this.toastr.success('File Permissions Updated.');
                this.activeModal.close();
            }, err => {
                this.toastr.error('Failed to update Permissions.');
                $('.loading').hide();
            })
    };

    closeModal() {
        this.activeModal.dismiss();
    };

    sendRequestToConnectGoogleAccount(sessionAttendeeId) {
        debugger;
        $('.loading').show();
        this.sessionDocumentsService.sendRequestToLinkGoogleAccount(sessionAttendeeId).subscribe(success => {
            if (success) {
                this.toastr.success('Request sent successfully!');
            }
            else {
                this.toastr.error('Something went wrong!');
            }
            $('.loading').hide();
        }, err => {
                $('.loading').hide();
        });
    }
}