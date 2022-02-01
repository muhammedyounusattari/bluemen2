import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class LabSettingsPreferencesService {
    constructor(private dataService: DataService) {
    }

    getLabSettingsPreferencesData(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_LAB_SETTINGS_PREFERENCES, '');
    }

    postLabSettingsPreferences(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_LAB_SETTINGS_PREFERENCES, request);
    }

    public getPullDownList(): Observable<any> {
        return this.dataService.callGetService(
            ServiceUrls.GET_PULL_DOWN_LIST);
    }

    public getPullDownItems(id: any): Observable<any> {
        return this.dataService.callGetService(
            ServiceUrls.GET_PULL_DOWN_ITEMS + id);
    }
}