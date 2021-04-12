import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { SafeguardingForm, TableSearch, PagedList, SafeguardReportIndex } from '../models/index';

@Injectable()
export class SafeguardingReportsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    create(model: SafeguardingForm): Observable<void> {
        return this.http.post<void>(this.serviceHelper.baseApi + '/api/safeguardingReports', model, { headers: this.serviceHelper.buildHeader() });
    }

    getPaged(model: TableSearch): Observable<PagedList<SafeguardReportIndex>> {
        return this.http.post<PagedList<SafeguardReportIndex>>(this.serviceHelper.baseApi + '/api/safeguardingReports/paged', model, { headers: this.serviceHelper.buildHeader() });
    }
}