"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorDashboardComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var TutorDashboardComponent = /** @class */ (function () {
    function TutorDashboardComponent(tutorsService, usersService) {
        this.tutorsService = tutorsService;
        this.usersService = usersService;
        this.currentUrl = window.location.href;
        //alertMessage: any = {
        //    dbsApprovalStatus: "NotRequired",
        //    hasSubjectPrice: true,
        //    tutorHasAvailabilitySlots: true,
        //    hasGoogleAccount: true,
        //    hasStripeConnectAccount: true,
        //    hasStripeSubscription: false,
        //    tutorDBSCertificateNo:true,
        //};
        this.alertMessage = null;
    }
    TutorDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.getUserAlertMessage();
        this.tutorsService.getMy()
            .subscribe(function (success) {
            _this.tutor = success;
            _this.currentCompany = success.currentCompany;
            $('.loading').hide();
        }, function (error) {
        });
    };
    TutorDashboardComponent.prototype.markProfileAuthorizedMessageRead = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.markProfileAuthorizedMessageRead(this.tutor.tutorId)
            .subscribe(function (success) {
            _this.ngOnInit();
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markDbsAdminApprovedMessageRead = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.markDbsAdminApprovedMessageRead(this.tutor.tutorId)
            .subscribe(function (success) {
            _this.ngOnInit();
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markDbsStatusMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsStatusMessage').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markDbsApprovedMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsApprovedMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsStatusMessageApproved').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markDbsNotApprovedMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsNotApprovedMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsNotApproved').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markPorfileApprovedMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#profileApprovedMessage').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markUpgradeProfileBasicTutorMessageRead = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileUpgradeMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#profileUpgradeMessage').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.markDbsStatusMessageReadBasicTutor = function () {
        $('.loading').show();
        var messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsStatusMessageRead',
            'messageStatus': true
        };
        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(function (success) {
            $('.loading').hide();
            $('#dbsStatusMessageBasicTutor').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    TutorDashboardComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    TutorDashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-dashboard',
            templateUrl: './tutor-dashboard.component.html',
            styleUrls: ['./tutor-dashboard.component.css']
        }),
        __metadata("design:paramtypes", [services_1.TutorsService, services_1.UsersService])
    ], TutorDashboardComponent);
    return TutorDashboardComponent;
}());
exports.TutorDashboardComponent = TutorDashboardComponent;
//# sourceMappingURL=tutor-dashboard.component.js.map