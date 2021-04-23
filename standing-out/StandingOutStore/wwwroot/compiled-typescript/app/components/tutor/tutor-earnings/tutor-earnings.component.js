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
exports.TutorEarningsComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var TutorEarningsComponent = /** @class */ (function () {
    //toLoad: number = this.stripeConnectAccountId !== undefined && this.stripeConnectAccountId != null && this.stripeConnectAccountId != '' && (success == true || success === undefined) ? 1 : 0;
    //loaded: number = 0;
    function TutorEarningsComponent(classSessionsService, usersService, stripeService, toastr) {
        this.classSessionsService = classSessionsService;
        this.usersService = usersService;
        this.stripeService = stripeService;
        this.toastr = toastr;
        this.colspan = 7;
        this.alertMessage = null;
        this.showReloadList = false;
        this.stripeCountry = stripeCountry;
        this.area = area;
        this.takeValues = [
            { take: 10, name: 'Show 10' },
            { take: 25, name: 'Show 25' },
            { take: 50, name: 'Show 50' },
            { take: 100, name: 'Show 100' }
        ];
        this.searchModel = {
            take: 10,
            search: '',
            page: 1,
            totalPages: 1,
            sortType: 'StartDate',
            order: 'DESC',
            filter: '',
        };
        this.results = { paged: null, data: null };
        if (this.area == 'Admin')
            this.colspan = 8;
    }
    TutorEarningsComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getClassSessions();
    };
    ;
    TutorEarningsComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getClassSessions();
    };
    ;
    TutorEarningsComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getClassSessions();
    };
    ;
    TutorEarningsComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getClassSessions();
    };
    ;
    TutorEarningsComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    TutorEarningsComponent.prototype.getClassSessions = function () {
        var _this = this;
        debugger;
        $('.loading').show();
        this.classSessionsService.getEarnings(this.searchModel)
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
    TutorEarningsComponent.prototype.ngOnInit = function () {
        this.getClassSessions();
        this.getUserAlertMessage();
    };
    ;
    TutorEarningsComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    TutorEarningsComponent.prototype.getTotalEarnings = function () {
        var result = 0;
        if (this.results.data != null) {
            for (var i = 0; i < this.results.data.length; i++) {
                result += this.results.data[i].vendorEarningAmount;
            }
        }
        return result;
    };
    ;
    TutorEarningsComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    TutorEarningsComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-earnings',
            templateUrl: './tutor-earnings.component.html',
            styleUrls: ['./tutor-earnings.component.css']
        }),
        __metadata("design:paramtypes", [index_1.ClassSessionsService, index_1.UsersService, index_1.StripeService, ngx_toastr_1.ToastrService])
    ], TutorEarningsComponent);
    return TutorEarningsComponent;
}());
exports.TutorEarningsComponent = TutorEarningsComponent;
//# sourceMappingURL=tutor-earnings.component.js.map