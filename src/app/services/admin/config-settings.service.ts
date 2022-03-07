import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class ConfigSettingsService {
  constructor(private dataService: DataService) {}

  /**
   * @method getConfigSettings
   */
  public getConfigSettings(username:string, releamId:string): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_CONFIG_SETTINGS+'/'+releamId+'?user='+username);
  }

  public saveConfigSettings(request:any): Observable<any> {
    return this.dataService.callPostService(ServiceUrls.POST_CONFIG_SETTINGS,request);
  }

  public getUserList(username:string): Observable<any> {
    const URL = ServiceUrls.GET_USER_LIST+username+'/userList/v1';
    return this.dataService.callGetService(URL);
  }

  public getConfigUserSettings(user:string): Observable<any> {
    const url = ServiceUrls.GET_CONFIG_SETTINGS+'/mumbai-university?user='+user;
    return this.dataService.callGetService(url);
  }
}
