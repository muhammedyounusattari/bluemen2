import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { ServiceListMoveBoxComponent } from '../../customize/move-box/service-list-move-box/service-list-move-box.component';
import { ServiceListMergeBoxComponent } from '../../customize/merge-box/service-list-merge-box/service-list-merge-box.component';
import { jsPDF } from "jspdf";

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.css']
})

export class ServicesListComponent implements OnInit {
    activityServiceData: any = [];

    requestData: any = {
        id:'',
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
    columnsToDisplay: string[]  = ['id', 'activityName', 'activityGroupName', 'lapService'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    public isLoading: boolean = true;
    activityGroup: any;
    formGroup: FormGroup;
    validationClass: ValidationClass = new ValidationClass();

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private toastr: ToastrService
        , private sharedService: SharedService , private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.sharedService.setPageTitle('Activity/Service List');
        this.createForm();
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
                this.activityServiceData = result;
            }
        });
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            if (result) {
                this.activityGroup = result;
            }
        });
    }

    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/customize/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/customize/services-list']);
        }
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'id':[''],
            'activityId': [''],
            'activityGroupName': ['', Validators.required],
            'activityName': ['', Validators.required],
            'lapService': ['']
        });
    }

    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.formGroup.get('id')?.setValue(this.selectedRow.id);
            this.formGroup.get('activityId')?.setValue(this.selectedRow.activityId);
            this.formGroup.get('activityGroupName')?.setValue(this.selectedRow.activityGroupName);
            this.formGroup.get('activityName')?.setValue(this.selectedRow.activityName);
            this.formGroup.get('lapService')?.setValue(this.selectedRow.lapService);
            this.openModal(this.activityServiceListPopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
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
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        this._activityGroupServicesService.getActivityServiceMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
                // this._gradeGroupStandingList.gradeGroupId = result + 1;
            } else {
                this.formGroup.get('id')?.setValue(1);
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
        if (this.formGroup.valid) {
        this.requestData.id = this.formGroup?.get('id')?.value;
        this.requestData.activityId = this.formGroup?.get('activityId')?.value;
        this.requestData.activityName = this.formGroup?.get('activityName')?.value;
        this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
        this.requestData.lapService = this.formGroup?.get('lapService')?.value;
        //this.requestData.activityBoltService = this.formGroup?.get('activityBoltService')?.value;
        this.showLoader();
        this._activityGroupServicesService.postActivityServiceList(this.requestData).subscribe(result => {
            this.modalRef.hide();
            if (result) {
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.activityServiceData = result;
                        this.toastr.success('Saved successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            }
        });
    } else {
        this.formGroup.markAllAsTouched();
    }
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                activityId: this.selectedRow.activityId
            }
            //this.showLoader();
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
                                this.selectedRow = null;
                                this.activityServiceData = result;
                                this.toastr.success('Deleted successfully!', '', {
                                    timeOut: 5000,
                                    closeButton: true
                                });
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    updateSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.activityId = this.formGroup?.get('activityId')?.value;
            this.requestData.activityName = this.formGroup?.get('activityName')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.lapService = this.formGroup?.get('lapService')?.value;
            //this.requestData.activityBoltService = this.formGroup?.get('activityBoltService')?.value;
            this._activityGroupServicesService.updateActivityServiceList(this.requestData).subscribe(result => {
                this.modalRef.hide();
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.isEdit = false;
                        this.selectedRow = null;
                        this.activityServiceData = result;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        }
    }

    showMoveItemPopup(){
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(ServiceListMoveBoxComponent, {
                data: {
                    title: 'Customize Service and Activity Name',
                    message: '',
                    activityList :this.activityServiceData,
                    selectedActivityId: this.selectedRow.activityId,
                    selectedId: this.selectedRow.id,
                    selectedActivityName: this.selectedRow.activityName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this.showLoader();
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.activityServiceData = result;
                    }
                });
            }
            });
        } else {
            this.toastr.info('Please select a row to move', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    showMergeItemPopup(){
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(ServiceListMergeBoxComponent, {
                data: {
                    title: 'Customize Service and Activity Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.activityGroupName,
                    activityList :this.activityServiceData,
                    selectedActivityId: this.selectedRow.activityId,
                    selectedId: this.selectedRow.id,
                    selectedActivityName: this.selectedRow.activityName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.activityServiceData = result;
                    }
                });
            }
            });
        } else {
            this.toastr.info('Please select a row to merge', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    printData(){
        const doc = new jsPDF();

        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
    }



}