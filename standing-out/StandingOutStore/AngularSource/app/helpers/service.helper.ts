import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ServiceHelper {
    constructor() { }

    baseApi: string = environment.baseApiUrl;

    buildHeader(): HttpHeaders {
        //let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.currentUserService.getCurrentUser().token });
        //headers.append('Content-Type', 'application/json');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return headers;
    }
}
