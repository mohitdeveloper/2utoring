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
exports.CompanyDashboardComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var $ = require("jquery");
var CompanyDashboardComponent = /** @class */ (function () {
    function CompanyDashboardComponent(companyService, companySubjectsService, usersService) {
        this.companyService = companyService;
        this.companySubjectsService = companySubjectsService;
        this.usersService = usersService;
        this.companyId = companyId;
        this.subjects = [];
        this.currentUrl = window.location.href;
        this.gaugeType = "full";
        this.gaugeLabel = "";
        this.gaugeAppendText = "";
        this.gaugeSize = 50;
        this.gaugeColor = "#d2fbd5";
        this.thick = 6;
        this.alertMessage = null;
    }
    CompanyDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.companyService.getById(this.companyId)
            .subscribe(function (success) {
            _this.company = success;
        }, function (error) {
        });
        this.getUserAlertMessage();
        this.companySubjectsService.getByCompanyForProfile(this.companyId)
            .subscribe(function (success) {
            _this.subjects = success;
        }, function (error) {
        });
        this.companyName = "Wizcraft";
        this.companyDescription = "I am in that company";
        this.coursesThisMonth = "25";
        this.lessonThisMonth = "35";
        this.revenueThisMonth = "£10,242";
        this.revenuePercentage = "21.6%";
        this.mostPopularSubject = "45";
        this.mostPopularSubjectText = "English";
        this.mostPopularLevel = "GCSE";
        this.openSafeGaurdIsses = "15";
        this.closedSafeGaurdIsses = "50";
        this.lessonsToday = "15";
        this.numberOfStudentsToday = "25";
        this.revenueToday = "£342";
        this.revenuePercentageToday = "20.6%";
        $('.loading').hide();
        //this.companyService.getCompnayBasiscDetails()
        //    .subscribe(success => {
        //        debugger;
        //        this.companyName = success.companyName;
        //        this.companyDescription = success.companyDescription;
        //        this.coursesThisMonth = success.coursesThisMonth;
        //        this.lessonThisMonth = success.lessonThisMonth;
        //        this.revenueThisMonth= success.revenueThisMonth;
        //        this.revenuePercentage = success.revenuePercentage;
        //        this.mostPopularSubject = success.mostPopularSubject;
        //        this.mostPopularSubjectText = success.mostPopularSubjectText;
        //        this.mostPopularLevel = success.mostPopularLevel;
        //        this.openSafeGaurdIsses = success.openSafeGaurdIsses;
        //        this.closedSafeGaurdIsses = success.closedSafeGaurdIsses;
        //        this.lessonsToday = success.lessonsToday;
        //        this.numberOfStudentsToday = success.numberOfStudentsToday;
        //        this.revenueToday = success.revenueToday;
        //        this.revenuePercentageToday = success.revenuePercentageToday;
        //        $('.loading').hide();
        //    }, error => {
        //        debugger;
        //    });
    };
    CompanyDashboardComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    CompanyDashboardComponent.prototype.markCompanyPorfileApprovedMessageRead = function () {
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
    CompanyDashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-company-dashboard',
            templateUrl: './company-dashboard.component.html',
            styleUrls: ['./company-dashboard.component.css']
        }),
        __metadata("design:paramtypes", [services_1.CompanyService, services_1.CompanySubjectsService, services_1.UsersService])
    ], CompanyDashboardComponent);
    return CompanyDashboardComponent;
}());
exports.CompanyDashboardComponent = CompanyDashboardComponent;
//# sourceMappingURL=company-dashboard.component.js.map