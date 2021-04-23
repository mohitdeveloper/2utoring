"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CompanyProfileViewComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var dialog_1 = require("@angular/material/dialog");
var confirmation_dialog_component_1 = require("../../company-register/company-register/confirmation-dialog.component");
var ngx_toastr_1 = require("ngx-toastr");
var forms_1 = require("@angular/forms");
/*declare var stripeCountry: any;*/
var CompanyProfileViewComponent = /** @class */ (function () {
    function CompanyProfileViewComponent(companysService, companySubjectsService, dialog, toastr, fb, coursesService, usersService) {
        this.companysService = companysService;
        this.companySubjectsService = companySubjectsService;
        this.dialog = dialog;
        this.toastr = toastr;
        this.fb = fb;
        this.coursesService = coursesService;
        this.usersService = usersService;
        this.isAuthenticated = isAuthenticated;
        /*stripeCountry: any = stripeCountry;*/
        this.hasDbsApproved = false;
        this.loaded = 0;
        this.toLoad = 2;
        this.subjects = [];
        this.getUrl = window.location;
        this.url = this.getUrl.protocol + "//" + this.getUrl.host;
        this.teamMemberData = [];
        this.profileTabActive = 'tab1';
        this.companyCourses = [];
        this.tutorObj = {};
        this.dataLimit = 10;
        this.currentLimit = this.dataLimit;
        this.contactAgencyFormSubmitted = false;
        this.alertMessage = null;
        this.subjectsImages = services_1.subjectImages;
    }
    Object.defineProperty(CompanyProfileViewComponent.prototype, "contactAgencyFormCompanyControls", {
        get: function () { return this.contactAgency.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    CompanyProfileViewComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    CompanyProfileViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        //this.getUserType();
        this.getUserAlertMessage();
        this.contactAgency = this.fb.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            receiverEmail: [''],
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            message: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(500)]],
        });
        this.companysService.getCompanyDataById(this.companyId)
            .subscribe(function (success) {
            _this.company = success;
            _this.getTutorsDetails();
            _this.companyCourses = _this.company.courses;
            $('.loading').hide();
        }, function (error) {
        });
        //this.companysService.getTeamData()
        //    .subscribe(success => {
        //        if (success != null) {
        //            this.teamMemberData = success;
        //        }
        //    }, error => {
        //        // debugger;
        //    });
    };
    //delete team data
    CompanyProfileViewComponent.prototype.openDialog = function (mbrId, index) {
        var _this = this;
        var dialogRef = this.dialog.open(confirmation_dialog_component_1.ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });
        dialogRef.afterClosed().subscribe(function (confirmed) {
            if (confirmed) {
                //debugger;
                //this.meetData.splice(index, 1);
                // delete query will gone here
                _this.companysService.deleteCompanyMember(mbrId)
                    .subscribe(function (success) {
                    _this.teamMemberData.splice(index, 1); // Splice after delete is success
                    _this.toastr.success('Member removed!');
                    //console.log(success);
                }, function (error) {
                });
            }
        });
    };
    CompanyProfileViewComponent.prototype.sendMessageForAgency = function () {
        var _this = this;
        this.contactAgencyFormSubmitted = true;
        if (this.contactAgency.valid) {
            $('.loading').show();
            var sendMessageInfo = __assign({}, this.contactAgency.getRawValue());
            //this.contactAgency.controls["receiverEmail"].setValue(this.company.emailAddress);
            this.contactAgency.patchValue({ 'receiverEmail': this.company.emailAddress });
            this.companysService.sendMessageToAgency(sendMessageInfo)
                .subscribe(function (success) {
                if (success) {
                    $('.loading').hide();
                    _this.toastr.success('Mail sent sucessfully!');
                    window.location.reload();
                }
                else {
                    $('.loading').hide();
                    _this.toastr.error('Something went wrong');
                }
            }, function (error) {
                $('.loading').hide();
                _this.toastr.error('Something went wrong');
            });
        }
    };
    CompanyProfileViewComponent.prototype.getTutorsDetails = function () {
        for (var i = 0; i < this.company.tutors.length; i++) {
            debugger;
            this.tutorObj[this.company.tutors[i].tutorId] = this.company.tutors[i];
            if (this.company.tutors[i].dbsApprovalStatus == 'Approved') {
                this.hasDbsApproved = true;
            }
        }
    };
    CompanyProfileViewComponent.prototype.showMoreData = function () {
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    };
    CompanyProfileViewComponent.prototype.backToSearch = function (type) {
        if (type == 'search') {
            window.location.href = '/tutor-course-search';
        }
        else {
            window.location.href = '/company/profile/edit';
        }
    };
    CompanyProfileViewComponent.prototype.redirectMe = function (typ, id) {
        debugger;
        if (typ == 'myCourse') {
            localStorage.setItem('tutorId', id);
            localStorage.removeItem('expCourses');
            window.location.href = "/my-course";
        }
        if (typ == 'tutorCourses') {
            window.location.href = "/tutor/" + id;
            localStorage.setItem('expCourses', 'True');
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id);
            localStorage.removeItem('expCourses');
            window.location.href = "/course-details";
        }
        if (typ == 'viewTutor') {
            localStorage.removeItem('expCourses');
            window.location.href = "/tutor/" + id;
        }
    };
    CompanyProfileViewComponent.prototype.getUserType = function () {
        var _this = this;
        //get user type
        this.coursesService.getUserType()
            .subscribe(function (success) {
            _this.userType = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    CompanyProfileViewComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    CompanyProfileViewComponent.prototype.goToTutorSearch = function () {
        this.company.name;
        localStorage.setItem("CompanyName", this.company.name);
        window.location.href = "/tutor-search";
    };
    CompanyProfileViewComponent.prototype.handleDesableBookTutor = function () {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.alertMessage.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        }
        else {
            this.toastr.warning("Please go to create a course to book your sessions.");
            //alert("CompanyTutor, Tutor, Company");
        }
    };
    CompanyProfileViewComponent.prototype.markCompanyPorfileApprovedMessageRead = function () {
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
            $('#companyProfileMessageApproved').css('display', 'none');
        }, function (error) {
        });
    };
    ;
    CompanyProfileViewComponent.prototype.setProfileTabActive = function (tabName) {
        this.profileTabActive = tabName;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CompanyProfileViewComponent.prototype, "companyId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CompanyProfileViewComponent.prototype, "showEditButton", void 0);
    CompanyProfileViewComponent = __decorate([
        core_1.Component({
            selector: 'app-company-profile-view',
            templateUrl: './company-profile-view.component.html',
            styleUrls: ['./company-profile-view.component.scss']
        }),
        __metadata("design:paramtypes", [services_1.CompanyService,
            services_1.CompanySubjectsService,
            dialog_1.MatDialog,
            ngx_toastr_1.ToastrService,
            forms_1.FormBuilder,
            services_1.CoursesService,
            services_1.UsersService])
    ], CompanyProfileViewComponent);
    return CompanyProfileViewComponent;
}());
exports.CompanyProfileViewComponent = CompanyProfileViewComponent;
//# sourceMappingURL=company-profile-view.component.js.map