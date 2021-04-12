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
exports.TutorScheduleCalendarComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var calender_scheduler_component_1 = require("../../calender-scheduler/calender-scheduler.component");
var ngx_toastr_1 = require("ngx-toastr");
var TutorScheduleCalendarComponent = /** @class */ (function () {
    function TutorScheduleCalendarComponent(tutorsService, companyService, toastr, usersService) {
        this.tutorsService = tutorsService;
        this.companyService = companyService;
        this.toastr = toastr;
        this.usersService = usersService;
        this.type = '';
        this.selectedTutorsData = [];
        this.isBookedSlotVisible = true;
        this.fromSettingPage = true;
        this.editSlot = false;
        this.alertMessage = null;
    }
    TutorScheduleCalendarComponent.prototype.onResize = function (event) {
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
    TutorScheduleCalendarComponent.prototype.getScreenSize = function (event) {
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
    TutorScheduleCalendarComponent.prototype.ngOnInit = function () {
        this.getScreenSize();
        this.getTutorAvailability();
        this.getUserAlertMessage();
    };
    TutorScheduleCalendarComponent.prototype.getTutorAvailability = function () {
        var _this = this;
        $('.loading').show();
        this.companyService.getTutorAvailabilities(null)
            .subscribe(function (success) {
            if (success != null) {
                _this.selectedTutorsData = success;
                $('.loading').hide();
            }
        }, function (error) {
        });
    };
    TutorScheduleCalendarComponent.prototype.saveAvailability = function () {
        var _this = this;
        $('.loading').show();
        var obj = this.calendarRef.addedEvents;
        if (this.calendarRef.deletedEvents.length > 0) {
            Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
        }
        this.tutorsService.saveAvailability(obj).subscribe(function (success) {
            $('.loading').hide();
            _this.toastr.success('Availability saved successfully!');
        }, function (error) {
            $('.loading').hide();
        });
    };
    TutorScheduleCalendarComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    __decorate([
        core_1.ViewChild('calendarRef', { static: false }),
        __metadata("design:type", calender_scheduler_component_1.CalenderSchedulerComponent)
    ], TutorScheduleCalendarComponent.prototype, "calendarRef", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TutorScheduleCalendarComponent.prototype, "onResize", null);
    TutorScheduleCalendarComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-schedule-calendar',
            templateUrl: 'tutors-schedule-calendar.component.html',
            styleUrls: ['./tutors-schedule-calendar.component.css'],
        }),
        __metadata("design:paramtypes", [services_1.TutorsService, services_1.CompanyService, ngx_toastr_1.ToastrService, services_1.UsersService])
    ], TutorScheduleCalendarComponent);
    return TutorScheduleCalendarComponent;
}());
exports.TutorScheduleCalendarComponent = TutorScheduleCalendarComponent;
//# sourceMappingURL=tutors-schedule-calendar.component.js.map