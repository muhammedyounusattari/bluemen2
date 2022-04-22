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

    public addUpdateUser(request: any): Observable<any> {

        return this.dataService.callPostService(
            ServiceUrls.CREATE_ORGANIZATION_USER,
            JSON.stringify(request)
        );
    }

    public deleteUser(id: string, orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net/api/keycloak/tenant/' + orgCode + '/deleteUser/v1/' + id;
        return this.dataService.callDeleteService(URL);
    }

    public resetPassword(user: string) {
        const URL = ServiceUrls.RESET_PASSWORD + "" + user;
        return this.dataService.callGetService(URL);
    }
}
