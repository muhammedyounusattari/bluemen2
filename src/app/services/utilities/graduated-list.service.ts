import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class GraduatedListService {
  constructor(private dataService: DataService) {}

  /**
   * @method updateGraduatedYear
   * @param request
   */
  public updateGraduatedYear(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.UPDATE_GRADUATED_YEAR,
      JSON.stringify(request)
    );
  }

  /**
   * @method updateGraduatedInformation
   * @param request
   */
   public updateGraduatedInformation(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.UPDATE_GRADUATION_INFORMATION,
      JSON.stringify(request)
    );
  }

  /**
   * @method getStaffList
   */
   public getStaffList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method getStateList
   */
   public getStateList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_PULLDOWN_STATE);
  }

  /**
   * @method getCityList
   */
   public getCityList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_PULLDOWN_CITY);
  }

  /**
   * @method deleteStudent
   * @param request
   */
   public deleteStudent(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STUDENTS_LIST,
      request
    );
  }
}
