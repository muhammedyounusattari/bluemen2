import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class SystemPreferencesService {
    constructor(private dataService: DataService) {
    }

    getSystemPreferencesData(): Observable<any> {
        return this.dataService.callGetService(ServiceUrls.GET_SYSTEM_PREFERENCES, '');
    }

    postSystemPreferences(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_SYSTEM_PREFERENCES, request);
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