import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class TeacherContactsService {

  constructor(private dataService: DataService) {
  }

  /**
   * @method getTeacherContacts
   */
   public getTeacherContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TEACHER_CONTACTS);
  }

  /**
   * @method getTStudentsList
   */
   public getTStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  // /**
  //  * @method getTeacherContactsAdvFilter
  //  */
  // public getTeacherContactsAdvFilter(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_ADVANCE_FLTR
  //   );
  // }

  // /**
  //  * @method getTeacherContactsMoreAdvFltr
  //  */
  // public getTeacherContactsMoreAdvFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_ADV_FLTR
  //   );
  // }

  // /**
  //  * @method getTeacherContactsMoreFltr
  //  */
  // public getTeacherContactsMoreFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_FLTR
  //   );
  // }

  // /**
  //  * @method getTeacherContactsMoreNormalFltr
  //  */
  // public getTeacherContactsMoreNormalFltr(): Observable<any> {
  //   return this.dataService.callGetService(
  //     ServiceUrls.GET_TEACHER_CONTACTS_MORE_NORMAL_FLTR
  //   );
  // }

  /**
   * @method addTeacherContacts
   * @param request
   */
  public addTeacherContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_TEACHER_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteTeacherContacts
   * @param request
   */
  public deleteTeacherContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TEACHER_CONTACTS,
      request
    );
  }

  /**
   * @method editTeacherContacts
   * @param request
   */
  public editTeacherContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_TEACHER_CONTACTS,
      request
    );
  }
}
