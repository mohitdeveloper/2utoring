import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { LessonCard, LessonSearch, PagedList, TutorCard, ClassSession, LessonTimetableDay, SafeguardingLessonOption } from '../models/index';
import { ClassSessionVideoRoomGroup } from '../models/class-session-video-room-group.model';

@Injectable()
export class ClassSessionsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getPagedCards(searchModel: LessonSearch): Observable<PagedList<LessonCard>> {
        return this.http.post<PagedList<LessonCard>>(this.serviceHelper.baseApi + '/api/classSessions/pagedCards', searchModel, { headers: this.serviceHelper.buildHeader() });
    }

    getCard(lessonId: string): Observable<LessonCard> {
        return this.http.get<LessonCard>(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/card', { headers: this.serviceHelper.buildHeader() });
    }

    getCardSet(lessonId: string): Observable<{ lesson: LessonCard, tutor: TutorCard }> {
        return this.http.get<{ lesson: LessonCard, tutor: TutorCard }>(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/cardSet', { headers: this.serviceHelper.buildHeader() });
    }

    getSafeguardingOptions(): Observable<SafeguardingLessonOption[]> {
        return this.http.get<SafeguardingLessonOption[]>(this.serviceHelper.baseApi + '/api/classSessions/safeguardingOptions', { headers: this.serviceHelper.buildHeader() });
    }

    getTimetable(timeOffset: number, weekOffset: number): Observable<LessonTimetableDay[]> {
        return this.http.get<LessonTimetableDay[]>(this.serviceHelper.baseApi + '/api/classSessions/timetable?timeOffset=' + timeOffset + '&weekOffset=' + weekOffset, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams): Observable<PagedList<ClassSession>> {
        return this.http.post<PagedList<ClassSession>>(this.serviceHelper.baseApi + '/api/classSessions/paged', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getEarnings(searchParams): Observable<PagedList<ClassSession>> {
        return this.http.post<PagedList<ClassSession>>(this.serviceHelper.baseApi + '/api/classSessions/earnings', searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<ClassSession> {
        return this.http.get<ClassSession>(this.serviceHelper.baseApi + '/api/classSessions/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<ClassSession> {
        return this.http.post<ClassSession>(this.serviceHelper.baseApi + '/api/classSessions', model, { headers: this.serviceHelper.buildHeader() });
    }

    update(id, model): Observable<ClassSession> {
        return this.http.put<ClassSession>(this.serviceHelper.baseApi + '/api/classSessions/' + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    getRooms(lessonId: string): Observable<ClassSessionVideoRoomGroup[]> {
        return this.http.get<ClassSessionVideoRoomGroup[]>(this.serviceHelper.baseApi + '/api/classSessions/' + lessonId + '/rooms', { headers: this.serviceHelper.buildHeader() });
    }
    cancelLesson(id): Observable<any> {
        return this.http.get<any>(this.serviceHelper.baseApi + '/api/classSessions/cancelLesson/' + id , { headers: this.serviceHelper.buildHeader() });
    }

}