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
exports.CourseDetailsComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var ngx_toastr_1 = require("ngx-toastr");
var dialog_1 = require("@angular/material/dialog");
var checkout_course_details_dialog_component_1 = require("../checkout-course-details-dialog/checkout-course-details-dialog.component");
var CourseDetailsComponent = /** @class */ (function () {
    function CourseDetailsComponent(dialog, tutorsService, coursesService, toastr, classSessionFeaturesService, usersService) {
        this.dialog = dialog;
        this.tutorsService = tutorsService;
        this.coursesService = coursesService;
        this.toastr = toastr;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.usersService = usersService;
        this.courseData = [];
        this.alertMessage = null;
        this.subjectsImages = index_1.subjectImages;
        this.isAuthenticated = isAuthenticated;
    }
    CourseDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        debugger;
        $('.loading').show();
        this.getUserAlertMessage();
        var n = window.location.pathname.split('/');
        if (n[1] == 'Invitation-course-detail') {
            localStorage.setItem('coid', n[2]);
        }
        //this.courseId = 'bf24eee9-090d-485f-fbfd-08d8a99449e3';
        if (!localStorage.getItem('coid')) {
            window.location.href = '/';
            return false;
        }
        this.courseId = localStorage.getItem('coid');
        this.coursesService.getCourseDataById(this.courseId)
            .subscribe(function (success) {
            _this.courseData = success;
            if (_this.courseData.course.maxClassSize - _this.courseData.course.courseAttendeesCount == 0) {
                _this.checkOutButtonTxt = 'Sold Out';
            }
            else {
                _this.checkOutButtonTxt = 'Next: Checkout';
            }
            $('.loading').hide();
        }, function (error) {
        });
        //get user type
        //this.coursesService.getUserType()
        //    .subscribe(success => {
        //        this.userType = success;
        //        $('.loading').hide();
        //    }, error => {
        //    });
    };
    CourseDetailsComponent.prototype.checkOutEvent = function (availablePlaces) {
        if (availablePlaces == 0) {
            this.toastr.warning('No place available to book this courseData!');
            return false;
        }
        if (this.isAuthenticated == 'True') {
            window.location.href = '/course-sign-in/' + this.courseId + '/Others';
        }
        else {
            var dialogRef = this.dialog.open(checkout_course_details_dialog_component_1.CheckoutCourseDetailsDialogComponent, {
                maxWidth: '80vw',
                //width: '100%',
                maxHeight: '80%',
                panelClass: ["myClass"],
                autoFocus: false,
                data: {
                    'courseId': this.courseId
                }
            });
        }
    };
    CourseDetailsComponent.prototype.redirectMe = function (typ, id) {
        if (typ == 'myCourse') {
            localStorage.setItem('tutorId', id);
            window.location.href = "/my-course";
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id);
            window.location.href = "/course-details";
        }
        if (typ == 'viewTutor') {
            window.location.href = "/tutor/" + id;
        }
    };
    CourseDetailsComponent.prototype.backToSearch = function () {
        var tid = localStorage.getItem('tid');
        if (tid) {
            window.location.href = '/tutor/' + tid;
        }
        else {
            window.history.back();
        }
    };
    CourseDetailsComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    CourseDetailsComponent.prototype.handleDesableBookTutor = function () {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.alertMessage.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        }
        else {
            this.toastr.warning("Please go to create a course to book your sessions.");
            //alert("CompanyTutor, Tutor, Company");
        }
    };
    CourseDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-course-details',
            templateUrl: './course-details.component.html',
            styleUrls: ['./course-details.component.css']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, index_1.TutorsService, index_1.CoursesService, ngx_toastr_1.ToastrService, index_1.ClassSessionFeaturesService, index_1.UsersService])
    ], CourseDetailsComponent);
    return CourseDetailsComponent;
}());
exports.CourseDetailsComponent = CourseDetailsComponent;
//# sourceMappingURL=course-details.component.js.map