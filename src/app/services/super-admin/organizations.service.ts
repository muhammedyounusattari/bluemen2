import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class OrganizationsService {
    constructor(private dataService: DataService) {
    }

    getOrganizationsList(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ORGANIZATIONS_LIST);
    }

    saveOrganization(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.ADD_ORGANIZATION, request);
    }

    updateOrganization(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ORGANIZATION, request);
    }

    getProgTypeList(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ORG_PROG_TYPE_LIST);
    }

    getSubScriptionList(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ORG_SUBSCRIPTION_TYPE_LIST);
    }

}