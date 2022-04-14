import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ServiceGroupListMoveBoxComponent } from '../../customize/move-box/service-group-list-move-box/service-group-list-move-box.component';
import { ServiceGroupListMergeBoxComponent } from '../../customize/merge-box/service-group-list-merge-box/service-group-list-merge-box.component';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';

@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html',
    styleUrls: ['./service-group-list.component.css']
})
/**
 * ServiceGroupList Component 
 */
export class ServiceGroupListComponent implements OnInit, AfterViewInit {
    activityGroupData: any = [];
    requestData: any = {
        id: '',
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
    columnsToDisplay: string[] = ['id', 'activityGroupName', 'activityReportActivityGroup', 'activityCalculateHoursforActivityGroup'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    activityGroupTypes: any = [];
    formGroup: FormGroup;
    validationClass: ValidationClass = new ValidationClass();

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService: PullDownListService) { }

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
                this.activityGroupData = result;
            }
        });
        this.bindDropDownValues();
    }

    ngAfterViewInit(): void {
        const element = window.document.getElementById('main-section');
        if (element !== null) {
            const height = (window.innerHeight) - 194;
            element.style.minHeight = height + 'px !important';
        }
    }

    /**
    * @method createForm
    * @description declare the form fileds
    */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [''],
            'activityGroupId': [''],
            'activityGroupName': ['', Validators.required],
            'activityGroupType': ['' , Validators.required],
            'activityCalculateHoursforActivityGroup': [''],
            'activityReportActivityGroup': [''],
            'activityGroupTypeName': ['']
        });
    }

    /**
    * @method navigateToComponent
    * @description navigate the service group list companant
    */
    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/customize/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/customize/services-list']);
        }
    }

    /**
    * @method applyFilter
    * @description search the text from list
    */
    applyFilter(filterValue: any) {
        if(filterValue.target.value.trim().toLowerCase() == 'no'){
            this.dataSource.filter = 'false';
        }else if(filterValue.target.value.trim().toLowerCase() == 'yes'){
            this.dataSource.filter = 'true';
        }else{
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        }
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
   * @method setValuesToUpdate
   * @description Set the select row values in formgroup
   */
    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.formGroup.get('id') ?.setValue(this.selectedRow.id);
            this.formGroup.get('activityGroupId') ?.setValue(this.selectedRow.activityGroupId);
            this.formGroup.get('activityGroupName') ?.setValue(this.selectedRow.activityGroupName);
            this.formGroup.get('activityCalculateHoursforActivityGroup') ?.setValue(this.selectedRow.activityCalculateHoursforActivityGroup);
            this.formGroup.get('activityReportActivityGroup') ?.setValue(this.selectedRow.activityReportActivityGroup);
            this.formGroup.get('activityGroupTypeName') ?.setValue(this.selectedRow.activityGroupTypeName);
            this.formGroup.get('activityGroupType') ?.setValue(this.selectedRow.activityGroupType);
            this.openModal(this.activityServiceGroupListPopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    /**
    * @method openModal
    * @description open model
    */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    /**
    * @method resetFields
    * @description Reset the all form group fields
    */
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        this._activityGroupServicesService.getActivityGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id') ?.setValue(result + 1);
                // this._gradeGroupStandingList.gradeGroupId = result + 1;
            } else {
                this.formGroup.get('id') ?.setValue(1);
            }
            this.openModal(this.activityServiceGroupListPopupRef);
        });
    }

    /**
   * @method hideLoader
   * @description Hide loader
   */
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    /**
     * @method showLoader
     * @description Show loader
     */
    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
    }

    /**
     * @method setSelectedRow
     * @description Set the selected row
     */
    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    /**
   * @method addNewGroupName
   * @description Add the group record
   */
    addNewGroupName() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.activityGroupId = this.formGroup ?.get('activityGroupId') ?.value;
            this.requestData.activityGroupName = this.formGroup ?.get('activityGroupName') ?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup ?.get('activityCalculateHoursforActivityGroup') ?.value;
            this.requestData.activityReportActivityGroup = this.formGroup ?.get('activityReportActivityGroup') ?.value;
            this.requestData.activityGroupTypeName = this.formGroup ?.get('activityGroupTypeName') ?.value;
            this.requestData.activityGroupType = this.formGroup ?.get('activityGroupType') ?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.getActivityGroupByActivityGroupNameAndActivityGroupType(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.toastr.info('Activity group name should be unique in all activity group type!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.formGroup.get('activityGroupName') ?.setValue('');
                    return;
                } else {
                    this.showLoader();
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
                                    this.activityGroupData = result;
                                    this.toastr.success('Saved successfully!', '', {
                                        timeOut: 5000,
                                        closeButton: true
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    /**
    * @method deleteSelectedRow
    * @description delete the record
    */
    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                activityGroupId: this.selectedRow.activityGroupId
            }
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm remove record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.activityGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._activityGroupServicesService.deleteActivityGroupList(data).subscribe(result1 => {
                        this._activityGroupServicesService.getActivityGroupList('').subscribe(result2 => {
                            this.hideLoader();
                            if (result2) {
                                this.dataSource = new MatTableDataSource(result2);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.selectedRowIndex = null;
                                this.selectedRow = null;
                                this.activityGroupData = result2;
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

    /**
    * @method updateSelectedRow
    * @description update the record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.activityGroupId = this.formGroup ?.get('activityGroupId') ?.value;
            this.requestData.activityGroupName = this.formGroup ?.get('activityGroupName') ?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup ?.get('activityCalculateHoursforActivityGroup') ?.value;
            this.requestData.activityReportActivityGroup = this.formGroup ?.get('activityReportActivityGroup') ?.value;
            this.requestData.activityGroupTypeName = this.formGroup ?.get('activityGroupTypeName') ?.value;
            this.requestData.activityGroupType = this.formGroup ?.get('activityGroupType') ?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.getActivityGroupByActivityGroupNameAndActivityGroupType(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateActivityGroupList();
                } else {
                    if ((this.selectedRow.activityGroupName.toLowerCase() == this.formGroup ?.get('activityGroupName') ?.value.toLowerCase()) &&
                        (this.selectedRow.activityGroupType.toLowerCase() == this.formGroup ?.get('activityGroupType') ?.value.toLowerCase()) 
                    ) {
                        this.updateActivityGroupList();
                    } else {
                    this.toastr.info('Activity group name should be unique in all activity group type!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.formGroup.get('activityGroupName') ?.setValue('');
                    return;
                }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    updateActivityGroupList(){
        this.showLoader();
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
                    this.activityGroupData = result;
                    this.toastr.success('Updated successfully!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                }
            });
        });
    }

    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup() {
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(ServiceGroupListMoveBoxComponent, {
                data: {
                    title: 'Customize Service and Activity Group Name',
                    message: '',
                    activityGroupList: this.activityGroupData,
                    selectedActivityGroupId: this.selectedRow.activityGroupId,
                    selectedId: this.selectedRow.id,
                    selectedActivityGroupName: this.selectedRow.activityGroupName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.activityGroupData = result;
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

    /**
    * @method showMergeItemPopup
    * @description Open the popup for merge the record
    */
    showMergeItemPopup() {
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(ServiceGroupListMergeBoxComponent, {
                data: {
                    title: 'Customize Service and Activity Group Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.activityGroupName + "?",
                    activityGroupList: this.activityGroupData,
                    selectedActivityGroupId: this.selectedRow.activityGroupId,
                    selectedId: this.selectedRow.id,
                    selectedActivityGroupName: this.selectedRow.activityGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.activityGroupData = result;
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

    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
     bindDropDownValues() {
        let data: any = ['ActivityGroupType'];
        this.pullDownService.getMultiplePulldownListByCode(data).subscribe((result: any) => {
            if (result?.body?.ActivityGroupType) {
                this.activityGroupTypes = result.body.ActivityGroupType;
            }
        });
    }

    /**
    * @method print
    * @description show print and download the data.
    */
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['Id', 'Service or Activity Group Name', 'Report Activity', 'Calculate Hours']]
        let data: any = [];
        this.activityGroupData.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.id);
            tempObj.push(e.activityGroupName);
            if (e.activityReportActivityGroup == true) {
                tempObj.push("YES");
            } else {
                tempObj.push("NO");
            }

            if (e.activityCalculateHoursforActivityGroup == true) {
                tempObj.push("YES");
            } else {
                tempObj.push("NO");
            }
            data.push(tempObj);
        });
        autoTable(doc, {
            head: head,
            body: data,
            theme: "grid",
            showHead: "everyPage",
            margin: { left: 20, right: 20, top: 30, bottom: 40 },
            startY: 25,
            headStyles: {
                fillColor: [0, 57, 107]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            tableLineColor: [208, 208, 208],
            tableLineWidth: 0.1,
            //styles : { halign : 'center'},
            bodyStyles: {
                fontSize: 12
            },
            styles: {
                cellPadding: 3
            },
            didDrawPage: function (data) {

                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                //doc.text("Compansol TRIO College Listing", data.settings.margin.left, 10);
                doc.text("Compansol TRIO Service Group Listing", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "Service Group List"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'serviceGroup.pdf' });
        //doc.save('college.pdf');  
    }
}
