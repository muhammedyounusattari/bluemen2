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
  public getConfigSettings(): Observable<any> {
    return this.dataService.callGetService(
      ServiceUrls.GET_CONFIG_SETTINGS);
  }

  public saveConfigSettings(request:any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.POST_CONFIG_SETTINGS);
  }
}
