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
        activityBoltService: ''
    };
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
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
        this.requestData.activityBoltService = this.activityServiceListEnum.activityBoltService;
        this._activityGroupServicesService.postActivityServiceList(this.requestData).subscribe(result=>{
            if(result) {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.activityServiceData = result;
                    }
                });
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
    deleteSelectedRow() {
        if(this.selectedRow) {
            const data ={
                activityId: this.selectedRow.activityId
            }
         
            this._activityGroupServicesService.deleteActivityServiceList(data).subscribe(result => {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    if (result) {
                        this.activityServiceData = result;
                    }
                }); 
            });
        }
    }
    setSelectedRow(selectedRowItem: any) {
        const data = this.activityServiceData.filter((item: any) => item.activityId === selectedRowItem.activityId);
        if (data && data.length > 0) {
            this.selectedRow = data[0];
        }
    }
    setSelectedRowToUpdate() {
        this.isEdit = true;
        this.activityServiceListEnum.activityId = this.selectedRow.activityId;
        this.activityServiceListEnum.activityGroupName = this.selectedRow.activityGroupName;
        this.activityServiceListEnum.activityName = this.selectedRow.activityName;
        this.activityServiceListEnum.lapService = this.selectedRow.lapService;
    }
    updateSelectedRow() {
        if(this.selectedRow) {
            this.requestData.activityId= Number(this.activityServiceListEnum.activityId);
            this.requestData.activityName = this.activityServiceListEnum.activityName;
            this.requestData.activityGroupName = this.activityServiceListEnum.activityGroupName;
            this.requestData.lapService = this.activityServiceListEnum.lapService;
            
            this._activityGroupServicesService.updateActivityServiceList(this.requestData).subscribe(result => {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.activityServiceData = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this.activityServiceListEnum = new ActivityServiceListEnum();
    }

}