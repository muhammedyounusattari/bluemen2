import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class CustomFieldValueService {
  constructor(private dataService: DataService) {}

  /**
   * @method getCustomFieldValuesList
   */
  public getCustomFieldValuesList(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_CUSTOM_FIELD_VALUE_LIST+'/mumbai-university?user=mumbai-university');
  }

  /**
   * @method getOkToContinueCustomFieldValueList
   */
   public getOkToContinueCustomFieldValueList(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_CONTINUE_CUSTOM_FIELD_VALUE_LIST);
  }

  /**
   * @method addCustomField
   * @param request
   */
  public addCustomField(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_CUSTOM_FIELD_VALUE,
      JSON.stringify(request)
    );
  }

  /**
   * @method clickFinishCustomFieldValueList
   * @param request
   */
  public clickFinishCustomFieldValueList(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_FINISH_CUSTOM_FIELD_VALUE,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteCustomField
   * @param request
   */
  public deleteCustomField(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_CUSTOM_FIELD_VALUE,
      request
    );
  }
}
