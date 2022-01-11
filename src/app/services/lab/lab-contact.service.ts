import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class LabContactService {

  constructor(private dataService: DataService) {}

  /**
   * @method getLabContacts
   */
  public getLabContacts(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_LAB_CONTACTS);
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

  /**
   * @method addLabContacts
   * @param request
   */
  public addLabContacts(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_LAB_CONTACTS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteLabContacts
   * @param request
   */
  public deleteLabContacts(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_LAB_CONTACTS,
      request
    );
  }

  /**
   * @method editLabContacts
   * @param request
   */
  public editLabContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      // ServiceUrls.UPDATE_LabContacts_LIST,
      request
    );
  }
}
