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

    postLabSettingsPreferences(request: any): Observable<any> {
        return this.dataService.callPostService(ServiceUrls.POST_LAB_SETTINGS_PREFERENCES, request);
    }
}