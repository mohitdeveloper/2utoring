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
exports.ClassSessionsAdminIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var ClassSessionsAdminIndexComponent = /** @class */ (function () {
    function ClassSessionsAdminIndexComponent(classSessionsService, toastr) {
        this.classSessionsService = classSessionsService;
        this.toastr = toastr;
        this.url = window.location.hostname;
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
    }
    ClassSessionsAdminIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getClassSessions();
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getClassSessions();
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getClassSessions();
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getClassSessions();
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    ClassSessionsAdminIndexComponent.prototype.getClassSessions = function () {
        var _this = this;
        $('.loading').show();
        this.classSessionsService.getPaged(this.searchModel)
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
    ClassSessionsAdminIndexComponent.prototype.ngOnInit = function () {
        this.searchModel.order = this.filter == 'upcoming' ? 'ASC' : 'DESC';
        this.searchModel.filter = this.filter;
        this.getClassSessions();
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.getLink = function (item) {
        var el = document.createElement('textarea');
        el.value = this.url + '/lesson/' + item.classSessionId;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.toastr.success('The link for this lesson has been copied to your clipboard');
    };
    ;
    ClassSessionsAdminIndexComponent.prototype.enterLesson = function (lesson) {
        window.open(environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
    };
    ;
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsAdminIndexComponent.prototype, "filter", void 0);
    ClassSessionsAdminIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-admin-index',
            templateUrl: './class-sessions-admin-index.component.html',
            styleUrls: ['./class-sessions-admin-index.component.css']
        }),
        __metadata("design:paramtypes", [index_1.ClassSessionsService, ngx_toastr_1.ToastrService])
    ], ClassSessionsAdminIndexComponent);
    return ClassSessionsAdminIndexComponent;
}());
exports.ClassSessionsAdminIndexComponent = ClassSessionsAdminIndexComponent;
//# sourceMappingURL=class-sessions-admin-index.component.js.map