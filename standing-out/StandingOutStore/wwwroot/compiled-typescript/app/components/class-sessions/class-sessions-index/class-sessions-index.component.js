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
exports.ClassSessionsIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var environment_1 = require("../../../../environments/environment");
var ngx_toastr_1 = require("ngx-toastr");
var rxjs_1 = require("rxjs");
var ClassSessionsIndexComponent = /** @class */ (function () {
    function ClassSessionsIndexComponent(classSessionsService, toastr, classSessionFeaturesService) {
        var _this = this;
        this.classSessionsService = classSessionsService;
        this.toastr = toastr;
        this.classSessionFeaturesService = classSessionFeaturesService;
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
        this.classSessionFeatures = new index_1.ClassSessionFeatures();
        this.canViewCompletedLessons = false;
        // usage getClassSessionFeaturesByTutorId.subscribe(features => { // do stuff with features });
        this.getSubscriptionFeaturesByClassSessionId = new rxjs_1.Observable(function (subscriber) {
            console.log("Getting classroom subscription features..");
            _this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(_this.classSessionId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                _this.classSessionFeatures = features;
                subscriber.next(features);
            }, function (error) { console.log("Could not get classroom subscription features"); });
        });
    }
    ClassSessionsIndexComponent.prototype.updateSearchModel = function (type) {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }
        this.getClassSessions();
    };
    ;
    ClassSessionsIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getClassSessions();
    };
    ;
    ClassSessionsIndexComponent.prototype.next = function () {
        this.searchModel.page++;
        this.getClassSessions();
    };
    ;
    ClassSessionsIndexComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.getClassSessions();
    };
    ;
    ClassSessionsIndexComponent.prototype.alterOrder = function (type) {
        this.searchModel.sortType = type;
        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        }
        else {
            this.searchModel.order = 'DESC';
        }
        this.reloadData();
    };
    ClassSessionsIndexComponent.prototype.loadTutorSubscriptionFeatures = function (data) {
        if (data && data.length > 0) {
            this.classSessionId = data[0].classSessionId;
            this.getSubscriptionFeaturesByClassSessionId
                .subscribe(function (features) { }, function (error) { });
        }
    };
    ClassSessionsIndexComponent.prototype.getClassSessions = function () {
        var _this = this;
        $('.loading').show();
        this.classSessionsService.getPaged(this.searchModel)
            .subscribe(function (success) {
            _this.results = success;
            _this.loadTutorSubscriptionFeatures(success.data);
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
    ClassSessionsIndexComponent.prototype.ngOnInit = function () {
        this.searchModel.order = this.filter == 'upcoming' ? 'ASC' : 'DESC';
        this.searchModel.filter = this.filter;
        this.getClassSessions();
    };
    ;
    ClassSessionsIndexComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    ClassSessionsIndexComponent.prototype.getLink = function (item) {
        var el = document.createElement('textarea');
        el.value = this.url + '/lesson/' + item.classSessionId;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.toastr.success('The link for this lesson has been copied to your clipboard');
    };
    ;
    ClassSessionsIndexComponent.prototype.enterLesson = function (lesson) {
        if (!this.canViewLesson(lesson)) {
            this.toastr.error('Oops! Sorry, your subscription does not allow you to view completed lessons.');
            return;
        }
        if (lesson.sessionAttendeesCount > 0) {
            window.open(environment_1.environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
        }
        else {
            this.toastr.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
        }
    };
    ;
    ClassSessionsIndexComponent.prototype.canViewLesson = function (lesson) {
        if (!this.classSessionFeatures)
            return false;
        if (!lesson.complete && !lesson.ended)
            return true;
        var decision = (lesson.ownerId &&
            this.classSessionFeatures &&
            this.classSessionFeatures.tutorDashboard_View_CompletedLesson);
        return decision;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsIndexComponent.prototype, "filter", void 0);
    ClassSessionsIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-index',
            templateUrl: './class-sessions-index.component.html',
            styleUrls: ['./class-sessions-index.component.css']
        }),
        __metadata("design:paramtypes", [index_2.ClassSessionsService, ngx_toastr_1.ToastrService, index_2.ClassSessionFeaturesService])
    ], ClassSessionsIndexComponent);
    return ClassSessionsIndexComponent;
}());
exports.ClassSessionsIndexComponent = ClassSessionsIndexComponent;
//# sourceMappingURL=class-sessions-index.component.js.map