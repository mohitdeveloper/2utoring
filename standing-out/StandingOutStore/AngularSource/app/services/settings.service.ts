import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    // This commission is no longer valid.. See Subscription Features - Commission Tiers
    getBaseClassSessionCommision(): Observable<number> {
        return this.http.get<number>(this.serviceHelper.baseApi + '/api/settings/getBaseClassSessionCommision', { headers: this.serviceHelper.buildHeader() });
    }

    getIdentitySiteUrl(): Observable<string> {
        return this.http.get<string>(this.serviceHelper.baseApi + '/api/settings/getIdentitySiteUrl', { headers: this.serviceHelper.buildHeader() });
    }
}
    