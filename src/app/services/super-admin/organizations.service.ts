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
}