import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class DispCounselorContactsService {

  constructor(private dataService: DataService) {
  }

  /**
   * @method getDispCounselorContacts
   */
   public getDispCounselorContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_COUNSELOR_CONTACTS_REMINDER);
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
  //  * @method getDispCounselorContactsAdvFilter
  //  */
  // public getDispCounselorContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispCounselorContactsMoreAdvFltr
  //  */
  // public getDispCounselorContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getDispCounselorContactsMoreFltr
  //  */
  // public getDispCounselorContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispCounselorContactsMoreNormalFltr
  //  */
  // public getDispCounselorContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addDispCounselorContacts
   * @param request
   */
  public addDispCounselorContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_COUNSELOR_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteDispCounselorContacts
   * @param request
   */
  public deleteDispCounselorContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_COUNSELOR_CONTACTS,
      request
    );
  }

  /**
   * @method editDispCounselorContacts
   * @param request
   */
  public editDispCounselorContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_COUNSELOR_CONTACTS,
      request
    );
  }
}
