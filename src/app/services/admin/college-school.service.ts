import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class CollegeAndSchoolService {
    constructor(private dataService: DataService) {
    }

    /** COLLEGE API - START */

    getCollegeNames(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_COLLEGE_LIST, request);
    }

    getSchoolNames(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_SCHOOL_LIST, request);
    }

    postCollegeSchoolName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_COLLEGE_NAME, request);
    }

    searchCollegeSchoolName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.SEARCH_COLLEGE_SCHOOL_NAME, request);
    }


    updateCollegeSchoolName(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_COLLEGE_SCHOOL_NAME, request);
    }

    filterCollegeSchoolList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_COLLEGE_SCHOOL_LIST, request);
    }

    deleteCollegeSchoolName(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_COLLEGE_SCHOOL_NAME, request);
    }

    /** COLLEGE API - END */

    /** STUDENT API - START */

    postStudentName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_SCHOOL_NAME, request);
    }

    public getPullDownList(): Observable<any> {
        return this.dataService.callGetService(
            ServiceUrls.GET_PULL_DOWN_LIST);
    }

    public getPullDownItems(id: any): Observable<any> {
        return this.dataService.callGetService(
            ServiceUrls.GET_PULL_DOWN_ITEMS + id);
    }

    /** STUDENT API - END */

    /** Common for school and college -START  */
    getDeletedCollegeAndSchoolByName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_DELETED_COLLEGE_SCHOOL_BY_NAME, request);
    }

    /** Common for school and college -START  */
    getDeletedCollegeAndSchoolByNameAndOrgId(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_DELETED_COLLEGE_SCHOOL_BY_NAME_AND_ORG_ID, request);
    }

    recoverCollegeAndSchoolList(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.RECOVER_DELETED_COLLEGE_SCHOOL, request);
    }

    updateCollegeAndSchoolNameById(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_COLLEGE_SCHOOL_NAME_BY_ID, request);
    }

    mergeCollegeSchoolByName(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.MERGE_COLLEGE_SCHOOL_By_NAME, request);
    }
   
    getCollegeSchoolByName(request: any,): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_COLLEGE_SCHOOL_BY_NAME, request);
    }

    getCollegeSchoolByCode(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.GET_COLLEGE_SCHOOL_BY_CODE, request);
    }

   /** Common for move merge -END  */

}
