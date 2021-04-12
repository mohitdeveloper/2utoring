import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { SubjectStudyLevelSetup, SubjectStudyLevelSearchModel, PagedList } from '../models/index';

@Injectable()
export class SubjectStudyLevelSetupService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getPaged(searchParams: SubjectStudyLevelSearchModel): Observable<PagedList<SubjectStudyLevelSetup>> {
        console.log("searchParams:", searchParams)
        return this.http.post<PagedList<SubjectStudyLevelSetup>>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/paged/', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    //update(id, model): Observable<SubjectStudyLevelSetup> {
    //    return this.http.put<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/' + id, model, { headers: this.serviceHelper.buildHeader() });
    //}

    //create(model): Observable<SubjectStudyLevelSetup> {
    //    return this.http.post<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup', model, { headers: this.serviceHelper.buildHeader() });
    //}
    create(model): Observable<SubjectStudyLevelSetup> {
        return this.http.post<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup', model, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id): Observable<SubjectStudyLevelSetup> {
        return this.http.get<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    update(model): Observable<SubjectStudyLevelSetup> { 
        return this.http.post<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/update', model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id): Observable<SubjectStudyLevelSetup> {
        return this.http.delete<SubjectStudyLevelSetup>(this.serviceHelper.baseApi + '/api/subjectStudyLevelSetup/'+ id, { headers: this.serviceHelper.buildHeader() });
    }
    getUserType() {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/CompanyTutor/getUserType', { headers: this.serviceHelper.buildHeader() });
    }
}