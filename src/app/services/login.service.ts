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

    getSecurityQuestions(username: string, orgCode: string) {
        const request = {
            'orgCode': orgCode,
            'username': username
        };
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/forgotPassword';
        return this.dataService.callLoginPostService(URL, request);
    }

    forgotPassword(request: any, orgCode: string) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/forgotPassword';
        return this.dataService.callLoginPostService(URL, request);
    }

    resetPassword(request: any, orgCode: string) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/tenant/' + orgCode + '/forgotPassword/v1';
        return this.dataService.callLoginPostService(URL, request);
    }

    getSecurityQuestions1(orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions1/' + orgCode;
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions1{orgId}
        return this.dataService.callGetService(URL);
    }
    
    getSecurityQuestions2(orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions2/' + orgCode;
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions1{orgId}
        return this.dataService.callGetService(URL);
    }
}
