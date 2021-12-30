import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})

export class TeacherService {
  constructor(private dataService: DataService) {
  }

  getTeachersList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TEACHER_LIST);
  }

  saveTeacherRecord(request: any): Observable<any> {
    return this.dataService.callPostService(ServiceUrls.POST_TEACHER, request);
  }

  deleteTeacherRecord(request: any): Observable<any> {
    return this.dataService.callDeleteService(ServiceUrls.DELETE_TEACHER, request);
  }

}
