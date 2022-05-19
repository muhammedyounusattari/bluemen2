import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PullTypeServicesService {
    constructor(private dataService: DataService, private http: HttpClient, private config: Config) {
    }

    getPullTypeList(): Observable<any> {
        const URL = environment.apiUrl + '/blumen-api/admin/home/getPullTypesList/v1';
        return this.dataService.callGetService(URL);
    }

    searchPullTypeList(payload: any): Observable<any> {
        const URL = environment.apiUrl + `/blumen-api/admin/home/getPullTypesList/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
        return this.dataService.callGetService(URL);
    }

    public updatePullType(request: any): Observable<any> {
        const URL = environment.apiUrl + '/blumen-api/admin/home/updatePullType/v1'
        return this.dataService.callPutService(
            URL,
            JSON.stringify(request)
        );
    }

    // downloadPullTypeList(payload: any): Observable<any> {
    //     debugger;
    //     const URL = `http://localhost:8080/api/blumen-api/admin/home/downloadPullType/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
    //     return this.dataService.callGetService(URL);
    // }
    downloadPullTypeList(payload: any): Observable<any> {
        const URL = environment.apiUrl + `/blumen-api/admin/home/downloadPullType/v1?description=${payload.filterDescription}&programType=${payload.filterProgramType}&pullType=${payload.filterPullType}`;
        return this.http.get<any>(URL, { observe: 'response', headers:this.config.getHeader(), responseType: 'blob' as 'json' });
    }
}