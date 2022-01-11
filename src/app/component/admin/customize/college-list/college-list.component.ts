import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CollegeAndSchoolService } from '../../../../services/admin/college-school.service';
import { CollegeListEnum } from '../../../../constants/enums/college-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-college-list',
    templateUrl: './college-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class CollegeListComponent implements OnInit {
    collegeDataList: any = [];
    collegeListEnum: CollegeListEnum = new CollegeListEnum();
    @ViewChild('collegeNamePopup') collegeNamePopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    requestData: any = {
        orgName: '',
        orgType: '',
        name: '',
        codes: '',
        address: '',
        city: '',
        country: '',
        email: '',
        fax: '',
        notes: '',
        phone1: '',
        phone2: '',
        phone3: '',
        states: '',
        title: '',
        website: '',
        zipcode: '',
        fafsaId: '',
        fiscalYear: '',
        ncesId: null,
        inPullDown: false
    };
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    isDisabled: boolean = false;
    columnsToDisplay: string[] = ['name', 'inPullDown', 'fafsaId', 'country', 'phone1', 'phone2', 'phone3', 'fax'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _collegeAndSchoolService: CollegeAndSchoolService
        , private toastr: ToastrService) { }

    ngOnInit() {
        this.navigateToComponent('service-group-list');
        this.myElement = window.document.getElementById('loading');
        this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('COLLEGE_LIST');
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result.filter((item: any) => item.ncesId === null || item.ncesId === undefined));
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.collegeDataList = result.filter((item: any) => item.ncesId === null || item.ncesId === undefined);
            }
        });
    }

    navigateToComponent(componentName: string) {
        if (componentName === 'college-list') {
            this.router.navigate(['admin/college-list']);
        } else if (componentName === 'school-list') {
            this.router.navigate(['admin/school-list']);
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
            this.isDisabled = true;
            this.collegeListEnum.orgName = this.selectedRow.name;
            this.collegeListEnum.inPullDown = this.selectedRow.inPullDown;
            this.collegeListEnum.name = this.selectedRow.name;
            this.collegeListEnum.codes = this.selectedRow.codes;
            this.collegeListEnum.title = this.selectedRow.title;
            this.collegeListEnum.country = this.selectedRow.country;
            this.collegeListEnum.address = this.selectedRow.address;
            this.collegeListEnum.fafsaId = this.selectedRow.fafsaId;
            this.collegeListEnum.city = this.selectedRow.city;
            this.collegeListEnum.states = this.selectedRow.states;
            this.collegeListEnum.zipcode = this.selectedRow.zipcode;
            this.collegeListEnum.fiscalYear = this.selectedRow.fiscalYear;
            this.collegeListEnum.phone1 = this.selectedRow.phone1;
            this.collegeListEnum.phone2 = this.selectedRow.phone2;
            this.collegeListEnum.phone3 = this.selectedRow.phone3;
            this.collegeListEnum.fax = this.selectedRow.fax;
            this.collegeListEnum.website = this.selectedRow.website;
            this.collegeListEnum.email = this.selectedRow.email;
            this.collegeListEnum.notes = this.selectedRow.notes;
            this.openModal(this.collegeNamePopupRef);
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
        this.isEdit = false;
        this.collegeListEnum = new CollegeListEnum();
        this.isDisabled = false;
        this.openModal(this.collegeNamePopupRef);
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

    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    addNewCollegeName() {
        this.showLoader();
        if (this.collegeListEnum.fafsaId) {
            if (this.collegeDataList && this.collegeDataList.length > 0) {
                const isFound = this.collegeDataList.filter((item: any) => item.fafsaId === this.collegeListEnum.fafsaId);
                if (isFound && isFound.length > 0) {
                    this.hideLoader();
                    this.toastr.info('Entered FAFSAID is alreay exist, to add this organization name please change entered FAFSAID.', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    return;
                }
            }
        } else {
            this.hideLoader();
            this.toastr.info('Please enter FAFSAID.', '', {
                timeOut: 5000,
                closeButton: true
            });
            return;
        }
        this.requestData.orgName = this.collegeListEnum.name;
        this.requestData.inPullDown = this.collegeListEnum.inPullDown;
        this.requestData.name = this.collegeListEnum.name;
        this.requestData.codes = this.collegeListEnum.codes;
        this.requestData.title = this.collegeListEnum.title;
        this.requestData.country = this.collegeListEnum.country;
        this.requestData.address = this.collegeListEnum.address;
        this.requestData.fafsaId = this.collegeListEnum.fafsaId;
        this.requestData.city = this.collegeListEnum.city;
        this.requestData.states = this.collegeListEnum.states;
        this.requestData.zipcode = this.collegeListEnum.zipcode;
        this.requestData.fiscalYear = this.collegeListEnum.fiscalYear;
        this.requestData.phone1 = this.collegeListEnum.phone1;
        this.requestData.phone2 = this.collegeListEnum.phone2;
        this.requestData.phone3 = this.collegeListEnum.phone3;
        this.requestData.fax = this.collegeListEnum.fax;
        this.requestData.website = this.collegeListEnum.website;
        this.requestData.email = this.collegeListEnum.email;
        this.requestData.notes = this.collegeListEnum.notes;
        this.requestData.ncesId = null;
        this._collegeAndSchoolService.postCollegeSchoolName(this.requestData).subscribe(result => {
            if (result) {
                this.modalRef.hide();
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.dataSource = new MatTableDataSource(result.filter((item: any) => item.ncesId === null || item.ncesId === undefined));
                        this.dataSource.paginator = this.paginator;
                        this.selectedRowIndex = null;
                        this.dataSource.sort = this.sort;
                        this.collegeDataList = result.filter((item: any) => item.ncesId === null || item.ncesId === undefined);
                        this.toastr.success('Saved successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            }
        });
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            this.requestData.orgName = this.selectedRow.name;
            this.requestData.inPullDown = this.selectedRow.inPullDown;
            this.requestData.name = this.selectedRow.name;
            this.requestData.codes = this.selectedRow.codes;
            this.requestData.title = this.selectedRow.title;
            this.requestData.country = this.selectedRow.country;
            this.requestData.address = this.selectedRow.address;
            this.requestData.fafsaId = this.selectedRow.fafsaId;
            this.requestData.city = this.selectedRow.city;
            this.requestData.states = this.selectedRow.states;
            this.requestData.zipcode = this.selectedRow.zipcode;
            this.requestData.fiscalYear = this.selectedRow.fiscalYear;
            this.requestData.phone1 = this.selectedRow.phone1;
            this.requestData.phone2 = this.selectedRow.phone2;
            this.requestData.phone3 = this.selectedRow.phone3;
            this.requestData.fax = this.selectedRow.fax;
            this.requestData.website = this.selectedRow.website;
            this.requestData.email = this.selectedRow.email;
            this.requestData.notes = this.selectedRow.notes;
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this College: ' + this.selectedRow.orgName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._collegeAndSchoolService.deleteCollegeSchoolName(this.requestData).subscribe(result => {
                        this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result.filter((item: any) => item.ncesId === null || item.ncesId === undefined));
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.collegeDataList = result.filter((item: any) => item.ncesId === null || item.ncesId === undefined);
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
            this.requestData.orgName = this.collegeListEnum.name;
            this.requestData.inPullDown = this.collegeListEnum.inPullDown;
            this.requestData.name = this.collegeListEnum.name;
            this.requestData.codes = this.collegeListEnum.codes;
            this.requestData.title = this.collegeListEnum.title;
            this.requestData.country = this.collegeListEnum.country;
            this.requestData.address = this.collegeListEnum.address;
            this.requestData.fafsaId = this.collegeListEnum.fafsaId;
            this.requestData.city = this.collegeListEnum.city;
            this.requestData.states = this.collegeListEnum.states;
            this.requestData.zipcode = this.collegeListEnum.zipcode;
            this.requestData.fiscalYear = this.collegeListEnum.fiscalYear;
            this.requestData.phone1 = this.collegeListEnum.phone1;
            this.requestData.phone2 = this.collegeListEnum.phone2;
            this.requestData.phone3 = this.collegeListEnum.phone3;
            this.requestData.fax = this.collegeListEnum.fax;
            this.requestData.website = this.collegeListEnum.website;
            this.requestData.email = this.collegeListEnum.email;
            this.requestData.notes = this.collegeListEnum.notes;
            this.requestData.ncesId = null;

            this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                this.modalRef.hide();
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.dataSource = new MatTableDataSource(result.filter((item: any) => item.ncesId === null || item.ncesId === undefined));
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
                        this.collegeDataList = result.filter((item: any) => item.ncesId === null || item.ncesId === undefined);
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        }
    }
}