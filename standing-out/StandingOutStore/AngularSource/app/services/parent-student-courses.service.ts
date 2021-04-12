import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { Subject, PagedList, SearchOption, Company, StudyLevel } from '../models/index';

@Injectable()
export class ParentStudentCoursesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getTutorCompanysubjects(id:string): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getTutorCompanysubjects/' + id, { headers: this.serviceHelper.buildHeader() });
    }
 

    getTutorAvailabilities(id: string): Observable<Company[]> {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/ParentStudentCourse/GetTutorAvailabilities/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getSubScriptionFeatureByTutor(id: string): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getClassroomSubscriptionFeaturesByTutorId/'+ id);
    }

    getTutorCompanyLevelsBySubject(tid: string, sid: string): Observable<StudyLevel[]> {
        return this.http.get<StudyLevel[]>(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getTutorCompanyLevelsBySubject/' + tid + "/" + sid, { headers: this.serviceHelper.buildHeader() });
    }

    getPricePerPerson(model): Observable<Company> {
        return this.http.post<Company>(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getPricePerPerson', model, { headers: this.serviceHelper.buildHeader() });
    }

    updateCompanyCourse(models): Observable<any> {
        return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/ParentStudentCourse/updateCourse', models, { headers: this.serviceHelper.buildHeader() });
    }

    saveCompanyCourse(models): Observable<any> {
        debugger;
        return this.http.post<Company[]>(this.serviceHelper.baseApi + '/api/ParentStudentCourse', models, { headers: this.serviceHelper.buildHeader() });
    }

    getEditedCourse(id): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/ParentStudentCourse/getCouresClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    }

}