import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { ActivityServiceListEnum } from '../../../../constants/enums/activity-service-list.enum';
@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class ServicesListComponent implements OnInit{
    activityServiceData: any = [];
    activityServiceListEnum: ActivityServiceListEnum = new ActivityServiceListEnum();

    requestData: any = {
        activityId: '',
        activityName: '',
        activityGroupName: '',
        lapService: '',
    };
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }

    constructor(private modalService: BsModalService
        , private router: Router
        , private _activityGroupServicesService: ActivityGroupServicesService) { }

    ngOnInit() {
        this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
            if (result) {
                this.activityServiceData = result;
            }
        });
    }

    addNewServiceName() {
        this.requestData.activityId= Number(this.activityServiceListEnum.activityId);
        this.requestData.activityName = this.activityServiceListEnum.activityName;
        this.requestData.activityGroupName = this.activityServiceListEnum.activityGroupName;
        this.requestData.lapService = this.activityServiceListEnum.lapService;
        this._activityGroupServicesService.postActivityServiceList(this.requestData).subscribe(result=>{
            if(result) {
                alert('Saved !');
            }
        });
    }

    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/services-list']);
        }
    }

}