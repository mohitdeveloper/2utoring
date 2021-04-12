import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { StoreGroupManagement, TutorCommandGroup, SessionGroupDraggable } from '../models/index';

@Injectable()
export class SessionGroupsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();      

    getTutorCommand(classSessionId: string): Observable<TutorCommandGroup> {
        return this.http.get<TutorCommandGroup>(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups/tutorcommand`, { headers: this.serviceHelper.buildHeader() });
    }

    update(classSessionId: string, id, model): Observable<SessionGroupDraggable> {
        return this.http.put<SessionGroupDraggable>(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups/` + id, model, { headers: this.serviceHelper.buildHeader() });
    }

    create(classSessionId: string, model): Observable<SessionGroupDraggable> {
        return this.http.post<SessionGroupDraggable>(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups`, model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(classSessionId: string, id: string) {
        return this.http.delete(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups/` + id, { headers: this.serviceHelper.buildHeader() });
    }

    removeFromGroup(classSessionId: string, id: string, data: StoreGroupManagement) {
        return this.http.put(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups/${id}/users`, data, { headers: this.serviceHelper.buildHeader() });
    }

    moveToGroup(classSessionId: string, id: string, data: StoreGroupManagement) {
        return this.http.patch(this.serviceHelper.baseApi + `/api/${classSessionId}/sessiongroups/${id}/users`, data, { headers: this.serviceHelper.buildHeader() });
    }


}