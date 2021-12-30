import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { ActivityServiceListEnum } from '../../../../constants/enums/activity-service-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class ServicesListComponent implements OnInit {
    activityServiceData: any = [];
    activityServiceListEnum: ActivityServiceListEnum = new ActivityServiceListEnum();

    requestData: any = {
        activityId: '',
        activityName: '',
        activityGroupName: '',
        lapService: true,
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
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _activityGroupServicesService: ActivityGroupServicesService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('Service_Name');
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.activityServiceData = result;
            }
        });
    }

    addNewServiceName() {
        this.showLoader();
        this.requestData.activityId = Number(this.activityServiceListEnum.activityId);
        this.requestData.activityName = this.activityServiceListEnum.activityName;
        this.requestData.activityGroupName = this.activityServiceListEnum.activityGroupName;
        this.requestData.lapService = this.activityServiceListEnum.lapService;
        this.requestData.activityBoltService = this.activityServiceListEnum.activityBoltService;
        this._activityGroupServicesService.postActivityServiceList(this.requestData).subscribe(result => {
            document.getElementById('closePopup')?.click();
            if (result) {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
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
        if (this.selectedRow) {
            const data = {
                activityId: this.selectedRow.activityId
            }
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.activityName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._activityGroupServicesService.deleteActivityServiceList(data).subscribe(result => {
                        this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.activityServiceData = result;
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        }
    }
    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
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
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.activityId = Number(this.activityServiceListEnum.activityId);
            this.requestData.activityName = this.activityServiceListEnum.activityName;
            this.requestData.activityGroupName = this.activityServiceListEnum.activityGroupName;
            this.requestData.lapService = this.activityServiceListEnum.lapService;

            this._activityGroupServicesService.updateActivityServiceList(this.requestData).subscribe(result => {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    document.getElementById('closePopup')?.click();
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.activityServiceData = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this.isEdit = false;
        this.activityServiceListEnum = new ActivityServiceListEnum();
        this._activityGroupServicesService.getActivityServiceMaxId().subscribe(result => {
            if(result) {
                this.activityServiceListEnum.activityId = result + 1;
            }
        });
    }
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.myElement.style.display = 'none';
        }
    }
    showLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = true;
            this.myElement.style.display = 'block';
        }
    }
}