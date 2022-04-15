import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
    providedIn: 'root'
})

export class RolesService {
    constructor(private dataService: DataService) {
    }

    getRolesList() {
        return this.dataService.callGetService(ServiceUrls.GET_ROLES_LIST, '');
    }
}