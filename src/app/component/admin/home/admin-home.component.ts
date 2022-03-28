import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})

export class AdminHomeComponent implements OnInit {
    constructor(private sharedService: SharedService) {}
    ngOnInit(): void {
        this.sharedService.setPageTitle('Home');
    }    
}
