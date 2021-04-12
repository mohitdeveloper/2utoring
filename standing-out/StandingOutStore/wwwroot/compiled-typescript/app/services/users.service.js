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
exports.UsersService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var UsersService = /** @class */ (function () {
    function UsersService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    UsersService.prototype.get = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/users', { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.getById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/users/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.getStudentsPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/users/students/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.getAdminsPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/users/admins/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.update = function (id, model) {
        return this.http.put(this.serviceHelper.baseApi + '/api/users/' + id, model, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.create = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/users', model, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.getMy = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/users/my/student', { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.completeStudentSetup = function (model) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/users/completeSetup/student', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.updateStudentSettings = function (model) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/users/settings/student', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.getMyGuardian = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/users/my/guardian', { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.completeGuardianSetup = function (model) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/users/completeSetup/guardian', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.updateGuardianSettings = function (model) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/users/settings/guardian', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.changePassword = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/users/changePassword', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.userAlert = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/users/userAlert', { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.messageStatusUpdate = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/users/messageStatusUpdate', model, { headers: this.serviceHelper.buildHeader() });
    };
    ;
    UsersService.prototype.getPayoutResponseFromStripe = function (acid, stKey) {
        return this.http.get('https://api.stripe.com/v1/accounts/' + acid, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + stKey } });
    };
    UsersService.prototype.updateIdVerificationStautsForCompany = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/updateIdVerificationStauts', model, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService.prototype.updateIdVerificationStautsForTutor = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/updateIdVerificationStauts', model, { headers: this.serviceHelper.buildHeader() });
    };
    UsersService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map