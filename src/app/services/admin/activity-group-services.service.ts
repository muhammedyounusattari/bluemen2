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

    getActivityGroupMaxId() {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_GROUP_MAX_ID, '');
    }
    /** ACTIVITY GROUP LIST - END */

    /** ACTIVITY SERVICE LIST - START */
    
    getActivityServiceList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_SERVICE_LIST, request);
    }

    postActivityServiceList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_ACTIVITY_SERVICE_LIST, request);
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

    getActivityServiceMaxId() {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_SERVICE_MAX_ID, '');
    }


    getDeletedGroupById(id: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_GROUP_BY_ID+id);
    }

    recoverActivityGroupById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_ACTIVITY_GROUP_BY_ID, request);
    }

    updateActivityGroupById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ACTIVITY_GROUP_BY_ID, request);
    }

    mergeActivityGroupById(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_ACTIVITY_GROUP_BY_ID, request);
    }

    //Service
    getDeletedActivityById(id: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_ACTIVITY_BY_ID+id);
    }

    recoverActivityById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_ACTIVITY_BY_ID, request);
    }

    updateActivityById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ACTIVITY_BY_ID, request);
    }

    mergeActivityById(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_ACTIVITY_BY_ID, request);
    }

    getActivityByActivityNameAndActivityGroupName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_ACTIVITY_BY_ACTIVITY_NAME_AND_GROUP_NAME, request);
    }

    getActivityGroupByActivityGroupNameAndActivityGroupType(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_ACTIVITY_GROUP_NAME_AND_TYPE_AND_TYPE_NAME, request);
    }


    /** ACTIVITY SERVICE LIST - END */
}
