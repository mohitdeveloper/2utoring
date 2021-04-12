import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminTutorDetails, ClassSessionFeatures } from '../../../models/index';
import { TutorsService, ClassSessionFeaturesService } from '../../../services/index';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesAlertModal } from '../../utilities/utilities-alert-modal/utilities-alert-modal';
import { TutorProfileViewComponent } from '../..';
import { Observable } from 'rxjs';

declare let title: string;
declare let tutorId: string;

@Component({
    selector: 'app-tutor-details',
    templateUrl: './tutor-details.component.html'
})

export class TutorDetailsComponent implements OnInit {
    constructor(private tutorsService: TutorsService, private toastr: ToastrService, private modalService: NgbModal,
        private classSessionFeaturesService: ClassSessionFeaturesService) { }

    @ViewChild('tutorProfileRef') tutorProfileRef: TutorProfileViewComponent;

    title: string = title;
    tutorId: string = tutorId;
    tutor: AdminTutorDetails = new AdminTutorDetails;
    currentTabStep: string = 'basic-info-tab';
    classSessionFeatures: ClassSessionFeatures = new ClassSessionFeatures();
    hasDBSCertificates: boolean;
    hasQualificationCertificates: boolean;
    toLoad: number = 1;
    loaded: number = 0;

    incrementLoad(): void {
        this.loaded++;

        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit() {
        $('.loading').show();

        this.tutorsService.adminGetById(this.tutorId).subscribe(success => {
            this.tutor = success;
            debugger;
            let dbsC = 0;
            let qC = 0;
            for (var i = 0; i < success.tutorCertificates.length; i++) {
                if (success.tutorCertificates[i].certificateType == "DBS") {
                    dbsC = dbsC + 1;
                }
                if (success.tutorCertificates[i].certificateType == "Qualification") {
                    qC = qC + 1;
                }
            }
            this.hasDBSCertificates = dbsC > 0 ? true : false;
            this.hasQualificationCertificates = qC > 0 ? true : false;

            this.getClassSessionFeaturesByTutorId.subscribe(success => { });
            this.incrementLoad();
        }, err => {
        })
    };

    getClassSessionFeaturesByTutorId: Observable<ClassSessionFeatures> = new Observable(subscriber => {
        //console.log("Getting classroom subscription features..");
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(this.tutor.tutorId)
            .subscribe(features => {
                //console.log("Got classroom subscription features:", features);
                this.classSessionFeatures = features;
                subscriber.next(features);
            }, error => { console.log("Could not get classroom subscription features") });
    });

    approveProfileConfirm(): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Approve Profile Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to approve this Profile, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Approve Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                this.approveProfileConfirmed();
            }
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };

    rejectProfileConfirm(): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Reject Profile Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to reject this Profile, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Reject Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                this.rejectProfileConfirmed();
            }
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };

    approveDBSConfirm(): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Approve DBS Certificate Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to approve this DBS Certificate, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Approve Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                this.approveDBSConfirmed();
            }
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };

    rejectDBSConfirm(): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Reject DBS Certificate Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to reject this DBS Certificate, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Reject Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                this.rejectDBSConfirmed();
            }
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };

    rejectAccount(): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Disable Tutor\'s Account Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to disable this Tutor\'s Account and set it back to an \'unapproved\' status?';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Disable Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response

        modalRef.result.then((result) => {

            console.log(result);

            if (result == true) {

                $('.loading').show();

                this.tutorsService.rejectProfile(this.tutorId).subscribe(success => {
                    this.tutorsService.rejectDBS(this.tutorId).subscribe(successItem => {
                        this.ngOnInit();
                        this.toastr.success('Background check rejected successfully');
                    }, err => {
                        this.toastr.error('We were unable to reject the background check');
                    });
                    this.toastr.success('Tutor profile rejected successfully');
                }, err => {
                    this.toastr.error('We were unable to reject the tutor profile');
                });
            }
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };

    needsProfileApproval(): boolean {
        // Requires approval when - When Approved or NotRequired returns false
        if (this.tutor.profileApprovalStatus == 'Approved' || this.tutor.profileApprovalStatus == 'NotRequired')
            return false;
        return true;
    }

    needsDbsApproval(): boolean {
        // Requires approval when - When Approved or NotRequired returns false
        if (this.tutor.dbsApprovalStatus == 'Approved' || this.tutor.dbsApprovalStatus == 'NotRequired')
            return false;
        return true;
    }

    approveProfileConfirmed(): void {
        $('.loading').show();

        this.tutorsService.approveProfile(this.tutorId).subscribe(success => {
            this.ngOnInit();
            this.toastr.success('Tutor profile approve successfully');
        }, err => {
            this.toastr.error('We were unable to approve the tutor profile');
        });
    };

    rejectProfileConfirmed(): void {
        $('.loading').show();

        this.tutorsService.rejectProfile(this.tutorId).subscribe(success => {
            this.ngOnInit();
            this.toastr.success('Tutor profile rejected successfully');
        }, err => {
            this.toastr.error('We were unable to reject the tutor profile');
        });
    };

    approveDBSConfirmed(): void {
        this.tutorsService.approveDBS(this.tutorId).subscribe(success => {
            this.ngOnInit();
            this.toastr.success('Background check approved successfully');
        }, err => {
            this.toastr.error('We were unable to approve the background check');
        });
    };

    rejectDBSConfirmed(): void {
        this.tutorsService.rejectDBS(this.tutorId).subscribe(success => {
            this.ngOnInit();
            this.toastr.success('Background check rejected successfully');
        }, err => {
            this.toastr.error('We were unable to reject the background check');
        });
    };

    viewProfile() {
        window.location.href = window.location.origin + "/tutor/" + this.tutorId;
    }


}

