import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class OrgAdminPullDownListsService {
    constructor(private dataService: DataService) {
    }

    public getPullTypeList(val: number): Observable<any> {
        const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/getPullTypesListByOrgId/v1?orgId=${val}`;
        return this.dataService.callGetService(URL);
    }

    public searchOriginalPullDownLists(payload: any): Observable<any> {
        const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/customize/getPullDownMaster/v1?orgId=${payload.orgId}&pullType=${payload.pullType}`;
        return this.dataService.callGetService(URL);
    }

    public saveOriginalPullDownListsData(requestObj: any):  Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/customize/savePullDownMaster/v1'
        return this.dataService.callPostService(URL, requestObj);
    }

    public deleteOriginalPullDownListsData(request: any): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/customize/deletePullDownMaster/v1'
        return this.dataService.callDeleteService(URL, request);
    }

    public updateOriginalPullDownListsData(request: any): Observable<any> {
        const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/customize/updatePullDownMaster/v1'
        return this.dataService.callPutService(URL, request);
    }

    public getProjType(val: any): Observable<any> {
        const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/getProjType/v1?orgId=${val}`;
        return this.dataService.callGetService(URL);
    }
    
    // public updatePullType(request: any): Observable<any> {
    //     const URL = 'https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/updatePullType/v1'
    //     return this.dataService.callPutService(
    //         URL,
    //         JSON.stringify(request)
    //     );
    // }

    // downloadPullTypeList(payload: any): Observable<any> {
    //     const URL = `https://blumen-api.azurewebsites.net/api/blumen-api/admin/home/downloadPullType/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
    //     return this.dataService.callGetService(URL);
    // }
}