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
exports.SessionGroupsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var SessionGroupsService = /** @class */ (function () {
    function SessionGroupsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    SessionGroupsService.prototype.getTutorCommand = function (classSessionId) {
        return this.http.get(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups/tutorcommand"), { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService.prototype.update = function (classSessionId, id, model) {
        return this.http.put(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups/") + id, model, { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService.prototype.create = function (classSessionId, model) {
        return this.http.post(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups"), model, { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService.prototype.delete = function (classSessionId, id) {
        return this.http.delete(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups/") + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService.prototype.removeFromGroup = function (classSessionId, id, data) {
        return this.http.put(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups/" + id + "/users"), data, { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService.prototype.moveToGroup = function (classSessionId, id, data) {
        return this.http.patch(this.serviceHelper.baseApi + ("/api/" + classSessionId + "/sessiongroups/" + id + "/users"), data, { headers: this.serviceHelper.buildHeader() });
    };
    SessionGroupsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SessionGroupsService);
    return SessionGroupsService;
}());
exports.SessionGroupsService = SessionGroupsService;
//# sourceMappingURL=session-groups.service.js.map