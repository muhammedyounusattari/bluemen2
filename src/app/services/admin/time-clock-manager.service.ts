import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class TimeClockManagerService {
  constructor(private dataService: DataService) {}

  /**
   * @method getTimeClockManager
   */
  public getTimeClockManager(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_TIME_CLOCK_MANAGER);
  }

  /**
   * @method addTimeClockManager
   * @param request
   */
  public addTimeClockManager(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TIME_CLOCK_MANAGER,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteTimeClockManager
   * @param request
   */
  public deleteTimeClockManager(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TIME_CLOCK_MANAGER,
      request
    );
  }

  /**
   * @method getStaffMember
   */
   public getStaffMember() {
    return this.dataService.callGetService(
      ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method filterTimeClockManager
   * @param request
   */
  public filterTimeClockManager(request: any): Observable<any> {
    return this.dataService.callPutService(
      `${ServiceUrls.FILTER_TIME_CLOCK_MANAGER}?name=${request.staffName}`,
      request
    );
  }

  /**
   * @method editTimeClockManager
   * @param request
   */
  public editTimeClockManager(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TIME_CLOCK_MANAGER_LIST,
      request
    );
  }
}
