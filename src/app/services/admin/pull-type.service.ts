import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class PullTypeServicesService {
    constructor(private dataService: DataService) {
    }

    getPullTypeList(): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/getPullTypesList/v1';
        return this.dataService.callGetService(URL);
    }

    searchPullTypeList(payload: any): Observable<any> {
        const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/getPullTypesList/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
        return this.dataService.callGetService(URL);
    }

    public updatePullType(request: any): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/updatePullType/v1'
        return this.dataService.callPutService(
            URL,
            JSON.stringify(request)
        );
    }

    downloadPullTypeList(payload: any): Observable<any> {
        const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/downloadPullType/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
        return this.dataService.callGetService(URL);
    }
}