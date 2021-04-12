import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { EnumOption, ManagementInfoDashboard, ClassSessionIndex, PagedList } from '../models/index';

@Injectable()
export class DashboardService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    getManagementInfo(search): Observable<ManagementInfoDashboard> {
        return this.http.post<ManagementInfoDashboard>(this.serviceHelper.baseApi + '/api/dashboard/managementinfo', search, { headers: this.serviceHelper.buildHeader() });
    }

    getSessions(search): Observable<PagedList<ClassSessionIndex>> {
        return this.http.post<PagedList<ClassSessionIndex>>(this.serviceHelper.baseApi + '/api/dashboard/sessions', search, { headers: this.serviceHelper.buildHeader() });
    }
}