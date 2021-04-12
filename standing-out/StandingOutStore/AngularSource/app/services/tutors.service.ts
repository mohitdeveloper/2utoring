import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { PagedTutor, Tutor, PagedList, AdminTutorDetails, TutorTableSearch, StripeCard, StripeSubscription, DbscheckApproval} from '../models/index';

@Injectable()
export class TutorsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getMy(): Observable<Tutor> {
        return this.http.get<Tutor>(this.serviceHelper.baseApi + '/api/tutors/getMy', { headers: this.serviceHelper.buildHeader() });
    }

    getCompanyTutorData(id): Observable<Tutor> {
        return this.http.get<Tutor>(this.serviceHelper.baseApi + '/api/tutors/getCompanyTutorData/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<Tutor> {
        return this.http.get<Tutor>(this.serviceHelper.baseApi + '/api/tutors/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    updateInitialRegisterStep(step: number): Observable<Tutor> {
        return this.http.get<Tutor>(this.serviceHelper.baseApi + '/api/tutors/updateInitialRegisterStep/' + step, { headers: this.serviceHelper.buildHeader() });
    }

    getBasicInfo() {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/tutors/getBasicInfo', { headers: this.serviceHelper.buildHeader() });
    }

    saveBasicInfo(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveBasicInfo', model, { headers: this.serviceHelper.buildHeader() });
    }

    savePayment(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/savePayment', model, { headers: this.serviceHelper.buildHeader() });
    }

    saveBankDetail(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveBankDetails', model, { headers: this.serviceHelper.buildHeader() });
    }

    saveDbsCheck(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveDbsCheck', model, { headers: this.serviceHelper.buildHeader() });
    }

    saveProfile(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfile', model, { headers: this.serviceHelper.buildHeader() });
    }

    saveProfileOne(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfileOne', model, { headers: this.serviceHelper.buildHeader() });
    }

    saveProfileTwo(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveProfileTwo', model, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams: TutorTableSearch): Observable<PagedList<PagedTutor>> {
        return this.http.post<PagedList<PagedTutor>>(this.serviceHelper.baseApi + '/api/tutors/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }    

    adminGetById(id: string): Observable<AdminTutorDetails> {
        return this.http.get<AdminTutorDetails>(this.serviceHelper.baseApi + '/api/tutors/getById/admin/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    approveProfile(id: string): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/approveProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    rejectProfile(id: string): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/rejectProfile/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    approveDBS(id: string): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/approveDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    rejectDBS(id: string): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + '/api/tutors/rejectDBS/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    markProfileAuthorizedMessageRead(id: string) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markProfileAuthorizedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    markDbsAdminApprovedMessageRead(id: string) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markDbsAdminApprovedMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    getDefaultPaymentMethodByTutor(id: string): Observable<StripeCard> {
        return this.http.get<StripeCard>(this.serviceHelper.baseApi + '/api/tutors/getDefaultPaymentMethodByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getSubscriptionByTutor(id: string): Observable<StripeSubscription> {
        return this.http.get<StripeSubscription>(this.serviceHelper.baseApi + '/api/tutors/getSubscriptionByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    updatePayment(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/updatePayment', model, { headers: this.serviceHelper.buildHeader() });
    }

    markLinkAccountMessageRead(id: string) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/tutors/markLinkAccountMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    saveAvailability(model) {	
        debugger;
        return this.http.post(this.serviceHelper.baseApi + '/api/tutorAvailability/multievent', model, { headers: this.serviceHelper.buildHeader() });	
    }

    getAvailability(id){
        return this.http.get(this.serviceHelper.baseApi + '/api/tutorAvailability/getByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    sendInvitesToTutors(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/inviteTutor', model, { headers: this.serviceHelper.buildHeader() });
    }

    deleteTutors(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/tutors/'+ id, { headers: this.serviceHelper.buildHeader() });
    }

    getSubScriptionFeatureByTutor(): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/ClassSessions/getClassroomSubscriptionFeaturesByTutorId');
    }   

    getSubscriptionFeatures(id: string): Observable<DbscheckApproval> {
        return this.http.get<DbscheckApproval>(this.serviceHelper.baseApi + '/api/subscriptionFeatures/getSubscriptionFeatures/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    updateTutorSubscription(model) {
        console.log(model);
        return this.http.post(this.serviceHelper.baseApi + '/api/tutors/updateTutorSubscriptioPlan', model, { headers: this.serviceHelper.buildHeader() });
    }

    getBookedSlot(id): Observable<any> {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/tutors/getBookedSlot/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    //tutor search
    getTutorSearch(model): Observable<any> {
        return this.http.post(this.serviceHelper.baseApi + '/api/Tutors/searchTutorOrCourse', model, { headers: this.serviceHelper.buildHeader() });
    }
// get Tutor Profile
    getTutorProfile(id: string): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/tutors/getTutorProfile/' + id, { headers: this.serviceHelper.buildHeader() });
    }
    sendMessageToTutor(model): Observable<any> {
        return this.http.post(this.serviceHelper.baseApi + '/api/commonpublic/sendMessage', model, { headers: this.serviceHelper.buildHeader() });
    }
   

}