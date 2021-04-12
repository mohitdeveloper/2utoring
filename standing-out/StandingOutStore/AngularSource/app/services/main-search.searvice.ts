import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { PagedTutor, Tutor, Company, PagedList, TutorBankDetailsItem, AdminTutorDetails, TutorTableSearch, TableSearch, StripeCard, StripeSubscription, StudyLevel } from '../models/index';

 
@Injectable()
export class MainSearchService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getTutorsResult(searchParams): Observable<PagedList<any>> {
        return this.http.post<PagedList<any>>(this.serviceHelper.baseApi + '/api/Tutors/searchTutorOrCourse', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getAllTutorSubject() {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/Tutors/getAllTutorSubject', { headers: this.serviceHelper.buildHeader() });
    }
    getAllSubjectLevelBySubjectId(id: string) {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/Tutors/getAllSubjectLevelBySubjectId/'+id, { headers: this.serviceHelper.buildHeader() });
    }

    
}