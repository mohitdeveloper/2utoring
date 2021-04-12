import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { PagedTutor, Tutor, Company, PagedList, TutorBankDetailsItem, AdminTutorDetails, TutorTableSearch, TableSearch, StripeCard, StripeSubscription, StudyLevel } from '../models/index';
import { TeamMeetData } from '../models/team-meet-data';

 
@Injectable()
export class CompanyService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getMy(): Observable<Company> {
        return this.http.get<Company>(this.serviceHelper.baseApi + '/api/company/getMy', { headers: this.serviceHelper.buildHeader() });
    }

    getTutorsDetails(id: string): Observable<Company> {
        return this.http.get<Company>(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorDetail/' + id, { headers: this.serviceHelper.buildHeader() });
    }
    
    

    getTeamData(): Observable<TeamMeetData[]> {
        return this.http.get<TeamMeetData[]>(this.serviceHelper.baseApi + '/api/company/getTeamData', { headers: this.serviceHelper.buildHeader() });
    }
    
    getSubjectCategory(id: string): Observable<Company[]> {
        return this.http.get<Company[]>(this.serviceHelper.baseApi + '/api/SubjectCategories/optionsFiltered/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<Company> {
        return this.http.get<Company>(this.serviceHelper.baseApi + '/api/company/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    saveProfileOne(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfileOne', model, { headers: this.serviceHelper.buildHeader() });
    }
    
    getPricePerPerson(model): Observable<Company> {
        return this.http.post<Company>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/getPricePerPerson', model, { headers: this.serviceHelper.buildHeader() });
    }
    getTutorByCompany(): Observable<Company[]> {
        return this.http.get<Company[]>(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorByCompany/', { headers: this.serviceHelper.buildHeader() });
    }

    getAllCompanyTutors(model): Observable<Company[]> {
        return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutors', model, { headers: this.serviceHelper.buildHeader() });
    }
    
    getAvailableCompanyTutors(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/TutorAvailability/GetCompanyTutorByAvailability', model, { headers: this.serviceHelper.buildHeader() });
    }

    addCompanyMember(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/addCompanyMember', model, { headers: this.serviceHelper.buildHeader() });
    }

    deleteCompanyMember(companyMbrId: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/company/deleteCompanyMember/' + companyMbrId, { headers: this.serviceHelper.buildHeader() });
    }

    saveProfileThree(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfileThree', model, { headers: this.serviceHelper.buildHeader() });
    }    
	getTutorAvailabilities(id: string): Observable<Company[]> {
        return this.http.get<Company[]>(this.serviceHelper.baseApi + '/api/tutors/GetTutorAvailabilities/' + id, { headers: this.serviceHelper.buildHeader() });
    }
    saveCompanyCourse(models): Observable<any> { 
    return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/Course', models, { headers: this.serviceHelper.buildHeader() });
    }

    saveTuotorCourse(models): Observable<Company[]> {
        return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/Course/CreateCourse', models, { headers: this.serviceHelper.buildHeader() });
    }

    updateCompanyCourse(models): Observable<any> { 
        return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/Course/updateCourse', models, { headers: this.serviceHelper.buildHeader() });
    }
getBasicInfo() {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/company/getBasicInfo', { headers: this.serviceHelper.buildHeader() });
    }

    updateInitialRegisterStep(step: number): Observable<Company> {
        return this.http.get<Company>(this.serviceHelper.baseApi + '/api/company/updateInitialRegisterStep/' + step, { headers: this.serviceHelper.buildHeader() });
    }

    saveCompanyBasicInfo(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveBasicInfo', model, { headers: this.serviceHelper.buildHeader() });
    }

    savePayment(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/savePayment', model, { headers: this.serviceHelper.buildHeader() });
    }

    //saveDbsCheck(model) {
    //    return this.http.post(this.serviceHelper.baseApi + '/api/tutors/saveDbsCheck', model, { headers: this.serviceHelper.buildHeader() });
    //}

    saveProfile(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/saveProfile', model, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams: TutorTableSearch): Observable<PagedList<PagedTutor>> {
        return this.http.post<PagedList<PagedTutor>>(this.serviceHelper.baseApi + '/api/company/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }    

    getPagedBankDetails(searchParams: TableSearch): Observable<PagedList<TutorBankDetailsItem>> {
        return this.http.post<PagedList<TutorBankDetailsItem>>(this.serviceHelper.baseApi + '/api/company/pagedBankDetails', searchParams, { headers: this.serviceHelper.buildHeader() });
    }    

    adminGetById(id: string): Observable<AdminTutorDetails> {
        return this.http.get<AdminTutorDetails>(this.serviceHelper.baseApi + '/api/company/getById/admin/' + id, { headers: this.serviceHelper.buildHeader() });
    }

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

    getDefaultPaymentMethodByCompany(id: string): Observable<StripeCard> {
        return this.http.get<StripeCard>(this.serviceHelper.baseApi + '/api/company/getDefaultPaymentMethodByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getSubscriptionByCompany(id: string): Observable<StripeSubscription> {
        return this.http.get<StripeSubscription>(this.serviceHelper.baseApi + '/api/company/getSubscriptionByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    updatePayment(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/company/updatePayment', model, { headers: this.serviceHelper.buildHeader() });
    }

    markLinkAccountMessageRead(id: string) {
        return this.http.patch(this.serviceHelper.baseApi + '/api/company/markLinkAccountMessageRead/' + id, null, { headers: this.serviceHelper.buildHeader() });
    }

    getSubScriptionFeature():Observable<any>{
        return this.http.get(this.serviceHelper.baseApi +'/api/company/getSubscriptionFeaturesByCompanyId/');
    }
    checkCompanyUsersHasDBS(): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/checkCompanyUsersHasDBS');
    }
    getCompanyTutorsSubject(): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorsSubject');
    }
    getCompanyTutorsLevelBySubject(id: string): Observable<StudyLevel[]> {
        return this.http.get<StudyLevel[]>(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorsLevelBySubject/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getTutorByAvailability(model): Observable<any> {
        return this.http.post(this.serviceHelper.baseApi + '/api/CompanyTutor/getTutorByAvailability', model, { headers: this.serviceHelper.buildHeader() });
    }
    getCompanyDataById(id: string): Observable<Company> {
        return this.http.get<Company>(this.serviceHelper.baseApi + '/api/company/getAboutCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    }
    sendMessageToAgency(model): Observable<any> {
        return this.http.post(this.serviceHelper.baseApi + '/api/commonpublic/sendMessage', model, { headers: this.serviceHelper.buildHeader() });
    }
    
}