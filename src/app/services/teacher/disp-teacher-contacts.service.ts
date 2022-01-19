import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class DispTeacherContactsService {

  constructor(private dataService: DataService) {
  }

  /**
   * @method getDispTeacherContacts
   */
   public getDispTeacherContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TEACHER_CONTACTS_REMINDER);
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
  //  * @method getDispTeacherContactsAdvFilter
  //  */
  // public getDispTeacherContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTeacherContactsMoreAdvFltr
  //  */
  // public getDispTeacherContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTeacherContactsMoreFltr
  //  */
  // public getDispTeacherContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getDispTeacherContactsMoreNormalFltr
  //  */
  // public getDispTeacherContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addDispTeacherContacts
   * @param request
   */
  public addDispTeacherContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TEACHER_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteDispTeacherContacts
   * @param request
   */
  public deleteDispTeacherContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TEACHER_CONTACTS,
      request
    );
  }

  /**
   * @method editDispTeacherContacts
   * @param request
   */
  public editDispTeacherContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TEACHER_CONTACTS,
      request
    );
  }
}
