import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service';
import { ServiceUrls } from '../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    constructor(private dataService: DataService) {
    }

    validateLogin(request: any, orgCode: string): Observable<any> {
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/tenant/mcn-demo/login/v1%22
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/tenant/' + orgCode + '/login/v1';
        return this.dataService.callLoginPostService(URL, request);
    }
}
