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
exports.SessionAttendeesService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var SessionAttendeesService = /** @class */ (function () {
    function SessionAttendeesService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    SessionAttendeesService.prototype.getUniqueByOwner = function (id, cid) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/getUniqueByOwner/' + id + '/' + cid, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService.prototype.getPaged = function (searchParams, classSessionId) {
        return this.http.post(this.serviceHelper.baseApi + '/api/sessionAttendees/paged/' + classSessionId, searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService.prototype.remove = function (classSessionId, id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/remove/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService.prototype.undoRemove = function (classSessionId, id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/undoRemove/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService.prototype.refund = function (classSessionId, id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/refund/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService.prototype.refundStudent = function (classSessionId, id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/refundStudent/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionAttendeesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SessionAttendeesService);
    return SessionAttendeesService;
}());
exports.SessionAttendeesService = SessionAttendeesService;
//# sourceMappingURL=session-attendees.service.js.map