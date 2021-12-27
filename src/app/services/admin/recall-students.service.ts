import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class RecallStudentsService {
  constructor(private dataService: DataService) {}

  /**
   * @method getRecallStudentsList
   */
  public getRecallStudentsList(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_RECALL_STUDENTS_LIST);
  }

  /**
   * @method addRecallStaffMembers
   * @param request
   */
  public addRecallStaffMembers(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STAFF_MEMBERS,
      request);
  }

  /**
   * @method deleteRecallStaffMembers
   * @param request
   */
   public deleteRecallStaffMembers(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STAFF_MEMBERS,
      request
    );
  }

  /**
   * @method filterRecallStaffMembers
   * @param request
   */
  public filterRecallStaffMembers(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.FILTER_STAFF_MEMBERS,
      request
    );
  }

  /**
   * @method editRecallStaffMembers
   * @param request
   */
  public editRecallStaffMembers(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STAFF_MEMBERS,
      request
    );
  }

}
