import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class GradingGroupStandingService {
    constructor(private dataService: DataService) {
    }

    /** GRADING GROUP API - START */

    getGradingGroupList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_GROUP_LIST, request);
    }

    postGradingGroupList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_GRADING_GROUP_LIST, JSON.stringify(request));
    }

    updateGradingGroupList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_GROUP_LIST, request);
    }

    filterGradingGroupList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_GRADING_GROUP_LIST, request);
    }

    deleteGradingGroupList(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_GRADING_GROUP_LIST, request);
    }

    /** GRADING GROUP LIST API - END */

    /** GRADING STANDING LIST API - START */

    getGradingStandingList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_GROUP_LIST, request);
    }

    postGradingStandingList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_GRADING_GROUP_LIST, JSON.stringify(request));
    }

    updateGradingStandingList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_GROUP_LIST, request);
    }

    filterGradingStandingList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_GRADING_GROUP_LIST, request);
    }

    deleteGradingStandingList(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_GRADING_GROUP_LIST, request);
    }

    /** GRADING STANDING LIST API - END */

}