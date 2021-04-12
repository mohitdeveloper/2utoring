import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { StripeCountry, PagedList } from '../models/index';

@Injectable()
export class StripeCountrysService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();       

    get(): Observable<StripeCountry[]> {
        return this.http.get<StripeCountry[]>(this.serviceHelper.baseApi + '/api/stripeCountrys', { headers: this.serviceHelper.buildHeader() });
    }
}