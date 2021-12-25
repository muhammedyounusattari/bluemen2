import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { ActivityGroupListEnum } from '../../../../constants/enums/activity-group-list.enum';

@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class ServiceGroupListComponent implements OnInit {
    activityGroupData: any = [];
    activityGrpListEnum: ActivityGroupListEnum = new ActivityGroupListEnum();
    requestData: any = {
        activityGroupId: '',
        activityGroupName: '',
        activityCalculateHoursforActivityGroup: true,
        activityReportActivityGroup: true,
        activityGroupTypeName: '',
        activityGroupType: '',
        activityAdd: '',
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
    myElement : any = null;

    constructor(private modalService: BsModalService
        , private router: Router
        , private _activityGroupServicesService: ActivityGroupServicesService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this.navigateToComponent('service-group-list');
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.activityGroupData = result;
            }
        });
    }
    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    addNewGroupName() {
        this.showLoader();
        this.requestData.activityGroupId = this.activityGrpListEnum.activityGroupId;
        this.requestData.activityGroupName = this.activityGrpListEnum.activityGroupName;
        this.requestData.activityCalculateHoursforActivityGroup = this.activityGrpListEnum.activityCalculateHoursforActivityGroup;
        this.requestData.activityReportActivityGroup = this.activityGrpListEnum.activityReportActivityGroup;
        this.requestData.activityGroupTypeName = this.activityGrpListEnum.activityGroupTypeName;
        this.requestData.activityGroupType = this.activityGrpListEnum.activityGroupTypeName;
        this.requestData.activityAdd = '';
        this.requestData.activityBoltService = '';
        this._activityGroupServicesService.postActivityGroupList(this.requestData).subscribe(result => {
            if (result) {
                document.getElementById('closePopup')?.click();
                this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.activityGroupData = result;
                    }
                });
            }
        })
    }

    setSelectedRow(selectedRowItem: any) {
        const data = this.activityGroupData.filter((item: any) => item.activityGroupId === selectedRowItem.activityGroupId);
        if (data && data.length > 0) {
            this.selectedRow = data[0];
        }
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
                activityGroupId: this.selectedRow.activityGroupId
            }
            this.showLoader();
            this._activityGroupServicesService.deleteActivityGroupList(data).subscribe(result => {
                this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.activityGroupData = result;
                    }
                });
            });
        }
    }
    setSelectedRowToUpdate() {
        this.isEdit = true;
        this.activityGrpListEnum.activityGroupId = this.selectedRow.activityGroupId;
        this.activityGrpListEnum.activityGroupName = this.selectedRow.activityGroupName;
        this.activityGrpListEnum.activityCalculateHoursforActivityGroup = this.selectedRow.activityCalculateHoursforActivityGroup;
        this.activityGrpListEnum.activityReportActivityGroup = this.selectedRow.activityReportActivityGroup;
        this.activityGrpListEnum.activityGroupTypeName = this.selectedRow.activityGroupTypeName;
        this.activityGrpListEnum.activityGroupType = this.selectedRow.activityGroupType;
    }
    updateSelectedRow() {
        if(this.selectedRow) {
            this.showLoader();
            this.requestData.activityGroupId = this.activityGrpListEnum.activityGroupId;
            this.requestData.activityGroupName = this.activityGrpListEnum.activityGroupName;
            this.requestData.activityCalculateHoursforActivityGroup = this.activityGrpListEnum.activityCalculateHoursforActivityGroup;
            this.requestData.activityReportActivityGroup = this.activityGrpListEnum.activityReportActivityGroup;
            this.requestData.activityGroupTypeName = this.activityGrpListEnum.activityGroupTypeName;
            this.requestData.activityGroupType = this.activityGrpListEnum.activityGroupTypeName;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.updateActivityGroupList(this.requestData).subscribe(response => {
                document.getElementById('closePopup')?.click();
                this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                         this.activityGroupData = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this.activityGrpListEnum = new ActivityGroupListEnum();
    }
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if(this.myElement !== null) {
            this.myElement.style.display = 'none';
        }
    }
    showLoader() {
        if(this.myElement !== null) {
            this.myElement.style.display = 'block';
        }
    }
}