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

    /** STUDENT API - END */

}