import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {DataService} from "../../data-service";
import {ServiceUrls} from "../../../constants/serviceUrl";


@Injectable({
  providedIn: 'root',
})

export class TutorClassesService {
  constructor(private dataService: DataService) {}

  public getTutorClassesList(): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TUTOR_CLASSES);
  }

  public getTutorClassesRecordPerId(id:string): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_TUTOR_CLASSES_PER_RECORD+id);
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
   * @method addTutorClasses
   * @param request
   */
  public addTutorClasses(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.POST_TUTOR_CLASSES,
      JSON.stringify(request));
  }

  /**
   * @method deleteTutorClasses
   * @param request
   */
  public deleteTutorClasses(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_TUTOR_CLASSES,
      request
    );
  }

  /**
   * @method editTutorContacts
   * @param request
   */
  public editTutorContacts(request: any): Observable<any> {
    return this.dataService.callPutService(
      request
    );
  }

 public getTutors():Observable<any> {
      return this.dataService.callGetService(ServiceUrls.GET_STAFF_MEMBERS);
 }
}
