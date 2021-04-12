import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { PagedList, SessionAttendee } from '../models/index';

@Injectable()
export class SessionAttendeesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();      

    getUniqueByOwner(id: string, cid: string): Observable<SessionAttendee[]> {
        return this.http.get<SessionAttendee[]>(this.serviceHelper.baseApi + '/api/sessionAttendees/getUniqueByOwner/' + id + '/'+cid, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(searchParams, classSessionId): Observable<PagedList<SessionAttendee>> {
        return this.http.post<PagedList<SessionAttendee>>(this.serviceHelper.baseApi + '/api/sessionAttendees/paged/' + classSessionId, searchParams, { headers: this.serviceHelper.buildHeader() });
    }

    remove(classSessionId: string, id: string) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/remove/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    undoRemove(classSessionId: string, id: string) {
        return this.http.get(this.serviceHelper.baseApi + '/api/sessionAttendees/undoRemove/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    refund(classSessionId: string, id: string): Observable<boolean> {
        return this.http.get<boolean>(this.serviceHelper.baseApi + '/api/sessionAttendees/refund/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    refundStudent(classSessionId: string, id: string): Observable<boolean> {
        return this.http.get<boolean>(this.serviceHelper.baseApi + '/api/sessionAttendees/refundStudent/' + classSessionId + '/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}