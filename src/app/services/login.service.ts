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
        return this.dataService.callLoginPostService(ServiceUrls.AUTHENTICATE, request);
    }

    getSecurityQuestions(username: string, orgCode: string) {
        const request = {
            'orgType': orgCode,
            'email': username
        };
        return this.dataService.callLoginPostService(ServiceUrls.FORGOT_PASSWORD, request);
    }

    forgotPassword(request: any, orgCode: string) {
        return this.dataService.callLoginPostService(ServiceUrls.FORGOT_PASSWORD , request);
    }

    updateSecurityQuestions(request: any) {
        const URL = 'https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/updateSecurityQuestions';
        return this.dataService.callPutService(URL, request);
    }

    getSecurityQuestionList() {
        return this.dataService.callGetService(ServiceUrls.GET_SECURITY_QUESTIONS);
    }


    resetPasswordUsingLink(request: any, hasCode: string) {
        // https://blumen-api.azurewebsites.net:443/api/blumen-api/keycloak/resetPassword/
        //53624853-73ea-4c42-bffe-df9fe87700e8
        const URL = ServiceUrls.UPDATE_PASSWORD + hasCode.replace('#', '');
        return this.dataService.callLoginPostService(URL, request);
    }

    getSSOConfig(request: any) {
        const URL= 'https://blumen-api.azurewebsites.net:443/api/blumen-api/ssoConfig?email='+request.email + '&orgType='+request.orgType;
        return this.dataService.validateUser(URL);
    }
}
