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
exports.TutorDetailsComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_toastr_1 = require("ngx-toastr");
var utilities_alert_modal_1 = require("../../utilities/utilities-alert-modal/utilities-alert-modal");
var __1 = require("../..");
var rxjs_1 = require("rxjs");
var TutorDetailsComponent = /** @class */ (function () {
    function TutorDetailsComponent(tutorsService, toastr, modalService, classSessionFeaturesService) {
        var _this = this;
        this.tutorsService = tutorsService;
        this.toastr = toastr;
        this.modalService = modalService;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.title = title;
        this.tutorId = tutorId;
        this.tutor = new index_1.AdminTutorDetails;
        this.currentTabStep = 'basic-info-tab';
        this.classSessionFeatures = new index_1.ClassSessionFeatures();
        this.toLoad = 1;
        this.loaded = 0;
        this.getClassSessionFeaturesByTutorId = new rxjs_1.Observable(function (subscriber) {
            //console.log("Getting classroom subscription features..");
            _this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(_this.tutor.tutorId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                _this.classSessionFeatures = features;
                subscriber.next(features);
            }, function (error) { console.log("Could not get classroom subscription features"); });
        });
    }
    TutorDetailsComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    TutorDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.adminGetById(this.tutorId).subscribe(function (success) {
            _this.tutor = success;
            debugger;
            var dbsC = 0;
            var qC = 0;
            for (var i = 0; i < success.tutorCertificates.length; i++) {
                if (success.tutorCertificates[i].certificateType == "DBS") {
                    dbsC = dbsC + 1;
                }
                if (success.tutorCertificates[i].certificateType == "Qualification") {
                    qC = qC + 1;
                }
            }
            _this.hasDBSCertificates = dbsC > 0 ? true : false;
            _this.hasQualificationCertificates = qC > 0 ? true : false;
            _this.getClassSessionFeaturesByTutorId.subscribe(function (success) { });
            _this.incrementLoad();
        }, function (err) {
        });
    };
    ;
    TutorDetailsComponent.prototype.approveProfileConfirm = function () {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Approve Profile Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to approve this Profile, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Approve Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                _this.approveProfileConfirmed();
            }
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    TutorDetailsComponent.prototype.rejectProfileConfirm = function () {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Reject Profile Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to reject this Profile, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Reject Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                _this.rejectProfileConfirmed();
            }
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    TutorDetailsComponent.prototype.approveDBSConfirm = function () {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Approve DBS Certificate Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to approve this DBS Certificate, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Approve Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                _this.approveDBSConfirmed();
            }
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    TutorDetailsComponent.prototype.rejectDBSConfirm = function () {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Reject DBS Certificate Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to reject this DBS Certificate, this cannot be undone.';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Reject Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                _this.rejectDBSConfirmed();
            }
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    TutorDetailsComponent.prototype.rejectAccount = function () {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Disable Tutor\'s Account Confirmation';
        modalRef.componentInstance.message = 'Are you sure you want to disable this Tutor\'s Account and set it back to an \'unapproved\' status?';
        modalRef.componentInstance.noButtonText = 'Return to Tutor';
        modalRef.componentInstance.yesButtonText = 'Disable Tutor';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response
        modalRef.result.then(function (result) {
            console.log(result);
            if (result == true) {
                $('.loading').show();
                _this.tutorsService.rejectProfile(_this.tutorId).subscribe(function (success) {
                    _this.tutorsService.rejectDBS(_this.tutorId).subscribe(function (successItem) {
                        _this.ngOnInit();
                        _this.toastr.success('Background check rejected successfully');
                    }, function (err) {
                        _this.toastr.error('We were unable to reject the background check');
                    });
                    _this.toastr.success('Tutor profile rejected successfully');
                }, function (err) {
                    _this.toastr.error('We were unable to reject the tutor profile');
                });
            }
        }, function (reason) {
            console.log('dsmissed - closed no action');
        });
    };
    ;
    TutorDetailsComponent.prototype.needsProfileApproval = function () {
        // Requires approval when - When Approved or NotRequired returns false
        if (this.tutor.profileApprovalStatus == 'Approved' || this.tutor.profileApprovalStatus == 'NotRequired')
            return false;
        return true;
    };
    TutorDetailsComponent.prototype.needsDbsApproval = function () {
        // Requires approval when - When Approved or NotRequired returns false
        if (this.tutor.dbsApprovalStatus == 'Approved' || this.tutor.dbsApprovalStatus == 'NotRequired')
            return false;
        return true;
    };
    TutorDetailsComponent.prototype.approveProfileConfirmed = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.approveProfile(this.tutorId).subscribe(function (success) {
            _this.ngOnInit();
            _this.toastr.success('Tutor profile approve successfully');
        }, function (err) {
            _this.toastr.error('We were unable to approve the tutor profile');
        });
    };
    ;
    TutorDetailsComponent.prototype.rejectProfileConfirmed = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.rejectProfile(this.tutorId).subscribe(function (success) {
            _this.ngOnInit();
            _this.toastr.success('Tutor profile rejected successfully');
        }, function (err) {
            _this.toastr.error('We were unable to reject the tutor profile');
        });
    };
    ;
    TutorDetailsComponent.prototype.approveDBSConfirmed = function () {
        var _this = this;
        this.tutorsService.approveDBS(this.tutorId).subscribe(function (success) {
            _this.ngOnInit();
            _this.toastr.success('Background check approved successfully');
        }, function (err) {
            _this.toastr.error('We were unable to approve the background check');
        });
    };
    ;
    TutorDetailsComponent.prototype.rejectDBSConfirmed = function () {
        var _this = this;
        this.tutorsService.rejectDBS(this.tutorId).subscribe(function (success) {
            _this.ngOnInit();
            _this.toastr.success('Background check rejected successfully');
        }, function (err) {
            _this.toastr.error('We were unable to reject the background check');
        });
    };
    ;
    TutorDetailsComponent.prototype.viewProfile = function () {
        window.location.href = window.location.origin + "/tutor/" + this.tutorId;
    };
    __decorate([
        core_1.ViewChild('tutorProfileRef'),
        __metadata("design:type", __1.TutorProfileViewComponent)
    ], TutorDetailsComponent.prototype, "tutorProfileRef", void 0);
    TutorDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-details',
            templateUrl: './tutor-details.component.html'
        }),
        __metadata("design:paramtypes", [index_2.TutorsService, ngx_toastr_1.ToastrService, ng_bootstrap_1.NgbModal,
            index_2.ClassSessionFeaturesService])
    ], TutorDetailsComponent);
    return TutorDetailsComponent;
}());
exports.TutorDetailsComponent = TutorDetailsComponent;
//# sourceMappingURL=tutor-details.component.js.map