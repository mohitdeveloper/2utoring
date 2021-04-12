import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { PromoCode } from '../models/index';

@Injectable()
export class PromoCodeService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    get(promoCode: string): Observable<PromoCode> {
        return this.http.post<PromoCode>(this.serviceHelper.baseApi + '/api/promoCode/find', { name: promoCode}, { headers: this.serviceHelper.buildHeader() });
    }

}