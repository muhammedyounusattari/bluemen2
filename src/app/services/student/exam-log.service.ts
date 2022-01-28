import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class ExamLogService {
  constructor(private dataService: DataService) {}

  /**
   * @method getStudentsList
   */
  public getStudentsList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENTS_LIST);
  }

  /**
   * @method getExamLog
   */
   public getExamLog(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_STUDENT_EXAM_LOG);
  }

  /**
   * @method addExamLog
   * @param request
   */
  public addExamLog(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_STUDENT_EXAM_LOG,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteExamLog
   * @param request
   */
  public deleteExamLog(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_STUDENT_EXAM_LOG,
      request
    );
  }

  /**
   * @method editExamLog
   * @param request
   */
  public editExamLog(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_STUDENT_EXAM_LOG,
      request
    );
  }
}
