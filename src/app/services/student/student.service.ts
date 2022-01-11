import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor(private dataService: DataService) {
    }

    public getTStudentsList(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
    }
}
