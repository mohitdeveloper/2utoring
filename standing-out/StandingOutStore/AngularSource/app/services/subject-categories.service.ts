import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { GuidOptionExtended, SubjectCategory, PagedList } from '../models/index';

@Injectable()
export class SubjectCategoriesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getOptions(): Observable<GuidOptionExtended[]> {
        return this.http.get<GuidOptionExtended[]>(this.serviceHelper.baseApi + '/api/subjectCategories/options', { headers: this.serviceHelper.buildHeader() });
    }

    getOptionsFiltered(id: string): Observable<GuidOptionExtended[]> {
        return this.http.get<GuidOptionExtended[]>(this.serviceHelper.baseApi + '/api/subjectCategories/optionsFiltered/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    get(): Observable<SubjectCategory[]> {
        return this.http.get<SubjectCategory[]>(this.serviceHelper.baseApi + '/api/subjectCategories', { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<SubjectCategory> {
        return this.http.get<SubjectCategory>(this.serviceHelper.baseApi + '/api/subjectCategories/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams): Observable<PagedList<SubjectCategory>> {
        return this.http.post<PagedList<SubjectCategory>>(this.serviceHelper.baseApi + '/api/subjectCategories/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<SubjectCategory> {
        return this.http.put<SubjectCategory>(this.serviceHelper.baseApi + '/api/subjectCategories/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<SubjectCategory> {
        return this.http.post<SubjectCategory>(this.serviceHelper.baseApi + '/api/subjectCategories', model, { headers: this.serviceHelper.buildHeader() });
    }
}