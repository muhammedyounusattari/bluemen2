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

    validateLogin(request: any): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/mumbai-university/login/v1';
        return this.dataService.callPostService(URL, request);
    }
}