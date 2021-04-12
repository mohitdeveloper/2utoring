import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { UserProfile, TutorQualification } from '../models/index';

@Injectable()
export class TutorQualificationsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getByTutor(id: string): Observable<TutorQualification[]> {
        return this.http.get<TutorQualification[]>(this.serviceHelper.baseApi + '/api/tutorQualifications/getByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<TutorQualification> {
        return this.http.post<TutorQualification>(this.serviceHelper.baseApi + '/api/tutorQualifications', model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/tutorQualifications/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}