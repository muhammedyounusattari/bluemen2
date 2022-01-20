import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})

export class TutorContactsService {
  constructor(private dataService: DataService) {}

  /**
   * @method getTutorContacts
   */
  public getTutorContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TUTOR_CONTACTS);
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
  //  * @method getTutorContactsAdvFilter
  //  */
  // public getTutorContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getTutorContactsMoreAdvFltr
  //  */
  // public getTutorContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getTutorContactsMoreFltr
  //  */
  // public getTutorContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getTutorContactsMoreNormalFltr
  //  */
  // public getTutorContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TUTOR_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addTutorContacts
   * @param request
   */
  public addTutorContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TUTOR_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteTutorContacts
   * @param request
   */
  public deleteTutorContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TUTOR_CONTACTS,
      request
    );
  }

  /**
   * @method editTutorContacts
   * @param request
   */
  public editTutorContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TUTOR_CONTACTS,
      request
    );
  }
}
