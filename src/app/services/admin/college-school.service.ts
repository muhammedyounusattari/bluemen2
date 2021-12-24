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

    getCollegeSchoolNames(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_COLLEGE_SCHOOL_LIST, request);
    }

    postCollegeSchoolName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_COLLEGE_SCHOOL_NAME, request);
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

    getStudentNames(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_GROUP_LIST, request);
    }

    postStudentName(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_ACTIVITY_GROUP_LIST, request);
    }

    updateStudentName(request: any): Observable<any> {
        return this.dataService.callPutService(ServiceUrls.UPDATE_ACTIVITY_GROUP_LIST, request);
    }

    filterStudentList(request: any): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.FILTER_ACTIVITY_GROUP_LIST, request);
    }

    deleteStudentName(request: any): Observable<any> {
        return this.dataService.callDeleteService(ServiceUrls.DELETE_ACTIVITY_GROUP_LIST, request);
    }

    /** STUDENT API - END */

}