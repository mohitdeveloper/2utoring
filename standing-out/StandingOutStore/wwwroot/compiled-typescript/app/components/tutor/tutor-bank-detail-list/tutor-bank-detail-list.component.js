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
exports.TutorBankDetailsListComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var TutorBankDetailsListComponent = /** @class */ (function () {
    function TutorBankDetailsListComponent(companyService) {
        this.companyService = companyService;
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
            sortType: 'UserFullName',
            order: 'DESC',
            filter: '',
        };
        this.results = { paged: null, data: null };
    }
    TutorBankDetailsListComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getPagedBankDetails();
    };
    ;
    TutorBankDetailsListComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getPagedBankDetails();
    };
    ;
    TutorBankDetailsListComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getPagedBankDetails();
    };
    ;
    TutorBankDetailsListComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getPagedBankDetails();
    };
    ;
    TutorBankDetailsListComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    TutorBankDetailsListComponent.prototype.getPagedBankDetails = function () {
        var _this = this;
        $('.loading').show();
        this.companyService.getPagedBankDetails(this.searchModel)
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
        }, function (error) {
            console.log(error);
        }, function () {
            $('.loading').hide();
        });
    };
    ;
    TutorBankDetailsListComponent.prototype.ngOnInit = function () {
        this.getPagedBankDetails();
    };
    ;
    TutorBankDetailsListComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    TutorBankDetailsListComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-bank-detail-list',
            templateUrl: './tutor-bank-detail-list.component.html',
            styleUrls: ['./tutor-bank-detail-list.component.css']
        }),
        __metadata("design:paramtypes", [index_1.CompanyService])
    ], TutorBankDetailsListComponent);
    return TutorBankDetailsListComponent;
}());
exports.TutorBankDetailsListComponent = TutorBankDetailsListComponent;
//# sourceMappingURL=tutor-bank-detail-list.component.js.map