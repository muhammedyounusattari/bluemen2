import { Component, AfterViewInit, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'app-admin-customize',
    templateUrl: './admin-customize.component.html',
    styleUrls: ['./admin-customize.component.css']
})

export class AdminCustomizeComponent implements AfterViewInit, OnInit {
    constructor(private sharedService: SharedService) {
    }
    ngOnInit(): void {
        this.sharedService.setPageTitle('Customize');
    }
    ngAfterViewInit(): void {
        this.sharedService.setPageTitle('Customize');
    }
}
