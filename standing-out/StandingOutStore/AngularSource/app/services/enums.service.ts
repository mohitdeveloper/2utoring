import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceHelper } from '../helpers/index';
import { EnumOption } from '../models/index';

@Injectable()
export class EnumsService {

    constructor(private http: HttpClient) {

    }
    serviceHelper: ServiceHelper = new ServiceHelper();

    get(type: string): Observable<EnumOption[]> {
        return this.http.get<EnumOption[]>(this.serviceHelper.baseApi + '/api/enums/' + type, { headers: this.serviceHelper.buildHeader() });
    }
}