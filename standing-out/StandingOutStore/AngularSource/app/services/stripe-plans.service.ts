import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { StripePlan, PagedList, Subscription } from '../models/index';

@Injectable()
export class StripePlansService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    get(): Observable<StripePlan[]> {
        return this.http.get<StripePlan[]>(this.serviceHelper.baseApi + '/api/stripePlans', { headers: this.serviceHelper.buildHeader() });
    }

    getById(id: string): Observable<StripePlan> {
        return this.http.get<StripePlan>(this.serviceHelper.baseApi + '/api/stripePlans/getById/' + id, { headers: this.serviceHelper.buildHeader() });
    }

    getSubscriptionPlan(): Observable<StripePlan[]> {
        return this.http.get<StripePlan[]>(this.serviceHelper.baseApi + '/api/stripePlans/getSubscriptionPlan', { headers: this.serviceHelper.buildHeader() });
    }

}