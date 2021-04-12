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
exports.DashboardAdminComponent = void 0;
var core_1 = require("@angular/core");
var models_1 = require("../../../models");
var services_1 = require("../../../services");
var DashboardAdminComponent = /** @class */ (function () {
    function DashboardAdminComponent(dashboardService) {
        this.dashboardService = dashboardService;
        this.title = title;
        this.date = new Date();
        this.startDate = null;
        this.endDate = null;
        this.toLoad = 2;
        this.loaded = 0;
        this.dashboardInfo = new models_1.ManagementInfoDashboard();
        this.sessions = new models_1.PagedList();
        this.dashboardSearchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'StartDate',
            order: 'DESC',
            filter: '',
            startDate: this.startDate,
            endDate: this.endDate
        };
        this.sessionSearchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'StartDate',
            order: 'DESC',
            filter: '',
            startDate: this.startDate,
            endDate: this.endDate
        };
    }
    DashboardAdminComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    DashboardAdminComponent.prototype.search = function () {
        console.log(this.startDate);
        this.dashboardSearchModel.startDate = this.startDate;
        this.dashboardSearchModel.endDate = this.endDate;
        this.sessionSearchModel.startDate = this.startDate;
        this.sessionSearchModel.endDate = this.endDate;
        this.ngOnInit();
    };
    ;
    DashboardAdminComponent.prototype.ngOnInit = function () {
        console.log('test');
        this.loaded = 0;
        $('.loading').show();
        this.getDasboard();
        this.getSessions();
    };
    ;
    DashboardAdminComponent.prototype.getDasboard = function () {
        var _this = this;
        this.dashboardService.getManagementInfo(this.dashboardSearchModel).subscribe(function (success) {
            _this.dashboardInfo = success;
            _this.incrementLoad();
        }, function (err) {
        });
    };
    ;
    DashboardAdminComponent.prototype.getSessions = function () {
        var _this = this;
        this.dashboardService.getSessions(this.dashboardSearchModel).subscribe(function (success) {
            _this.sessions = success;
            _this.incrementLoad();
        }, function (err) {
        });
    };
    ;
    DashboardAdminComponent.prototype.nextSessions = function () {
        this.sessionSearchModel.page = this.sessionSearchModel.page + 1;
        this.getSessions();
    };
    ;
    DashboardAdminComponent.prototype.prevSessions = function () {
        this.sessionSearchModel.page = this.sessionSearchModel.page - 1;
        this.getSessions();
    };
    ;
    DashboardAdminComponent.prototype.submitSessionForm = function (event) {
        event.target.submit();
    };
    ;
    DashboardAdminComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard-admin',
            templateUrl: './dashboard-admin.component.html'
        }),
        __metadata("design:paramtypes", [services_1.DashboardService])
    ], DashboardAdminComponent);
    return DashboardAdminComponent;
}());
exports.DashboardAdminComponent = DashboardAdminComponent;
//# sourceMappingURL=dashboard-admin.component.js.map