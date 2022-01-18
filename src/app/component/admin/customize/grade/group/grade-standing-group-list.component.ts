import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-grade-standing-group-list',
    templateUrl: './grade-standing-group-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class GradeStandingGroupListComponent implements OnInit {
    gradeGroupListData: any = [];
    requestData = {
        gradeGroupId: 0,
        gradeGroupName: '',
        gradeGroupGradeType: '',
        gradeGroupAprColumn: ''
    }
    _gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

    @ViewChild('gradeGroupListPopup') gradeGroupListPopupRef: TemplateRef<any>;
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
    columnsToDisplay: string[] = ['gradeGroupId', 'gradeGroupName', 'gradeGroupAprColumn'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    gradeGroupGradeTypeList = [
        {'name' : 'APR Column #1 | 1'},
        {'name' : 'APR Column #2 | 2'},
        {'name' : 'APR Column #3 | 3'},
        {'name' : 'APR Column #4 | 4'}
    ];
    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService
        , private toastr: ToastrService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('GRADE_GROUP');
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

    navigateToComponent(componentName: string) {
        if (componentName === 'grade-group-list') {
            this.router.navigate(['admin/grade-group-list']);
        } else if (componentName === 'grade-standing-list') {
            this.router.navigate(['admin/grade-standing-list']);
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
            this._gradeGroupStandingList.gradeGroupId = this.selectedRow.gradeGroupId;
            this._gradeGroupStandingList.gradeGroupName = this.selectedRow.gradeGroupName;
            this._gradeGroupStandingList.gradeGroupGradeType = this.selectedRow.gradeGroupGradeType;
            this._gradeGroupStandingList.gradeGroupAprColumn = this.selectedRow.gradeGroupGradeType;
            this.openModal(this.gradeGroupListPopupRef);
        } else {
            this.toastr.info('Please select a record to update', '', {
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
        this._gradeGroupStandingList = new GradeGroupStandingList();
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingGroupMaxId().subscribe(result => {
            if (result) {
                this._gradeGroupStandingList.gradeGroupId = result + 1;
            }
            this.openModal(this.gradeGroupListPopupRef);
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

    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    addGradeGroup() {
        this.showLoader();
        this.requestData.gradeGroupId = this._gradeGroupStandingList.gradeGroupId;
        this.requestData.gradeGroupName = this._gradeGroupStandingList.gradeGroupName;
        this.requestData.gradeGroupGradeType = this._gradeGroupStandingList.gradeGroupGradeType;
        this.requestData.gradeGroupAprColumn = this._gradeGroupStandingList.gradeGroupGradeType;
        this._gradingGroupStandingService.postGradingGroupList(this.requestData).subscribe(result => {
            if (result) {
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    this.modalRef.hide();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
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
            const data = {
                gradeGroupId: this.selectedRow.gradeGroupId
            }
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._gradingGroupStandingService.deleteGradingGroupList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
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
            this.isEdit = true;
            this.requestData.gradeGroupId = this._gradeGroupStandingList.gradeGroupId;
            this.requestData.gradeGroupName = this._gradeGroupStandingList.gradeGroupName;
            this.requestData.gradeGroupGradeType = this._gradeGroupStandingList.gradeGroupGradeType;
            this.requestData.gradeGroupAprColumn = this._gradeGroupStandingList.gradeGroupGradeType;
            this._gradingGroupStandingService.updateGradingGroupList(this.requestData).subscribe(response => {
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    this.modalRef.hide();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
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