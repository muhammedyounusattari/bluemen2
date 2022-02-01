import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class StaffMembersService {
  constructor(private dataService: DataService) {}

  /**
   * @method getStaffMembers
   */
  public getStaffMembers(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method addStaffMembers
   * @param request
   */
  public addStaffMembers(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STAFF_MEMBERS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteStaffMembers
   * @param request
   */
  public deleteStaffMembers(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STAFF_MEMBERS,
      request
    );
  }

  /**
   * @method filterStaffMembers
   * @param request
   */
  public filterStaffMembers(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.FILTER_STAFF_MEMBERS,
      request
    );
  }

  /**
   * @method editStaffMembers
   * @param request
   */
  public editStaffMembers(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STAFF_MEMBERS,
      request
    );
  }

  public getPullDownList(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_PULL_DOWN_LIST);
  }
  
  public getPullDownItems(id:any): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_PULL_DOWN_ITEMS+id);
  }
}
