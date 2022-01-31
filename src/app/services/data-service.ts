import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { observable, Observable } from 'rxjs';
import { Config } from 'src/app/config/config';
@Injectable({
    providedIn: 'root'
})

export class DataService {
    constructor(private http: HttpClient, private config: Config) {
    }

    callGetService(url: string, ...request: any): Observable<any> {
        try {
            const response = this.http.get(url , {headers:this.config.getHeader()}).pipe(tap(response => {
                const res: any = response;
            }, error => {

            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }

    callPostService(url: string, ...request: any): Observable<any> {

        try {
            const response = this.http.post(url, request ? request[0] : '', {
                headers: this.config.getHeader(),
                responseType: 'text'
            }).pipe(tap(response => {
            }, error => {
            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }

    callPutService(url: string, ...request: any): Observable<any> {
        try {

            const response = this.http.put(url, request ? request[0] : 0, {
                headers: this.config.getHeader(),
                responseType: 'text'
            }).pipe(tap(response => {
            }, error => {
            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }
    callDeleteService(url: string, ...request: any): Observable<any> {
        const response = this.http.request('DELETE', url, {
            headers: this.config.getHeader(),
            body: request[0]
          });
          return response;
    }

    /* Call for post service won't have headers
    */
     callLoginPostService(url: string, ...request: any): Observable<any> {

            try {
                const response = this.http.post(url, request ? request[0] : '', {
                    responseType: 'text'
                }).pipe(tap(response => {
                }, error => {
                }));
                return response;
            } catch (error) {
                return new Observable<any>();
            }
        }

}
