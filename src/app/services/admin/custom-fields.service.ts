import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class CustomFieldService {
  constructor(private dataService: DataService) {}

  /**
   * @method getCustomFieldsNameType
   */
  public getCustomFieldsNameType(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_CUSTOM_FIELD_NAME_TYPE);
  }

  /**
   * @method addToCustomFieldsNameType
   * @param request
   */
  public addToCustomFieldsNameType(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.ADD_CUSTOM_FIELD_NAME_TYPE,
      JSON.stringify(request)
    );
  }

  /**
   * @method deleteCustomFieldsNameType
   * @param request
   */
  public deleteCustomFieldsNameType(request: any): Observable<any> {
    return this.dataService.callDeleteService(
      ServiceUrls.DELETE_CUSTOM_FIELD_NAME_TYPE,
      request
    );
  }

  /**
   * @method filterCustomFieldsNameType
   * @param request
   */
  public filterCustomFieldsNameType(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.FILTER_CUSTOM_FIELD_NAME_TYPE,
      request
    );
  }

  /**
   * @method editCustomFieldsNameType
   * @param request
   */
  public editCustomFieldsNameType(request: any): Observable<any> {
    return this.dataService.callPutService(
      ServiceUrls.UPDATE_CUSTOM_FIELD_NAME_TYPE,
      request
    );
  }
}
