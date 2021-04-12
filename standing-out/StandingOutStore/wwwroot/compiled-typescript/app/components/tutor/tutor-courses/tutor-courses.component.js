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
exports.TutorCoursesComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var ngx_toastr_1 = require("ngx-toastr");
var TutorCoursesComponent = /** @class */ (function () {
    function TutorCoursesComponent(tutorsService, toastr, coursesService, usersService) {
        this.tutorsService = tutorsService;
        this.toastr = toastr;
        this.coursesService = coursesService;
        this.usersService = usersService;
        this.lessonTabs = ['Present & Future', 'Previous'];
        this.selectedlessonTabs = this.lessonTabs[0];
        this.maxSizeOfClass = 0;
        this.alertMessage = null;
    }
    TutorCoursesComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.tutorsService.getSubScriptionFeatureByTutor().subscribe(function (res) {
            $('.loading').hide();
            _this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
        }, function (err) {
        });
        this.getUserAlertMessage();
    };
    TutorCoursesComponent.prototype.createCourse = function () {
        this.coursesService.clearData();
        window.location.href = "/tutor/courses/create-course";
    };
    //delete courses
    TutorCoursesComponent.prototype.onCourseDelete = function (courseId) {
        var _this = this;
        $('.loading').show();
        //soft delete course from database
        this.coursesService.deleteCourse(courseId)
            .subscribe(function (success) {
            //this.getPaged();
            $('.loading').hide();
            _this.toastr.success('Course deleted successfully!');
            location.reload();
        }, function (error) {
            $('.loading').hide();
        });
    };
    TutorCoursesComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    TutorCoursesComponent.prototype.markDbsStatusMessageReadMessageRead = function () {
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
    TutorCoursesComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-courses',
            templateUrl: './tutor-courses.component.html',
            styleUrls: ['./tutor-courses.component.css']
        }),
        __metadata("design:paramtypes", [services_1.TutorsService, ngx_toastr_1.ToastrService, services_1.CoursesService, services_1.UsersService])
    ], TutorCoursesComponent);
    return TutorCoursesComponent;
}());
exports.TutorCoursesComponent = TutorCoursesComponent;
//# sourceMappingURL=tutor-courses.component.js.map