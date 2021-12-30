import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})

export class TutorService {
  constructor(private dataService: DataService) {
  }

  getTutorsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TUTORS_LIST);
  }

  saveTutorRecord(request: any): Observable<any> {
    return this.dataService.callPostService(ServiceUrls.POST_TUTORS, request);
  }

  deleteTutorRecord(request: any): Observable<any> {
    return this.dataService.callDeleteService(ServiceUrls.DELETE_TUTORS, request);
  }

}
