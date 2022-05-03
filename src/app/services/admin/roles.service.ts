import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class RolesService {
    constructor(private dataService: DataService) {
    }

    getRoleNamesList() {
        return this.dataService.callGetService(ServiceUrls.GET_ROLENAMES_LIST, '');
    }

    getMenuList() {
        return this.dataService.callGetService(ServiceUrls.GET_MENU_LIST, '');
    }

    getPriviledgesByRoleName(roleName: string) {
        return this.dataService.callGetService(ServiceUrls.GET_PRIVILEDGES_BY_ROLENAME + roleName, '');
    }

    addNewRole(request: any): Observable<any> {
        const URL = ServiceUrls.ADD_NEW_ROLE+'?copyRoleName=' 
        + request.copyRoleName
        + '&isDefault=' + request.isDefault + '&newRoleCode=' + request.newRoleCode + '&newRoleName=' +
        request.newRoleName + '&orgId=' + request.orgId;
        return this.dataService.callPostService(URL, request);
    }

    deleteRole(id: string) {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_ROLE + id);
    }

    updateRole(request: any): Observable<any> {
        const URL = ServiceUrls.UPDATE_NEW_ROLE;
        return this.dataService.callPutService(URL, request);
    }
}