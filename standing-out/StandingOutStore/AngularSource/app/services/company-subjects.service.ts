import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { UserProfile, CompanySubject } from '../models/index';

@Injectable()
export class CompanySubjectsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    getByCompany(id: string): Observable<CompanySubject[]> {
        return this.http.get<CompanySubject[]>(this.serviceHelper.baseApi + '/api/companySubjects/getByCompany/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getByCompanyForProfile(id: string): Observable<string[]> {
        return this.http.get<string[]>(this.serviceHelper.baseApi + '/api/companySubjects/getByCompanyForProfile/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<CompanySubject> {
        return this.http.post<CompanySubject>(this.serviceHelper.baseApi + '/api/companySubjects', model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/CompanySubjects/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}