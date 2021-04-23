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
exports.TutorProfileViewComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var $ = require("jquery");
var calender_component_1 = require("../../calender/calender.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
/*declare var stripeCountry: any;*/
var TutorProfileViewComponent = /** @class */ (function () {
    function TutorProfileViewComponent(fb, toastr, tutorsService, tutorQualificationsService, tutorSubjectsService, usersService, companyService) {
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.tutorQualificationsService = tutorQualificationsService;
        this.tutorSubjectsService = tutorSubjectsService;
        this.usersService = usersService;
        this.companyService = companyService;
        this.isAuthenticated = isAuthenticated;
        /*stripeCountry: any = stripeCountry;*/
        this.loaded = 0;
        this.toLoad = 3;
        this.qualifications = [];
        this.subjects = [];
        this.selectedTutorsData = [];
        this.isBookedSlotVisible = true;
        this.fromSettingPage = false;
        this.editSlot = false;
        this.profileTabActive = 'tab1';
        //url: string = window.location.hostname;
        this.url = window.location.origin;
        this.dataLimit = 10;
        this.currentLimit = this.dataLimit;
        this.subjectsImages = services_1.subjectImages;
        this.contactTutorFormSubmitted = false;
        this.alertMessage = null;
    }
    Object.defineProperty(TutorProfileViewComponent.prototype, "contactTutorFormControls", {
        get: function () { return this.contactTutor.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    TutorProfileViewComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    TutorProfileViewComponent.prototype.onResize = function (event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.fc-today-button').addClass('col-12');
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.screenSize >= 1300) {
            $('.mfs').css('display', 'none');
            // $('.fc-today-button').addClass('col-12');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            // $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
    };
    TutorProfileViewComponent.prototype.getScreenSize = function (event) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
        if (this.scrWidth <= 1025) {
            setTimeout(function () {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 300);
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.scrWidth >= 1350) {
            setTimeout(function () {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300);
        }
        if (this.scrWidth <= 768) {
            setTimeout(function () {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300);
        }
        else {
            setTimeout(function () {
                $('.fc-today-button').removeClass('col-12');
            }, 300);
        }
    };
    TutorProfileViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getScreenSize();
        var tid = localStorage.getItem('tid');
        if (tid) {
            localStorage.removeItem('tid');
        }
        $('.loading').show();
        this.getUserAlertMessage();
        this.getTutorAvailability();
        if (localStorage.getItem('expCourses') == 'True') {
            this.profileTabActive = 'tab2';
        }
        this.contactTutor = this.fb.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            receiverEmail: [''],
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
            message: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(500)]],
        });
        this.tutorsService.getTutorProfile(this.tutorId)
            .subscribe(function (success) {
            _this.tutor = success;
            //this.incrementLoad();
            $('.loading').hide();
        }, function (error) {
            $('.loading').hide();
        });
        //this.tutorsService.getById(this.tutorId)
        //    .subscribe(success => {
        //        //this.tutor = success;
        //        this.incrementLoad();
        //    }, error => {
        //    });
        this.tutorSubjectsService.getByTutorForProfile(this.tutorId)
            .subscribe(function (success) {
            _this.subjects = success;
            _this.incrementLoad();
        }, function (error) {
        });
    };
    TutorProfileViewComponent.prototype.backToSearch = function (type) {
        if (type == 'back') {
            window.history.back();
            //window.location.href = '/tutor-course-search';
        }
        else {
            window.location.href = '/tutor/profile/edit';
        }
    };
    TutorProfileViewComponent.prototype.showMoreData = function () {
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    };
    TutorProfileViewComponent.prototype.redirectMe = function (typ, id) {
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id);
            localStorage.setItem('tid', this.tutorId);
            window.location.href = "/course-details";
        }
        if (typ == 'companyDetails') {
            window.location.href = "/company/" + id;
        }
    };
    TutorProfileViewComponent.prototype.sendMessageForTutor = function () {
        var _this = this;
        this.contactTutorFormSubmitted = true;
        if (this.contactTutor.valid) {
            $('.loading').show();
            var userEmail = this.tutor.userEmail;
            var sendMessageInfo = __assign({}, this.contactTutor.getRawValue());
            //this.contactTutor.controls["receiverEmail"].setValue(this.tutor.userEmail);
            this.contactTutor.patchValue({ 'receiverEmail': userEmail });
            sendMessageInfo.receiverEmail = userEmail;
            this.tutorsService.sendMessageToTutor(sendMessageInfo)
                .subscribe(function (success) {
                if (success) {
                    debugger;
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
    TutorProfileViewComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
            //to check user is him self or checking others proifle
            var curl = window.location.href;
            var viewProfileId = curl.substring(curl.lastIndexOf('/') + 1);
            debugger;
            if (viewProfileId != _this.alertMessage.id) {
                _this.isLoggedInUser = false;
            }
            if (viewProfileId == 'view') {
                _this.isLoggedInUser = true;
            }
        }, function (error) {
        });
    };
    TutorProfileViewComponent.prototype.markUpgradeProfileBasicTutorMessageRead = function () {
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
    TutorProfileViewComponent.prototype.goToTutorSearch = function () {
        window.location.href = "/tutor-search";
    };
    TutorProfileViewComponent.prototype.getTutorAvailability = function () {
        var _this = this;
        var curl = window.location.href;
        var tutorId = curl.substring(curl.lastIndexOf('/') + 1);
        debugger;
        $('.loading').show();
        this.companyService.getTutorAvailabilities(tutorId)
            .subscribe(function (success) {
            if (success != null) {
                _this.selectedTutorsData = success;
                $('.loading').hide();
            }
        }, function (error) {
        });
    };
    TutorProfileViewComponent.prototype.setTab = function () {
        var _this = this;
        debugger;
        $('#mcur').css('display', 'none');
        this.profileTabActive = 'tab3';
        setTimeout(function () {
            _this.calendarComponent.calendarApi.render();
            //$('tr.fc-scrollgrid-section-body').eq(0).hide();
            //this.calendarComponent.addLessonButton();
        }, 200);
    };
    TutorProfileViewComponent.prototype.setProfileTabActive = function (tabName) {
        this.profileTabActive = tabName;
    };
    __decorate([
        core_1.ViewChild('calendarRef'),
        __metadata("design:type", calender_component_1.CalenderComponent)
    ], TutorProfileViewComponent.prototype, "calendarComponent", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TutorProfileViewComponent.prototype, "tutorId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TutorProfileViewComponent.prototype, "showEditButton", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TutorProfileViewComponent.prototype, "onResize", null);
    TutorProfileViewComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-profile-view',
            templateUrl: './tutor-profile-view.component.html',
            styleUrls: ['./tutor-profile-view.component.scss']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.TutorQualificationsService, services_1.TutorSubjectsService, services_1.UsersService, services_1.CompanyService])
    ], TutorProfileViewComponent);
    return TutorProfileViewComponent;
}());
exports.TutorProfileViewComponent = TutorProfileViewComponent;
//# sourceMappingURL=tutor-profile-view.component.js.map