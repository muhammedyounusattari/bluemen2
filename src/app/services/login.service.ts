import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service';
import { ServiceUrls } from '../constants/serviceUrl';
import { environment } from 'src/environments/environment';

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
            'orgCode': orgCode,
            'email': username
        };
        return this.dataService.callLoginPostService(ServiceUrls.FORGOT_PASSWORD, request);
    }

    forgotPassword(request: any) {
        return this.dataService.callLoginPostService(ServiceUrls.FORGOT_PASSWORD , request);
    }

    updateSecurityQuestions(request: any) {
        const URL =  environment.apiUrl+'/blumen-api/updateSecurityQuestions';
        return this.dataService.callPutService(URL, request);
    }

    getSecurityQuestionList(orgCode: any) {
        const URL = environment.apiUrl+'/blumen-api/admin/securityQuestions';
        return this.dataService.callGetService(URL);
    }

    getSecurityQuestions2(orgCode: any) {
        const URL = environment.apiUrl+'/blumen-api/admin/' + orgCode + '/securityQuestions/2';
        return this.dataService.callGetService(URL);
    }

    resetPasswordUsingLink(request: any, hasCode: string) {
        const URL = ServiceUrls.UPDATE_PASSWORD + hasCode.replace('#', '');
        return this.dataService.callLoginPostService(URL, request);
    }

    getSSOConfig(request: any) {
        const URL= ServiceUrls.SSO_CONFIG + '?email='+request.email + '&orgCode='+request.orgType;
        return this.dataService.validateUser(URL);
    }

    logoutUser() {
        return this.dataService.callGetService(ServiceUrls.LOGOUT_USER);
    }

    generateCode() {
        return this.dataService.callGetService(ServiceUrls.GENERATE_CODE);
    }

    validateCode(code: any) {
        const request = {
            'authCode': code
        };
        return this.dataService.callPostService(ServiceUrls.VALIDATE_CODE, request);
    }
}
