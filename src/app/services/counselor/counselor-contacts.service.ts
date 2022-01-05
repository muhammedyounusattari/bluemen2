import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class CounselorContactsService {

  constructor(private dataService: DataService) {
  }

  /**
   * @method getCounselorContacts
   */
   public getCounselorContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_COUNSELOR_CONTACTS);
  }

  /**
   * @method getTStudentsList
   */
   public getTStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  // /**
  //  * @method getCounselorContactsAdvFilter
  //  */
  // public getCounselorContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getCounselorContactsMoreAdvFltr
  //  */
  // public getCounselorContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getCounselorContactsMoreFltr
  //  */
  // public getCounselorContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getCounselorContactsMoreNormalFltr
  //  */
  // public getCounselorContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_COUNSELOR_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addCounselorContacts
   * @param request
   */
  public addCounselorContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_COUNSELOR_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteCounselorContacts
   * @param request
   */
  public deleteCounselorContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_COUNSELOR_CONTACTS,
      request
    );
  }

  /**
   * @method editCounselorContacts
   * @param request
   */
  public editCounselorContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_COUNSELOR_CONTACTS,
      request
    );
  }
}
