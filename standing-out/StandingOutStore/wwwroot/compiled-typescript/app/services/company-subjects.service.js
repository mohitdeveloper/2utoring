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
exports.CompanySubjectsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var CompanySubjectsService = /** @class */ (function () {
    function CompanySubjectsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    CompanySubjectsService.prototype.getByCompany = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/companySubjects/getByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanySubjectsService.prototype.getByCompanyForProfile = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/companySubjects/getByCompanyForProfile/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanySubjectsService.prototype.create = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/companySubjects', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanySubjectsService.prototype.delete = function (id) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/CompanySubjects/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanySubjectsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], CompanySubjectsService);
    return CompanySubjectsService;
}());
exports.CompanySubjectsService = CompanySubjectsService;
//# sourceMappingURL=company-subjects.service.js.map