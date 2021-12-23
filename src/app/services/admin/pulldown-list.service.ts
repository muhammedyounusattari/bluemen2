import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class PullDownListService {
  constructor(private dataService: DataService) {}

  /**
   * @method getPullDownList
   */
  public getPullDownList(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_PULL_DOWN_LIST);
  }

  /**
   * @method addPullDownList
   * @param request
   */
  public addPullDownList(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_PULL_DOWN_LIST,
      JSON.stringify(request)
    );
  }

  /**
   * @method deletePullDownList
   * @param request
   */
  public deletePullDownList(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_PULL_DOWN_LIST,
      request
    );
  }

  /**
   * @method filterPullDownList
   * @param request
   */
  public filterPullDownList(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.FILTER_PULL_DOWN_LIST,
      request
    );
  }

  /**
   * @method editPullDownList
   * @param request
   */
  public editPullDownList(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_PULL_DOWN_LIST,
      request
    );
  }
}
