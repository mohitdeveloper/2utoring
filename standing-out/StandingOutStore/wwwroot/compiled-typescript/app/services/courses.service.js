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
exports.CoursesService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var CoursesService = /** @class */ (function () {
    function CoursesService(http) {
        this.http = http;
        this.imagesSequence = {};
        this.serviceHelper = new index_1.ServiceHelper();
    }
    CoursesService.prototype.getPagedCards = function (searchModel) {
        return this.http.post(this.serviceHelper.baseApi + '/api/course/pagedCards', searchModel, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.deleteLesson = function (leassonId) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/Course/deleteCourseClassSession/' + leassonId, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.deleteCourse = function (courseId) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/Course/deleteCourse/' + courseId, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getCard = function (lessonId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/' + lessonId + '/card', { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getCardSet = function (courseId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/' + courseId + '/cardSet', { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getSafeguardingOptions = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/safeguardingOptions', { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getTimetable = function (timeOffset, weekOffset) {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/timetable?timeOffset=' + timeOffset + '&weekOffset=' + weekOffset, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/course/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getEarnings = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/course/earnings', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.create = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/course', model, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.update = function (id, model) {
        return this.http.put(this.serviceHelper.baseApi + '/api/course/' + id, model, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getRooms = function (lessonId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/course/' + lessonId + '/rooms', { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getEditedCourse = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getCouresClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getPurchaseCouresData = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getPurchaseCouresData/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.checkAndCreateGoogleDriverFolders = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/course/checkAndCreateGoogleDriverFolders', model, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getTutorsBysubjectLevelId = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorBySubject', model, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.checkSlotAvailability = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/TutorAvailability/checkSlotAvailability', model, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getCourseDataById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getCouresInfo/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.courseNotification = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/courseNotification/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.getUserType = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getUserType', { headers: this.serviceHelper.buildHeader() });
    };
    CoursesService.prototype.clearData = function () {
        localStorage.removeItem('courseId');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('stepMove');
        localStorage.removeItem('isFinished');
        localStorage.removeItem('origin');
    };
    CoursesService.prototype.setData = function (courseId) {
        localStorage.setItem('courseId', courseId);
        localStorage.setItem('currentStep', "1");
        localStorage.setItem('stepMove', "11");
        localStorage.setItem('isFinished', "Yes");
        localStorage.setItem('origin', 'Edit');
    };
    CoursesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], CoursesService);
    return CoursesService;
}());
exports.CoursesService = CoursesService;
//# sourceMappingURL=courses.service.js.map