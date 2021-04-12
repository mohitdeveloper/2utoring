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
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var SessionInviteService = /** @class */ (function () {
    function SessionInviteService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    SessionInviteService.prototype.getByClassSession = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionInvites/getByClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionInviteService.prototype.create = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/sessionInvites', model, { headers: this.serviceHelper.buildHeader() });
    };
    SessionInviteService.prototype.createBulk = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/sessionInvites/createBulk', model, { headers: this.serviceHelper.buildHeader() });
    };
    SessionInviteService.prototype.delete = function (id) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/sessionInvites/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    SessionInviteService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SessionInviteService);
    return SessionInviteService;
}());
exports.SessionInviteService = SessionInviteService;
//# sourceMappingURL=session-invite.service.js.map