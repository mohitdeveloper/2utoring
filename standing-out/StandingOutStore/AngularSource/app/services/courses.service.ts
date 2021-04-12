import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { LessonCard, LessonSearch, PagedList, TutorCard, ClassSession, LessonTimetableDay, SafeguardingLessonOption } from '../models/index';
import { ClassSessionVideoRoomGroup } from '../models/class-session-video-room-group.model';

@Injectable()
export class CoursesService {
    imagesSequence: any = {};

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getPagedCards(searchModel: LessonSearch): Observable<PagedList<LessonCard>> {
        return this.http.post<PagedList<LessonCard>>(this.serviceHelper.baseApi + '/api/course/pagedCards', searchModel, { headers: this.serviceHelper.buildHeader() });
    }

    deleteLesson(leassonId: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/Course/deleteCourseClassSession/' + leassonId, { headers: this.serviceHelper.buildHeader() });
    }

    deleteCourse(courseId: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/Course/deleteCourse/' + courseId, { headers: this.serviceHelper.buildHeader() });
    }

    getCard(lessonId: string): Observable<LessonCard> {
        return this.http.get<LessonCard>(this.serviceHelper.baseApi + '/api/course/' + lessonId + '/card', { headers: this.serviceHelper.buildHeader() });
    }

    getCardSet(courseId: string): Observable<{ lesson: LessonCard, tutor: TutorCard }> {
        return this.http.get<{ lesson: LessonCard, tutor: TutorCard }>(this.serviceHelper.baseApi + '/api/course/' + courseId + '/cardSet', { headers: this.serviceHelper.buildHeader() });
    }

    getSafeguardingOptions(): Observable<SafeguardingLessonOption[]> {
        return this.http.get<SafeguardingLessonOption[]>(this.serviceHelper.baseApi + '/api/course/safeguardingOptions', { headers: this.serviceHelper.buildHeader() });
    }

    getTimetable(timeOffset: number, weekOffset: number): Observable<LessonTimetableDay[]> {
        return this.http.get<LessonTimetableDay[]>(this.serviceHelper.baseApi + '/api/course/timetable?timeOffset=' + timeOffset + '&weekOffset=' + weekOffset, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams): Observable<PagedList<ClassSession>> {
        return this.http.post<PagedList<ClassSession>>(this.serviceHelper.baseApi + '/api/course/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getEarnings(searchParams): Observable<PagedList<ClassSession>> {
        return this.http.post<PagedList<ClassSession>>(this.serviceHelper.baseApi + '/api/course/earnings', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<ClassSession> {
        return this.http.get<ClassSession>(this.serviceHelper.baseApi + '/api/course/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<ClassSession> {
        return this.http.post<ClassSession>(this.serviceHelper.baseApi + '/api/course', model, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<ClassSession> {
        return this.http.put<ClassSession>(this.serviceHelper.baseApi + '/api/course/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    getRooms(lessonId: string): Observable<ClassSessionVideoRoomGroup[]> {
        return this.http.get<ClassSessionVideoRoomGroup[]>(this.serviceHelper.baseApi + '/api/course/' + lessonId + '/rooms', { headers: this.serviceHelper.buildHeader() });
    }

    getEditedCourse(id):Observable<any>{
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getCouresClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    }
getPurchaseCouresData(id): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getPurchaseCouresData/' + id, { headers: this.serviceHelper.buildHeader() });

    }

    checkAndCreateGoogleDriverFolders(model): Observable<ClassSession> {
        return this.http.post<ClassSession>(this.serviceHelper.baseApi + '/api/course/checkAndCreateGoogleDriverFolders', model, { headers: this.serviceHelper.buildHeader() });
    }
        
    getTutorsBysubjectLevelId(model): Observable<any> {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/CompanyTutor/getCompanyTutorBySubject', model, { headers: this.serviceHelper.buildHeader() });
    }
    checkSlotAvailability(model): Observable<any> {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/TutorAvailability/checkSlotAvailability', model, { headers: this.serviceHelper.buildHeader() });
    } 
    getCourseDataById(id): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/getCouresInfo/' + id, { headers: this.serviceHelper.buildHeader() });
    }
    courseNotification(id): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/Course/courseNotification/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getUserType(): Observable<any> {
        return this.http.get(this.serviceHelper.baseApi + '/api/CompanyTutor/getUserType', { headers: this.serviceHelper.buildHeader() });
    }
    
    
    clearData() {
        localStorage.removeItem('courseId');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('stepMove');
        localStorage.removeItem('isFinished');
        localStorage.removeItem('origin');
    }
    setData(courseId) {
        localStorage.setItem('courseId', courseId);
        localStorage.setItem('currentStep', "1");
        localStorage.setItem('stepMove', "11");
        localStorage.setItem('isFinished', "Yes");
        localStorage.setItem('origin', 'Edit');
    }
}