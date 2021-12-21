import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { observable, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DataService {
    constructor(private http: HttpClient) {
    }

    callGetService(url: string, ...request: any): Observable<any> {
        try {
            const response = this.http.get(url , request ? request[0] : '').pipe(tap(response => {
                const res: any = response;
            }, error => {
                
            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }

    callPostService(url: string, ...request: any): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        headers.set("Accept", "application/json");
        try {
            const response = this.http.post(url, request ? request[0] : '', {
                headers: headers,
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
            const response = this.http.put(url, request ? request[0] : 0).pipe(tap(response => {
            }, error => {
            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }
    callDeleteService(url: string, ...request: any): Observable<any> {
        try {
            const response = this.http.delete(url, request ? request[0] : 0).pipe(tap(response => {
            }, error => {
            }));
            return response;
        } catch (error) {
            return new Observable<any>();
        }
    }
}
