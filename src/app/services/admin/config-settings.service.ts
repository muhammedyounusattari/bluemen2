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
  public getConfigSettings(username:string): Observable<any> {
    return this.dataService.callGetService(ServiceUrls.GET_CONFIG_SETTINGS+'/'+username);
  }

  public saveConfigSettings(request:any): Observable<any> {
    return this.dataService.callPostService(ServiceUrls.POST_CONFIG_SETTINGS,request);
  }

  public getUserList(): Observable<any> {
    const orgId = sessionStorage.getItem("orgId");
    if(!orgId){
     alert("Please logout and login again")
     return new Observable;
    }
    return this.dataService.callGetService(ServiceUrls.GET_ORG_BASED_USER_LIST+'/'+orgId);
  }

  public getConfigUserSettings(user:string): Observable<any> {
    const url = ServiceUrls.GET_CONFIG_SETTINGS+'/mumbai-university/'+user;
    return this.dataService.callGetService(url);
  }
}
