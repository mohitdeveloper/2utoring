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
exports.CompanyService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var CompanyService = /** @class */ (function () {
    function CompanyService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    CompanyService.prototype.getMy = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getMy', { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getTutorsDetails = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorDetail/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getTeamData = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getTeamData', { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getSubjectCategory = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/SubjectCategories/optionsFiltered/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.saveProfileOne = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfileOne', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getPricePerPerson = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/getPricePerPerson', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getTutorByCompany = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorByCompany/', { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getAllCompanyTutors = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutors', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getAvailableCompanyTutors = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/TutorAvailability/GetCompanyTutorByAvailability', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.addCompanyMember = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/addCompanyMember', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.deleteCompanyMember = function (companyMbrId) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/company/deleteCompanyMember/' + companyMbrId, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.saveProfileThree = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfileThree', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getTutorAvailabilities = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/GetTutorAvailabilities/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.saveCompanyCourse = function (models) {
        return this.http.post(this.serviceHelper.baseApi + '/api/Course', models, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.saveTuotorCourse = function (models) {
        return this.http.post(this.serviceHelper.baseApi + '/api/Course/CreateCourse', models, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.updateCompanyCourse = function (models) {
        return this.http.post(this.serviceHelper.baseApi + '/api/Course/updateCourse', models, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getBasicInfo = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getBasicInfo', { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.updateInitialRegisterStep = function (step) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/updateInitialRegisterStep/' + step, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.saveCompanyBasicInfo = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveBasicInfo', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.savePayment = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/savePayment', model, { headers: this.serviceHelper.buildHeader() });
    };
    //saveDbsCheck(model) {
    //    return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveDbsCheck', model, { headers: this.serviceHelper.buildHeader() });
    //}
    CompanyService.prototype.saveProfile = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfile', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getPagedBankDetails = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/pagedBankDetails', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.adminGetById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getById/admin/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    //approveProfile(id: string): Observable<void> {
    //    return this.http.patch<void>(this.serviceHelper.baseApi + '/api/company/approveProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    //rejectProfile(id: string): Observable<void> {
    //    return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/rejectProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    //approveDBS(id: string): Observable<void> {
    //    return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/approveDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    //rejectDBS(id: string): Observable<void> {
    //    return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/rejectDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    //markProfileAuthorizedMessageRead(id: string) {
    //    return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markProfileAuthorizedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    //markDbsAdminApprovedMessageRead(id: string) {
    //    return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markDbsAdminApprovedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    //}
    CompanyService.prototype.getDefaultPaymentMethodByCompany = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getDefaultPaymentMethodByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getSubscriptionByCompany = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getSubscriptionByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.updatePayment = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/updatePayment', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.markLinkAccountMessageRead = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/company/markLinkAccountMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getSubScriptionFeature = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getSubscriptionFeaturesByCompanyId/');
    };
    CompanyService.prototype.checkCompanyUsersHasDBS = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/checkCompanyUsersHasDBS');
    };
    CompanyService.prototype.getCompanyTutorsSubject = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorsSubject');
    };
    CompanyService.prototype.getCompanyTutorsLevelBySubject = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorsLevelBySubject/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getTutorByAvailability = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorByAvailability', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.getCompanyDataById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/company/getAboutCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService.prototype.sendMessageToAgency = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/commonpublic/sendMessage', model, { headers: this.serviceHelper.buildHeader() });
    };
    CompanyService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], CompanyService);
    return CompanyService;
}());
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map