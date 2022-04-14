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
    getDeletedGradingGroupById(id: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_GRADE_GROUP_BY_ID+id);
    }

    recoverGradingGroupById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_GRADE_GROUP_BY_ID, request);
    }

    updateGradingGroupById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADE_GROUP_BY_ID, request);
    }

    mergeGradingGroupById(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_GRADE_GROUP_BY_ID, request);
    }

    getGradingGroupByGradingGroupNameAndGradingGroupType(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_GRADING_GROUP_BY_NAME_AND_GROUP_TYPE, request);
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
        return this.dataService.callGetService(ServiceUrls.GET_DELETED_GRADING_BY_ID+id);
    }

    recoverGradingStandingById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_GRADING_BY_ID, request);
    }

    updateGradingStandingById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_GRADING_BY_ID, request);
    }

    mergeGradingStandingById(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_GRADING_BY_ID, request);
    }

    getGradingByGradingNameAndGradingGroupName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_GRADING_STANDING_NAME_AND_GROUP_NAME, request);
    }
    /** GRADING STANDING LIST API - END */

}
