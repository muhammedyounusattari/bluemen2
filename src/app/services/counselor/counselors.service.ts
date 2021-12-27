import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class CounselorsService {
  constructor(private dataService: DataService) {}

  /**
   * @method getCounselors
   */
  public getCounselors(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_COUNSELORS);
  }

  /**
   * @method addCounselors
   * @param request
   */
  public addCounselors(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_COUNSELORS,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteCounselors
   * @param request
   */
  public deleteCounselors(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_COUNSELORS,
      request
    );
  }

  /**
   * @method filterCounselors
   * @param request
   */
  public filterCounselors(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.FILTER_COUNSELORS,
      request
    );
  }

  /**
   * @method editCounselors
   * @param request
   */
  public editCounselors(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_COUNSELORS_LIST,
      request
    );
  }
}
