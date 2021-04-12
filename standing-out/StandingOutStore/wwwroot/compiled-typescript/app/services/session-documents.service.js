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
exports.SessionDocumentsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var SessionDocumentsService = /** @class */ (function () {
    function SessionDocumentsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    SessionDocumentsService.prototype.getMasterFiles = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionDocuments/getMasterFiles/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.getFiles = function (id, type) {
        return this.http.get(this.serviceHelper.baseApi + ("/api/sessionDocuments/" + type + "/files/") + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.delete = function (classSessionId, fileId) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/sessionDocuments/' + classSessionId + '/' + fileId, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.getAttendeesForFileUpload = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionDocuments/attendees/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.getGoogleFilePermission = function (classSessionId, fileId) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionDocuments/getGoogleFilePermission/' + classSessionId + '/' + fileId, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.updatePermissions = function (id, data) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/sessionDocuments/attendees/' + id, data, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService.prototype.sendRequestToLinkGoogleAccount = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionDocuments/sendRequestToLinkGoogleAccount/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionDocumentsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SessionDocumentsService);
    return SessionDocumentsService;
}());
exports.SessionDocumentsService = SessionDocumentsService;
//# sourceMappingURL=session-documents.service.js.map