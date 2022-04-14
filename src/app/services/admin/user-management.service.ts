import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root',
})

export class UserManagementService {
    constructor(private dataService: DataService) { }

    public getUserList(orgCode:any) {
        return this.dataService.callGetService(ServiceUrls.GET_ORG_USERS);
    }

    public addUpdateUser(request: any, orgId: any, userId: any): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/keycloak/tenant/' + orgId + '/createUser/v1/' + userId;
        return this.dataService.callPostService(
            URL,
            JSON.stringify(request)
        );
    }

    public deleteUser(id: string, orgCode: any) {
        const URL = 'https://blumen-api.azurewebsites.net/api/keycloak/tenant/' + orgCode + '/deleteUser/v1/' + id;
        return this.dataService.callDeleteService(URL);
    }

    public resetPassword(user: string) {
      const URL = ServiceUrls.RESET_PASSWORD+""+user;
      return this.dataService.callGetService(URL);
    }
}
