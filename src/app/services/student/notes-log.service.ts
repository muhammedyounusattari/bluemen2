import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class NotesLogService {
  constructor(private dataService: DataService) {}

  /**
   * @method getStudentsList
   */
  public getStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  /**
   * @method getNotesLog
   */
   public getNotesLog(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENT_NOTES_LOG);
  }

  /**
   * @method addNotesLog
   * @param request
   */
  public addNotesLog(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STUDENT_NOTES_LOG,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteNotesLog
   * @param request
   */
  public deleteNotesLog(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STUDENT_NOTES_LOG,
      request
    );
  }

  /**
   * @method editNotesLog
   * @param request
   */
  public editNotesLog(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STUDENT_NOTES_LOG,
      request
    );
  }
}
