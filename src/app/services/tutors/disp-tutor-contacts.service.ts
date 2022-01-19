import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})

export class DispTutorContactsService {
  constructor(private dataService: DataService) {}

  /**
   * @method getDispTutorContacts
   */
  public getDispTutorContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TUTOR_CONTACTS_REMINDER);
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
  //  * @method getDispTutorContactsAdvFilter
  //  */
  // public getDispTutorContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTutorContactsMoreAdvFltr
  //  */
  // public getDispTutorContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTutorContactsMoreFltr
  //  */
  // public getDispTutorContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTutorContactsMoreNormalFltr
  //  */
  // public getDispTutorContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addDispTutorContacts
   * @param request
   */
  public addDispTutorContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TUTOR_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteDispTutorContacts
   * @param request
   */
  public deleteDispTutorContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TUTOR_CONTACTS,
      request
    );
  }

  /**
   * @method editDispTutorContacts
   * @param request
   */
  public editDispTutorContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TUTOR_CONTACTS,
      request
    );
  }
}
