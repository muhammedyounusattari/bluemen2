import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { ActivityServiceListEnum } from '../../../../constants/enums/activity-service-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
    @ViewChild('activityServiceListPopup') activityServiceListPopupRef: TemplateRef<any>;
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
    columnsToDisplay: string[] = ['activityId', 'activityName', 'activityGroupName', 'lapService'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    public isLoading: boolean = true;

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
                this.dataSource = new MatTableDataSource(result);
                this.selectedRowIndex = null;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }

    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/services-list']);
        }
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.activityServiceListEnum.activityId = this.selectedRow.activityId;
            this.activityServiceListEnum.activityGroupName = this.selectedRow.activityGroupName;
            this.activityServiceListEnum.activityName = this.selectedRow.activityName;
            this.activityServiceListEnum.lapService = this.selectedRow.lapService;
            this.openModal(this.activityServiceListPopupRef);
        } else {
            alert('Please select a row to update.')
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    resetFields() {
        this.isEdit = false;
        this.activityServiceListEnum = new ActivityServiceListEnum();
        this._activityGroupServicesService.getActivityServiceMaxId().subscribe(result => {
            if (result) {
                this.activityServiceListEnum.activityId = result + 1;
            }
            this.openModal(this.activityServiceListPopupRef);
        });
    }

    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    showLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
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
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                });
            }
        });
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
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            alert('Please select a row to delete.')
        }
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
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
}