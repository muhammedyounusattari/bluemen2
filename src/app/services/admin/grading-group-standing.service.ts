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
        return this.dataService.callPostService(ServiceUrls.POST_GRADING_GROUP_LIST, request);
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

    getGradingGroupMaxId() {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_GROUP_MAX_ID, '');
    }

    updateGradingGroupDeletedList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_GROUP_DELETED_LIST, request);
    }
    
    //
    getDeletedGradingGroupItemById(id: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_GRADE_GROUP_ITEM_BY_ID+id);
    }

    recoverGradingGroupList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_GRADE_GROUP, request);
    }

    updateGradingGroupId(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADE_GROUP_ID, request);
    }

    mergeGradingGroupId(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_GRADE_GROUP_ID, request);
    }
    
    
    /** GRADING GROUP LIST API - END */

    /** GRADING STANDING LIST API - START */

    getGradingStandingList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_STANDING_LIST, request);
    }

    postGradingStandingList(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_GRADING_STANDING_LIST, request);
    }

    updateGradingStandingList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_STANDING_LIST , request);
    }

    filterGradingStandingList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_GRADING_STANDING_LIST, request);
    }

    deleteGradingStandingList(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_GRADING_STANDING_LIST, request);
    }

    getGradingStandingMaxId() {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_STANDING_MAX_ID, '');
    }

    getGradingStandingMovedList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_GRADING_STANDING_MOVED_LIST, request);
    }

    updateGradingStandingDeletedList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_STANDING_DELETED_LIST, request);
    }

    //Service
    getDeletedGradingStandingById(id: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_GRADING_ITEM_BY_ID+id);
    }

    recoverGradingStandingList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_GRADING, request);
    }

    updateGradingStandingId(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_ID, request);
    }

    mergeGradingStandingId(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_GRADING_ID, request);
    }
    /** GRADING STANDING LIST API - END */

}