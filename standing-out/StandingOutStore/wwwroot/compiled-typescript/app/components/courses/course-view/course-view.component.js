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
exports.CourseViewComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var index_1 = require("../../../services/index");
var CourseViewComponent = /** @class */ (function () {
    function CourseViewComponent(coursesService, location) {
        this.coursesService = coursesService;
        this.location = location;
        this.title = title;
        this.courseId = courseId;
        this.canUserBuy = canUserBuy;
        this.isLoggedIn = isLoggedIn;
        this.isGuardian = isGuardian;
    }
    CourseViewComponent.prototype.getLessonAndTutorCard = function () {
        var _this = this;
        this.coursesService.getCardSet(this.courseId)
            .subscribe(function (success) {
            $('.loading').hide();
            _this.result = success;
        }, function (error) {
            console.log(error);
            $('.loading').hide();
        });
    };
    ;
    CourseViewComponent.prototype.ngOnInit = function () {
        $('.loading').show();
        this.getLessonAndTutorCard();
    };
    ;
    CourseViewComponent.prototype.back = function () {
        this.location.back();
    };
    ;
    CourseViewComponent = __decorate([
        core_1.Component({
            selector: 'app-course-view',
            templateUrl: './course-view.component.html'
        }),
        __metadata("design:paramtypes", [index_1.CoursesService, common_1.Location])
    ], CourseViewComponent);
    return CourseViewComponent;
}());
exports.CourseViewComponent = CourseViewComponent;
//# sourceMappingURL=course-view.component.js.map