import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { SessionMedia} from '../models/index';

@Injectable()
export class SessionMediasService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();      

    getByClassSession(id: string): Observable<SessionMedia[]> {
        return this.http.get<SessionMedia[]>(this.serviceHelper.baseApi + '/api/sessionMedias/getByClassSession/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    create(model): Observable<SessionMedia> {
        return this.http.post<SessionMedia>(this.serviceHelper.baseApi + '/api/sessionMedias', model, { headers: this.serviceHelper.buildHeader() });
    }

    delete(id: string) {
        return this.http.delete(this.serviceHelper.baseApi + '/api/sessionMedias/' + id, { headers: this.serviceHelper.buildHeader() });
    }
}