import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class StaffClassesService {

  constructor(private dataService: DataService) {
  }

    public getStaffClassesList(): Observable<any> {
      return this.dataService.callGetService(ServiceUrls.GET_STAFF_CLASSES);
    }

    public getStaffClassesRecordPerId(id:string): Observable<any> {
      return this.dataService.callGetService(ServiceUrls.GET_STAFF_CLASSES_PER_RECORD+id);
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
     * @method addStaffClasses
     * @param request
     */
    public addStaffClasses(request: any): Observable<any> {
      return this.dataService.callPostService(
        ServiceUrls.POST_STAFF_CLASSES,
        JSON.stringify(request));
    }

    /**
     * @method deleteStaffClasses
     * @param request
     */
    public deleteStaffClasses(request: any): Observable<any> {
      return this.dataService.callDeleteService(
        ServiceUrls.DELETE_STAFF_CLASSES,
        request
      );
    }

    /**
     * @method editStaffContacts
     * @param request
     */
    public editStaffContacts(request: any): Observable<any> {
      return this.dataService.callPutService(
        request
      );
    }

   public getStaffs():Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
   }


  //OLD CODE

  /**
   * @method getStaffContacts

   public getStaffContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_CONTACTS);
  } */

  /**
   * @method getStudentsList

   public getStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  } */

  /**
   * @method getStaffList

   public getStaffList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
  } */

  /**
   * @method getActivityServiceList

   public getActivityServiceList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_ACTIVITY_SERVICE_LIST);
  }

  public getStaffClassesRecordPerId(id:string): Observable<any> {
   return this.dataService.callGetService(ServiceUrls.GET_TEACHER_CLASSES_PER_RECORD+id);
  } */

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

  public addStaffContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STAFF_CONTACTS,
      JSON.stringify(request)
    );
  }
*/
  /**
   * @method deleteStaffContacts
   * @param request

  public deleteStaffContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STAFF_CONTACTS,
      request
    );
  } */

  /**
   * @method editStaffContacts
   * @param request

  public editStaffContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STAFF_CONTACTS,
      request
    );
  } */
}
