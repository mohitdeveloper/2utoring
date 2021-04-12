import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { Subject, PagedList, SearchOption } from '../models/index';

@Injectable()
export class SubjectsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getOptions(): Observable<SearchOption[]> {
        return this.http.get<SearchOption[]>(this.serviceHelper.baseApi + '/api/subjects/options', { headers: this.serviceHelper.buildHeader() });
    }

    get(): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.serviceHelper.baseApi + '/api/subjects', { headers: this.serviceHelper.buildHeader() });
    }

    getTutorCompanysubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.serviceHelper.baseApi + '/api/subjects/getTutorCompanysubjects', { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<Subject> {
        return this.http.get<Subject>(this.serviceHelper.baseApi + '/api/subjects/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams): Observable<PagedList<Subject>> {
        return this.http.post<PagedList<Subject>>(this.serviceHelper.baseApi + '/api/subjects/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<Subject> {
        return this.http.put<Subject>(this.serviceHelper.baseApi + '/api/subjects/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<Subject> {
        return this.http.post<Subject>(this.serviceHelper.baseApi + '/api/subjects', model, { headers: this.serviceHelper.buildHeader() });
    }
}