import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { ActivityGroupListEnum } from '../../../../constants/enums/activity-group-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html',
    styleUrls: ['./service-group-list.component.css']
})

export class ServiceGroupListComponent implements OnInit, AfterViewInit {
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
    @ViewChild('activityServiceGroupListPopup') activityServiceGroupListPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;

    columnsToDisplay: string[] = ['activityGroupId', 'activityGroupName', 'activityReportActivityGroup', 'activityCalculateHoursforActivityGroup'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    activityGroupTypes: any = [{ 'name': 'Count All Contact on Same Day As One Event | 1' },
    { 'name': 'Count All Contact on Same Day As Separate Sessions | 2' }];
    formGroup: FormGroup;
    validationClass: ValidationClass = new ValidationClass();

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService) { }

    ngOnInit() {
        this.createForm();
        this.sharedService.setPageTitle('Activity/Service List');
        this.myElement = window.document.getElementById('loading');
        this.navigateToComponent('service-group-list');
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('Group_Name');
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
            }
        });
    }

    ngAfterViewInit(): void {
        const element = window.document.getElementById('main-section');
        if (element !== null) {
            const height = (window.innerHeight) - 194;
            element.style.minHeight = height + 'px !important';
        }
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'activityGroupId': [''],
            'activityGroupName': ['', Validators.required],
            'activityGroupType': ['', Validators.required],
            'activityCalculateHoursforActivityGroup': [''],
            'activityReportActivityGroup': [''],
            'activityGroupTypeName': ['']
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

    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            // this.activityGrpListEnum.activityGroupId = this.selectedRow.activityGroupId;
            // this.activityGrpListEnum.activityGroupName = this.selectedRow.activityGroupName;
            // this.activityGrpListEnum.activityCalculateHoursforActivityGroup = this.selectedRow.activityCalculateHoursforActivityGroup;
            // this.activityGrpListEnum.activityReportActivityGroup = this.selectedRow.activityReportActivityGroup;
            // this.activityGrpListEnum.activityGroupTypeName = this.selectedRow.activityGroupTypeName;
            // this.activityGrpListEnum.activityGroupType = this.selectedRow.activityGroupType;

            this.formGroup.get('activityGroupId')?.setValue(this.selectedRow.activityGroupId);
            this.formGroup.get('activityGroupName')?.setValue(this.selectedRow.activityGroupName);
            this.formGroup.get('activityCalculateHoursforActivityGroup')?.setValue(this.selectedRow.activityCalculateHoursforActivityGroup);
            this.formGroup.get('activityReportActivityGroup')?.setValue(this.selectedRow.activityReportActivityGroup);
            this.formGroup.get('activityGroupTypeName')?.setValue(this.selectedRow.activityGroupTypeName);
            this.formGroup.get('activityGroupType')?.setValue(this.selectedRow.activityGroupType);
            this.openModal(this.activityServiceGroupListPopupRef);
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

    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.activityGrpListEnum = new ActivityGroupListEnum();
        this._activityGroupServicesService.getActivityGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('activityGroupId')?.setValue(result + 1);
                // this.activityGrpListEnum.activityGroupId = result + 1;
            } else {
                this.formGroup.get('activityGroupId')?.setValue(1);
            }
            this.openModal(this.activityServiceGroupListPopupRef);
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
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
    }

    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    addNewGroupName() {
        if (this.formGroup.valid) {
            this.showLoader();
            // this.requestData.activityGroupId = this.activityGrpListEnum.activityGroupId;
            // this.requestData.activityGroupName = this.activityGrpListEnum.activityGroupName;
            // this.requestData.activityCalculateHoursforActivityGroup = this.activityGrpListEnum.activityCalculateHoursforActivityGroup;
            // this.requestData.activityReportActivityGroup = this.activityGrpListEnum.activityReportActivityGroup;
            // this.requestData.activityGroupTypeName = this.activityGrpListEnum.activityGroupTypeName;
            // this.requestData.activityGroupType = this.activityGrpListEnum.activityGroupType;
            // this.requestData.activityAdd = '';
            // this.requestData.activityBoltService = '';

            this.requestData.activityGroupId = this.formGroup?.get('activityGroupId')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup?.get('activityCalculateHoursforActivityGroup')?.value;
            this.requestData.activityReportActivityGroup = this.formGroup?.get('activityReportActivityGroup')?.value;
            this.requestData.activityGroupTypeName = this.formGroup?.get('activityGroupTypeName')?.value;
            this.requestData.activityGroupType = this.formGroup?.get('activityGroupType')?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';

            this._activityGroupServicesService.postActivityGroupList(this.requestData).subscribe(result => {
                if (result) {
                    this.modalRef.hide();
                    this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;

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
                activityGroupId: this.selectedRow.activityGroupId
            }
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm remove record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.activityGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._activityGroupServicesService.deleteActivityGroupList(data).subscribe(result => {
                        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                            this.hideLoader();
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.selectedRowIndex = null;
                                this.selectedRow = null;
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
        if (this.selectedRow && this.formGroup.valid) {
            this.showLoader();
            // this.requestData.activityGroupId = this.activityGrpListEnum.activityGroupId;
            // this.requestData.activityGroupName = this.activityGrpListEnum.activityGroupName;
            // this.requestData.activityCalculateHoursforActivityGroup = this.activityGrpListEnum.activityCalculateHoursforActivityGroup;
            // this.requestData.activityReportActivityGroup = this.activityGrpListEnum.activityReportActivityGroup;
            // this.requestData.activityGroupTypeName = this.activityGrpListEnum.activityGroupTypeName;
            // this.requestData.activityGroupType = this.activityGrpListEnum.activityGroupType;
            // this.requestData.activityAdd = '';
            // this.requestData.activityBoltService = '';

            this.requestData.activityGroupId = this.formGroup?.get('activityGroupId')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup?.get('activityCalculateHoursforActivityGroup')?.value;
            this.requestData.activityReportActivityGroup = this.formGroup?.get('activityReportActivityGroup')?.value;
            this.requestData.activityGroupTypeName = this.formGroup?.get('activityGroupTypeName')?.value;
            this.requestData.activityGroupType = this.formGroup?.get('activityGroupType')?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.updateActivityGroupList(this.requestData).subscribe(response => {
                this.modalRef.hide();
                this.selectedRow = null;
                this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }
}