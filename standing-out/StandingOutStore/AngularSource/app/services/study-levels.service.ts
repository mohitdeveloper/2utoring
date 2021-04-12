import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { GuidOption, PagedList, StudyLevel, SearchOption } from '../models/index';

@Injectable()
export class StudyLevelsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getOptions(): Observable<SearchOption[]> {
        return this.http.get<SearchOption[]>(this.serviceHelper.baseApi + '/api/studyLevels/options', { headers: this.serviceHelper.buildHeader() });
    }

    get(): Observable<StudyLevel[]> {
        return this.http.get<StudyLevel[]>(this.serviceHelper.baseApi + '/api/studyLevels', { headers: this.serviceHelper.buildHeader() });
    }

    getTutorCompanyLevels(): Observable<StudyLevel[]> {
        return this.http.get<StudyLevel[]>(this.serviceHelper.baseApi + '/api/studyLevels/getTutorCompanyLevels', { headers: this.serviceHelper.buildHeader() });
    }

    getTutorCompanyLevelsBySubject(id: string): Observable<StudyLevel[]> {
        return this.http.get<StudyLevel[]>(this.serviceHelper.baseApi + '/api/studyLevels/getTutorCompanyLevelsBySubject/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<StudyLevel> {
        return this.http.get<StudyLevel>(this.serviceHelper.baseApi + '/api/studyLevels/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams): Observable<PagedList<StudyLevel>> {
        return this.http.post<PagedList<StudyLevel>>(this.serviceHelper.baseApi + '/api/studyLevels/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<StudyLevel> {
        return this.http.put<StudyLevel>(this.serviceHelper.baseApi + '/api/studyLevels/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<StudyLevel> {
        return this.http.post<StudyLevel>(this.serviceHelper.baseApi + '/api/studyLevels', model, { headers: this.serviceHelper.buildHeader() });
    }
}