import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private dataService: DataService) {}

  /**
   * @method getTStudentsList
   */
  public getTStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  /**
   * @method getStaffList
   */
   public getStaffList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method getPulldownState
   */
   public getPulldownState(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_PULLDOWN_STATE);
  }

  /**
   * @method getPulldownCity
   */
   public getPulldownCity(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_PULLDOWN_CITY);
  }

  /**
   * @method addStudentsList
   * @param request
   */
  public addStudentsList(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STUDENTS_LIST,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteStudentsList
   * @param request
   */
  public deleteStudentsList(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STUDENTS_LIST,
      request
    );
  }

  /**
   * @method editStudentsList
   * @param request
   */
  public editStudentsList(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STUDENTS_LIST,
      request
    );
  }
}
