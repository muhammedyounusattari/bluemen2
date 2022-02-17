import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class TimeClockService {
  constructor(private dataService: DataService) {}

  /**
   * @method getTimeClock
   */
  public getTimeClock(staffId: string, staffName: string): Observable<any> {
    return this.dataService.callGetService(
      `${ServiceUrls.GET_TIME_CLOCK}?staffId=${staffId}&staffName=${staffName}`);
  }

  /**
   * @method getStaffMember
   */
  public getStaffMember() {
    return this.dataService.callGetService(
      ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method addTimeClock
   * @param request
   */
  public addTimeClock(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TIME_CLOCK,
      JSON.stringify(request)
    );
  }

  /**
   * @method editTimeClock
   * @param request
   */
  public editTimeClock(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TIME_CLOCK_MANAGER_LIST,
      request
    );
  }
}
