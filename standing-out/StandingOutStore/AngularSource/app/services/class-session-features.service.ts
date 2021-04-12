import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { ClassSessionFeatures } from '../models/class-session-features';

@Injectable()
export class ClassSessionFeaturesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getClassroomSubscriptionFeaturesByClassSessionId(lessonId: string): Observable<ClassSessionFeatures> {
        return this.http.get<ClassSessionFeatures>(this.serviceHelper.baseApi + '/api/classSessions/getClassroomSubscriptionFeaturesByClassSessionId/' + lessonId, { headers: this.serviceHelper.buildHeader() });
    }
    
    // This checks if Tutor or CompanyTutor and gives features accordingly.
    getClassroomSubscriptionFeaturesByTutorId(tutorId: string): Observable<ClassSessionFeatures> {
        return this.http.get<ClassSessionFeatures>(this.serviceHelper.baseApi + '/api/classSessions/getClassroomSubscriptionFeaturesByTutorId/' + tutorId, { headers: this.serviceHelper.buildHeader() });
    }
}