import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { Subject, PagedList, SearchOption } from '../models/index';

@Injectable()
export class WebsiteContactService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    create(model): Observable<any> {
        return this.http.post<any>(this.serviceHelper.baseApi + '/api/WebsiteContact/createContact', model, { headers: this.serviceHelper.buildHeader() });
    }
}