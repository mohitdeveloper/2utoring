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
exports.ClassSessionsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var ClassSessionsService = /** @class */ (function () {
    function ClassSessionsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    ClassSessionsService.prototype.getPagedCards = function (searchModel) {
        return this.http.post(this.serviceHelper.baseApi + '/api/classSessions/pagedCards', searchModel, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getCard = function (lessonId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/card', { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getCardSet = function (lessonId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/cardSet', { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getSafeguardingOptions = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/safeguardingOptions', { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getTimetable = function (timeOffset, weekOffset) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/timetable?timeOffset=' + timeOffset + '&weekOffset=' + weekOffset, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/classSessions/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getEarnings = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/classSessions/earnings', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.create = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/classSessions', model, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.update = function (id, model) {
        return this.http.put(this.serviceHelper.baseApi + '/api/classSessions/' + id, model, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.getRooms = function (lessonId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/rooms', { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService.prototype.cancelLesson = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/classSessions/cancelLesson/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    ClassSessionsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ClassSessionsService);
    return ClassSessionsService;
}());
exports.ClassSessionsService = ClassSessionsService;
//# sourceMappingURL=class-sessions.service.js.map