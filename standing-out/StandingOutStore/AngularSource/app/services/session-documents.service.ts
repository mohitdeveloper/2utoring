import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { SessionDocument, SessionAttendeeFileUploader } from '../models/index';

@Injectable()
export class SessionDocumentsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();      

    getMasterFiles(id: string): Observable<SessionDocument[]> {
        return this.http.get<SessionDocument[]>(this.serviceHelper.baseApi + '/api/sessionDocuments/getMasterFiles/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getFiles(id: string, type: string): Observable<SessionDocument[]> {
        return this.http.get<SessionDocument[]>(this.serviceHelper.baseApi + `/api/sessionDocuments/${type}/files/` + id, { headers: this.serviceHelper.buildHeader() });
    }

    delete(classSessionId, fileId: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/sessionDocuments/' + classSessionId + '/' + fileId, { headers: this.serviceHelper.buildHeader() });
    }

    getAttendeesForFileUpload(id: string): Observable<SessionAttendeeFileUploader[]> {
        return this.http.get<SessionAttendeeFileUploader[]>(this.serviceHelper.baseApi + '/api/sessionDocuments/attendees/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getGoogleFilePermission(classSessionId: string, fileId: string): Observable<SessionAttendeeFileUploader[]> {
        return this.http.get<SessionAttendeeFileUploader[]>(this.serviceHelper.baseApi + '/api/sessionDocuments/getGoogleFilePermission/' + classSessionId + '/' + fileId, { headers: this.serviceHelper.buildHeader() });
    }



    updatePermissions(id: string, data: any): Observable<void> {
        return this.http.patch<void>(this.serviceHelper.baseApi + '/api/sessionDocuments/attendees/' + id, data, { headers: this.serviceHelper.buildHeader() });
    }
    sendRequestToLinkGoogleAccount(id: string): Observable<SessionAttendeeFileUploader[]> {
        return this.http.get<SessionAttendeeFileUploader[]>(this.serviceHelper.baseApi + '/api/sessionDocuments/sendRequestToLinkGoogleAccount/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}