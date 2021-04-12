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
exports.TutorsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("../helpers/index");
var TutorsService = /** @class */ (function () {
    function TutorsService(http) {
        this.http = http;
        this.serviceHelper = new index_1.ServiceHelper();
    }
    TutorsService.prototype.getMy = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getMy', { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getCompanyTutorData = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getCompanyTutorData/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.updateInitialRegisterStep = function (step) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/updateInitialRegisterStep/' + step, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getBasicInfo = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getBasicInfo', { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveBasicInfo = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveBasicInfo', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.savePayment = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/savePayment', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveBankDetail = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveBankDetails', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveDbsCheck = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveDbsCheck', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveProfile = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfile', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveProfileOne = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfileOne', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveProfileTwo = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfileTwo', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getPaged = function (searchParams) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.adminGetById = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getById/admin/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.approveProfile = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/approveProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.rejectProfile = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/rejectProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.approveDBS = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/approveDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.rejectDBS = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/rejectDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.markProfileAuthorizedMessageRead = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markProfileAuthorizedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.markDbsAdminApprovedMessageRead = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markDbsAdminApprovedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getDefaultPaymentMethodByTutor = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getDefaultPaymentMethodByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getSubscriptionByTutor = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getSubscriptionByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.updatePayment = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/updatePayment', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.markLinkAccountMessageRead = function (id) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markLinkAccountMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.saveAvailability = function (model) {
        debugger;
        return this.http.post(this.serviceHelper.baseApi + '/api/tutorAvailability/multievent', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getAvailability = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutorAvailability/getByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.sendInvitesToTutors = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/inviteTutor', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.deleteTutors = function (id) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/tutors/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getSubScriptionFeatureByTutor = function () {
        return this.http.get(this.serviceHelper.baseApi + '/api/ClassSessions/getClassroomSubscriptionFeaturesByTutorId');
    };
    TutorsService.prototype.getSubscriptionFeatures = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/subscriptionFeatures/getSubscriptionFeatures/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.updateTutorSubscription = function (model) {
        console.log(model);
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/updateTutorSubscriptioPlan', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.getBookedSlot = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getBookedSlot/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    //tutor search
    TutorsService.prototype.getTutorSearch = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/Tutors/searchTutorOrCourse', model, { headers: this.serviceHelper.buildHeader() });
    };
    // get Tutor Profile
    TutorsService.prototype.getTutorProfile = function (id) {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getTutorProfile/' + id, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService.prototype.sendMessageToTutor = function (model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/commonpublic/sendMessage', model, { headers: this.serviceHelper.buildHeader() });
    };
    TutorsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], TutorsService);
    return TutorsService;
}());
exports.TutorsService = TutorsService;
//# sourceMappingURL=tutors.service.js.map