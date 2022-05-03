import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root',
})

export class UserManagementService {
    constructor(private dataService: DataService) { }

    public getUserList(orgId: any) {
        const URL = ServiceUrls.GET_ORGANIZATIONS_USER_LIST + orgId;
        return this.dataService.callGetService(URL);
    }

    getOrganizationsList(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ORGANIZATIONS_LIST);
    }

    public createUser(request: any): Observable<any> {
        return this.dataService.callPostService(
            ServiceUrls.CREATE_ORGANIZATION_USER,
            JSON.stringify(request)
        );
    }

    public updateUser(request: any): Observable<any> {
        return this.dataService.callPostService(
            ServiceUrls.UPDATE_ORGANIZATION_USER,
            JSON.stringify(request)
        );
    }

    public resetPassword(user: string, orgCode: string) {
        const URL = ServiceUrls.RESET_PASSWORD + "" + user+"/"+orgCode;
        return this.dataService.callGetService(URL);
    }

    getRoleNamesList() {
        return this.dataService.callGetService(ServiceUrls.GET_ROLENAMES_LIST, '');
    }
}
