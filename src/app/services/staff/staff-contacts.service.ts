import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class StaffContactsService {

  constructor(private dataService: DataService) {
  }

  /**
   * @method getStaffContacts
   */
   public getStaffContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_CONTACTS);
  }

  /**
   * @method getStudentsList
   */
   public getStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  /**
   * @method getStaffList
   */
   public getStaffList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
  }

  /**
   * @method getActivityServiceList
   */
   public getActivityServiceList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_SERVICE_LIST);
  }

  // /**
  //  * @method getStaffContactsAdvFilter
  //  */
  // public getStaffContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_STAFF_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getStaffContactsMoreAdvFltr
  //  */
  // public getStaffContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_STAFF_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getStaffContactsMoreFltr
  //  */
  // public getStaffContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_STAFF_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getStaffContactsMoreNormalFltr
  //  */
  // public getStaffContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_STAFF_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addStaffContacts
   * @param request
   */
  public addStaffContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STAFF_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteStaffContacts
   * @param request
   */
  public deleteStaffContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STAFF_CONTACTS,
      request
    );
  }

  /**
   * @method editStaffContacts
   * @param request
   */
  public editStaffContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STAFF_CONTACTS,
      request
    );
  }
}
