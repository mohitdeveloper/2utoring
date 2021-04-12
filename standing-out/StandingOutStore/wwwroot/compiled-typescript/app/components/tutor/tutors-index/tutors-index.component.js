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
exports.TutorsIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var dialog_1 = require("@angular/material/dialog");
var tutor_invite_modal_1 = require("../tutor-invite-modal/tutor-invite-modal");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_toastr_1 = require("ngx-toastr");
var tutor_info_dialog_component_1 = require("./tutor-info-dialog.component");
var TutorsIndexComponent = /** @class */ (function () {
    function TutorsIndexComponent(modalService, dialog, tutorsService, toastr, usersService) {
        this.modalService = modalService;
        this.dialog = dialog;
        this.tutorsService = tutorsService;
        this.toastr = toastr;
        this.usersService = usersService;
        this.alertMessage = null;
        this.title = title;
        //title: string = 'Tutor Managements';
        this.takeValues = [
            { take: 10, name: 'Show 10' },
            { take: 25, name: 'Show 25' },
            { take: 50, name: 'Show 50' },
            { take: 100, name: 'Show 100' }
        ];
        this.filterOptions = ['All', 'ApprovalNotRequired', 'Approved', 'Unapproved'];
        this.searchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'User.Name',
            order: 'ASC',
            profileFilter: 'All',
            dbsFilter: 'All',
            filter: '',
        };
        this.results = { paged: null, data: null };
    }
    TutorsIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getTutors();
    };
    ;
    TutorsIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getTutors();
    };
    ;
    TutorsIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getTutors();
    };
    ;
    TutorsIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getTutors();
    };
    ;
    TutorsIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    TutorsIndexComponent.prototype.getTutors = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.getPaged(this.searchModel)
            .subscribe(function (success) {
            _this.results = success;
            if (environment_1.environment.indexPageAnchoringEnabled == true) {
                if (environment_1.environment.smoothScroll == false) {
                    //quick and snappy
                    window.scroll(0, 0);
                }
                else {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            }
            $('.loading').hide();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    TutorsIndexComponent.prototype.ngOnInit = function () {
        this.getTutors();
        this.getUserAlertMessage();
    };
    ;
    TutorsIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    TutorsIndexComponent.prototype.popinviteTutorsModal = function () {
        var _this = this;
        var modalRef = this.modalService.open(tutor_invite_modal_1.TutorInviteModalComponent, { size: 'lg' });
        modalRef.result.then(function (result) {
            if (result && result.length > 3) {
                _this.addToInvitesByEmails(result);
            }
        }, function (dismissalReason) {
        });
    };
    TutorsIndexComponent.prototype.addToInvitesByEmails = function (bulkEmailString) {
        var _this = this;
        var emailIds = bulkEmailString.split(",").map(function (x) { return x.trim(); }).filter(function (x) { return x !== ''; });
        if (!emailIds || emailIds.length === 0)
            return;
        this.tutorsService.sendInvitesToTutors(emailIds)
            .subscribe(function (success) {
            $('.loading').hide();
            _this.toastr.success('Invitation sent successfully!');
        }, function (error) {
            console.log(error);
        });
    };
    ;
    TutorsIndexComponent.prototype.showInformation = function (type) {
        var dialogRef = this.dialog.open(tutor_info_dialog_component_1.TutorInfoDialogComponent, {
            maxWidth: type == 'CRI' ? '75vw' : '65vw',
            //height: type == 'CRI' ? '40vw' : 'auto',
            //maxHeight: type == 'CRI' ? '60vw' : 'auto',
            panelClass: 'custom-modalbox',
            data: { type: type }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
            }
            else {
            }
        });
    };
    TutorsIndexComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    TutorsIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-tutors-index',
            templateUrl: './tutors-index.component.html'
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, dialog_1.MatDialog, index_1.TutorsService, ngx_toastr_1.ToastrService, index_1.UsersService])
    ], TutorsIndexComponent);
    return TutorsIndexComponent;
}());
exports.TutorsIndexComponent = TutorsIndexComponent;
//# sourceMappingURL=tutors-index.component.js.map