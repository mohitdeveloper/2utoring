import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { UserProfile, TutorSubject } from '../models/index';

@Injectable()
export class TutorSubjectsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getByTutor(id: string): Observable<TutorSubject[]> {
        return this.http.get<TutorSubject[]>(this.serviceHelper.baseApi + '/api/tutorSubjects/getByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getByTutorForProfile(id: string): Observable<string[]> {
        return this.http.get<string[]>(this.serviceHelper.baseApi + '/api/tutorSubjects/getByTutorForProfile/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<TutorSubject> {
        return this.http.post<TutorSubject>(this.serviceHelper.baseApi + '/api/tutorSubjects', model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/tutorSubjects/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}