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
exports.ParentStudentCoursesService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var ParentStudentCoursesService = /** @class */ (function () {
    function ParentStudentCoursesService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    ParentStudentCoursesService.prototype.getTutorCompanysubjects = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getTutorCompanysubjects/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.getTutorAvailabilities = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/GetTutorAvailabilities/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.getSubScriptionFeatureByTutor = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getClassroomSubscriptionFeaturesByTutorId/' + id);
    };
    ParentStudentCoursesService.prototype.getTutorCompanyLevelsBySubject = function (tid, sid) {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getTutorCompanyLevelsBySubject/' + tid + "/" + sid, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.getPricePerPerson = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getPricePerPerson', model, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.updateCompanyCourse = function (models) {
        return this.http.post(this.serviceHelper.baseApi + '/api/ParentStudentCourse/updateCourse', models, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.saveCompanyCourse = function (models) {
        debugger;
        return this.http.post(this.serviceHelper.baseApi + '/api/ParentStudentCourse', models, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService.prototype.getEditedCourse = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getCouresClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    ParentStudentCoursesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ParentStudentCoursesService);
    return ParentStudentCoursesService;
}());
exports.ParentStudentCoursesService = ParentStudentCoursesService;
//# sourceMappingURL=parent-student-courses.service.js.map