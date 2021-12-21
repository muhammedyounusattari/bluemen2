import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class ActivityGroupServicesService {
    constructor(private dataService: DataService) {
    }

    /** ACTIVITY GROUP LIST - START */
    
    getActivityGroupList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_GROUP_LIST, request);
    }

    postActivityGroupList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_ACTIVITY_GROUP_LIST, request);
    }

    updateActivityGroupList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ACTIVITY_GROUP_LIST, request);
    }

    filterActivityGroupList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_ACTIVITY_GROUP_LIST, request);
    }

    deleteActivityGroupList(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_ACTIVITY_GROUP_LIST, request);
    }

    /** ACTIVITY GROUP LIST - END */

    /** ACTIVITY SERVICE LIST - START */
    
    getActivityServiceList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_SERVICE_LIST, request);
    }

    postActivityServiceList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_ACTIVITY_SERVICE_LIST, JSON.stringify(request));
    }

    updateActivityServiceList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ACTIVITY_SERVICE_LIST, request);
    }

    filterActivityServiceList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_ACTIVITY_SERVICE_LIST, request);
    }

    deleteActivityServiceList(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_ACTIVITY_SERVICE_LIST, request);
    }

    /** ACTIVITY SERVICE LIST - END */
}