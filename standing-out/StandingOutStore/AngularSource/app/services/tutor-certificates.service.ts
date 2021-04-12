import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { UserProfile, TutorCertificate } from '../models/index';

@Injectable()
export class TutorCertificatesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getByTutor(id: string): Observable<TutorCertificate[]> {
        return this.http.get<TutorCertificate[]>(this.serviceHelper.baseApi + '/api/tutorCertificates/getByTutor/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/tutorCertificates/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}