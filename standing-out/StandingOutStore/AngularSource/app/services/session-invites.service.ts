import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { SessionInvite } from '../models/index';

@Injectable()
export class SessionInvitesService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();      

    getByClassSession(id: string): Observable<SessionInvite[]> {
        return this.http.get<SessionInvite[]>(this.serviceHelper.baseApi + '/api/sessionInvites/getByClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<SessionInvite> {
        return this.http.post<SessionInvite>(this.serviceHelper.baseApi + '/api/sessionInvites', model, { headers: this.serviceHelper.buildHeader() });
    }

    createBulk(model) {
        return this.http.post(this.serviceHelper.baseApi + '/api/sessionInvites/createBulk', model, { headers: this.serviceHelper.buildHeader() });
    }

    createMultiple(models) {
        return this.http.post(this.serviceHelper.baseApi + '/api/sessionInvites/createMultiple', models, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/sessionInvites/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}