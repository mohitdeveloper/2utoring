import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { UserProfile, PagedList, UserDetail, UserGuardianDetail, MessageStatusUpdate } from '../models/index';

@Injectable()
export class UsersService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    get(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>(this.serviceHelper.baseApi + '/api/users', { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.serviceHelper.baseApi + '/api/users/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getStudentsPaged(searchParams): Observable<PagedList<UserProfile>> {
        return this.http.post<PagedList<UserProfile>>(this.serviceHelper.baseApi + '/api/users/students/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getAdminsPaged(searchParams): Observable<PagedList<UserProfile>> {
        return this.http.post<PagedList<UserProfile>>(this.serviceHelper.baseApi + '/api/users/admins/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<UserProfile> {
        return this.http.put<UserProfile>(this.serviceHelper.baseApi + '/api/users/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<UserProfile> {
        return this.http.post<UserProfile>(this.serviceHelper.baseApi + '/api/users', model, { headers: this.serviceHelper.buildHeader() });
    }

    getMy(): Observable<UserDetail> {
        return this.http.get<UserDetail>(this.serviceHelper.baseApi + '/api/users/my/student', { headers: this.serviceHelper.buildHeader() });
    };

    completeStudentSetup(model: UserDetail): Observable<UserDetail> {
        return this.http.patch<UserDetail>(this.serviceHelper.baseApi + '/api/users/completeSetup/student', model, { headers: this.serviceHelper.buildHeader() });
    };

    updateStudentSettings(model: UserDetail): Observable<UserDetail> {
        return this.http.patch<UserDetail>(this.serviceHelper.baseApi + '/api/users/settings/student', model, { headers: this.serviceHelper.buildHeader() });
    };

    getMyGuardian(): Observable<UserGuardianDetail> {
        return this.http.get<UserGuardianDetail>(this.serviceHelper.baseApi + '/api/users/my/guardian', { headers: this.serviceHelper.buildHeader() });
    };

    completeGuardianSetup(model: UserGuardianDetail): Observable<UserGuardianDetail> {
        return this.http.patch<UserGuardianDetail>(this.serviceHelper.baseApi + '/api/users/completeSetup/guardian', model, { headers: this.serviceHelper.buildHeader() });
    };

    updateGuardianSettings(model: UserDetail): Observable<UserGuardianDetail> {
        return this.http.patch<UserGuardianDetail>(this.serviceHelper.baseApi + '/api/users/settings/guardian', model, { headers: this.serviceHelper.buildHeader() });
    };

    changePassword(model: any): Observable<boolean>  {
        return this.http.post<boolean>(this.serviceHelper.baseApi + '/api/users/changePassword', model, { headers: this.serviceHelper.buildHeader() });
    };
    
    userAlert(): Observable<any> {
           return this.http.get<any>(this.serviceHelper.baseApi + '/api/users/userAlert', { headers: this.serviceHelper.buildHeader() });
    };
    messageStatusUpdate(model: MessageStatusUpdate): Observable<any> {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/users/messageStatusUpdate', model, { headers: this.serviceHelper.buildHeader() });
    };

    getPayoutResponseFromStripe(acid, stKey) { 
        return this.http.get<any>('https://api.stripe.com/v1/accounts/'+ acid, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + stKey} });
    }

    updateIdVerificationStautsForCompany(model) {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/company/updateIdVerificationStauts', model , { headers: this.serviceHelper.buildHeader() });
    }
    updateIdVerificationStautsForTutor(model) {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/tutors/updateIdVerificationStauts', model, { headers: this.serviceHelper.buildHeader() });
    }
}