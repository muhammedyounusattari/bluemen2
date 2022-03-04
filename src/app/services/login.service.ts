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

    updateSecurityQuestions(request: any) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/updateSecurityQuestions';
        return this.dataService.callPutService(URL, request);
    }

    getSecurityQuestionList(orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/' + orgCode + '/securityQuestions';
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions1{orgId}
        return this.dataService.callGetService(URL);
    }
    
    getSecurityQuestions2(orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/admin/' + orgCode + '/securityQuestions/2';
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/admin/test/securityQuestions1{orgId}
        return this.dataService.callGetService(URL);
    }

    resetPasswordUsingLink(request: any, hasCode: string) {
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/resetPassword/
        //53624853-73ea-4c42-bffe-df9fe87700e8
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/resetPassword/' + hasCode.replace('#', '');
        return this.dataService.callLoginPostService(URL, request);
    }
}
