import { Component, OnInit } from '@angular/core';
import { TutorsService, UsersService } from '../../../services';
import { Tutor, Company, MessageStatusUpdate } from '../../../models';

@Component({
    selector: 'app-tutor-dashboard',
    templateUrl: './tutor-dashboard.component.html',
    styleUrls: ['./tutor-dashboard.component.css']
})
export class TutorDashboardComponent implements OnInit {

    tutor: Tutor;
    currentUrl: string = window.location.href;
    currentCompany: Company;
    MessageStatusUpdate: MessageStatusUpdate;
    //alertMessage: any = {
    //    dbsApprovalStatus: "NotRequired",
    //    hasSubjectPrice: true,
    //    tutorHasAvailabilitySlots: true,
    //    hasGoogleAccount: true,
    //    hasStripeConnectAccount: true,
    //    hasStripeSubscription: false,
    //    tutorDBSCertificateNo:true,
    //};
    alertMessage: any = null;
    constructor(private tutorsService: TutorsService, private usersService: UsersService) { }

    ngOnInit(): void {
        $('.loading').show();
        this.getUserAlertMessage();
        this.tutorsService.getMy()
            .subscribe(success => {
                this.tutor = success;
                this.currentCompany = success.currentCompany;
                $('.loading').hide();
            }, error => {
            });
    }

    markProfileAuthorizedMessageRead(): void {
        $('.loading').show();
        this.tutorsService.markProfileAuthorizedMessageRead(this.tutor.tutorId)
            .subscribe(success => {
                this.ngOnInit();
            }, error => {
            });
    };

    markDbsAdminApprovedMessageRead(): void {
        $('.loading').show();
        this.tutorsService.markDbsAdminApprovedMessageRead(this.tutor.tutorId)
            .subscribe(success => {
                this.ngOnInit();
            }, error => {
            });
    };

    markDbsStatusMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType':this.alertMessage.userType,
            'referenceId' : this.alertMessage.id,
            'messageColumnName':'DbsStatusMessageRead',
            'messageStatus':true 
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsStatusMessage').css('display', 'none');
            }, error => {
            });
    };

    markDbsApprovedMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsApprovedMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsStatusMessageApproved').css('display', 'none');
            }, error => {
            });
    };

    markDbsNotApprovedMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsNotApprovedMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsNotApproved').css('display', 'none');
            }, error => {
            });
    };

    markPorfileApprovedMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#profileApprovedMessage').css('display', 'none');
            }, error => {
            });
    };

    markUpgradeProfileBasicTutorMessageRead    (): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileUpgradeMessageRead',
            'messageStatus': true
        }


        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#profileUpgradeMessage').css('display', 'none');
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
    


    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }
}
