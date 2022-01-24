import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class AttendaceLogService {
  constructor(private dataService: DataService) {}

  /**
   * @method getStudentsList
   */
  public getStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  /**
   * @method getAttendanceLog
   */
   public getAttendanceLog(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENT_ATTENDANCE_LOG);
  }

  /**
   * @method addAttendanceLog
   * @param request
   */
  public addAttendanceLog(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STUDENT_ATTENDANCE_LOG,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteAttendanceLog
   * @param request
   */
  public deleteAttendanceLog(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STUDENT_ATTENDANCE_LOG,
      request
    );
  }

  /**
   * @method editAttendanceLog
   * @param request
   */
  public editAttendanceLog(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STUDENT_ATTENDANCE_LOG,
      request
    );
  }
}
