import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    private errorMessage = new Subject<any>();
    private successMessage = new Subject<any>();
    private infoMessage = new Subject<any>();
    private pageTitle = new Subject<any>();
    private userInfo = null;

    showErrorMessage() {
        let className = document.getElementsByClassName('validation-error')[0].className;
        if (className != null) {
            document.getElementsByClassName('validation-error')[0].className = className.concat(" active");
        }

        setTimeout(function () {
            document.getElementsByClassName('validation-error')[0].className = 'validation-error'
        }, 5000);
    }

    showSuccessMessage() {
        let className = document.getElementsByClassName('validation-success')[0].className;
        if (className != null) {
            document.getElementsByClassName('validation-success')[0].className = className.concat(" active");
        }
        setTimeout(function () {
            document.getElementsByClassName('validation-success')[0].className = 'validation-success'
        }, 5000);
    }

    showInfoMessage() {
        let className = document.getElementsByClassName('validation-info')[0].className;
        if (className != null) {
            document.getElementsByClassName('validation-info')[0].className = className.concat(" active");
        }
        setTimeout(function () {
            document.getElementsByClassName('validation-info')[0].className = 'validation-info'
        }, 5000);
    }

    sendErrorMessage(message: string) {
        this.errorMessage.next({ text: message });
    }

    sendSuccessMessage(message: string) {
        this.successMessage.next({ text: message });
    }

    sendInfoMessage(message: string) {
        this.infoMessage.next({ text: message });
    }

    getErrorMessage(): Observable<any> {
        return this.errorMessage.asObservable();
    }

    getSuccessMessage(): Observable<any> {
        return this.successMessage.asObservable();
    }

    getInfoMessage(): Observable<any> {
        return this.infoMessage.asObservable();
    }

    clearMessage() {
        this.errorMessage.next();
        this.successMessage.next();
        this.infoMessage.next();
        this.pageTitle.next();
    }

    setPageTitle(pageTitle: string) {
        this.pageTitle.next({ text: pageTitle });
    }

    getPageTitle() {
        return this.pageTitle.asObservable();
    }

    setUserInformation(userInfo:any) {
        this.userInfo = userInfo;
    }
 
    getUserInformation() {
        return this.userInfo;
    }

    isSuperAdmin(): boolean {
        let user: any = '';
        user = sessionStorage.getItem('state');
        if(user) {
            user = JSON.parse(user);
            if (user.roleName == 'Super Admin') {
                return true;
            }
        } 
        return false;
    }

    getOrgId(): number|undefined {
        let user: any = '';
        user = sessionStorage.getItem('state');
        if(user) {
            user = JSON.parse(user);
            return user.orgId;
        } 
        return undefined;
    }

    getEmail(): string|undefined {
        let user: any = '';
        user = sessionStorage.getItem('username');
        if(user) { 
            return user;
        } 
        return undefined;
    }
}