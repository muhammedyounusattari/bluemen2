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
  public addPullDownList(pullDownType:string, payload:any): Observable<any> {
    const URL = ServiceUrls.ADD_PULL_DOWN_LIST+"/"+pullDownType;
    return this.dataService.callPostService(URL, JSON.stringify(payload));
  }

  /**
   * @method addPullDownList
   * @param request
   */
  public addNonNumericPullDownList(pullDownType:string, payload:any): Observable<any> {
    const URL = ServiceUrls.ADD_NON_NUMERIC_PULL_DOWN_LIST+"/"+pullDownType;
    return this.dataService.callPostService(URL, JSON.stringify(payload));
  }

  /**
   * @method updatePullDownList
   * @param request
   */
  public updatePullDownList(pullDownType:string, payload:any): Observable<any> {
    return this.dataService.callPutService(ServiceUrls.UPDATE_PULL_DOWN_ITEM, JSON.stringify(payload));
  }


  /**
   * @method deletePullDownList
   * @param request
   */
  public deletePullDownList(pullDownType:string, request: any): Observable<any> {
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

  public getPullDownItems(id:any): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_PULL_DOWN_ITEMS+id);
  }

  public getPullDownItem(id:any): Observable<any> {
      return this.dataService.callGetService(
        ServiceUrls.GET_PULL_DOWN_ITEM+id);
    }

  public getPullDownIdValidated(pullDownId:string, pullDownType:string): Observable<any> {
    const URL = ServiceUrls.GET_PULL_DOWN_ID_VALIDATE+"/"+pullDownId+"/"+pullDownType;
    return this.dataService.callGetService(URL);
  }

  public getMultiplePulldownListByCode(code:any): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_MULTIPLE_PULL_DOWN_LIST+"/"+code);
  }

  // public getMultiPullDownMaster(pullType: any): Observable<any> {
  //   let orgId= 0;
  //   let projtype= 7;
  //   return this.dataService.callGetService(ServiceUrls.GET_MULTIPLE_PULL_DOWN_MASTER_LIST+"/"+orgId+"/"+projtype+"/"+pullType);
  // }

  


}
