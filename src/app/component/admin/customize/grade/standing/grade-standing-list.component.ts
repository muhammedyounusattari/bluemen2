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
    selector: 'app-grade-standing-list',
    templateUrl: './grade-standing-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class GradeStandingListComponent implements OnInit {
    gradeStandingListData: any = [];
    requestData = {
        graduateList: true,
        gradingId: 1,
        gradingName: '',
        gradingGroupName: '',
        gradingNewGrade: '',
        gradingParticipantStatus: '',
        gradingYearEnbStatus: '',
        gradingFiscalYear: ''
    }
    gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

    @ViewChild('gradeStandingListPopup') gradeStandingListPopupRef: TemplateRef<any>;
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
    columnsToDisplay: string[] = ['gradingId', 'gradingName', 'gradingGroupName', 'gradingFiscalYear'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    ddlGroupList: any= [];

    gradingFiscalYearList = [
        {'name': 'Freshman | 1'},
        {'name': 'Junior | 2'},
        {'name': 'Senior | 3'},
        {'name': 'Sophomore | 4'},
        {'name': 'test | 5'}
    ];
    participantList = [
        {'name': 'Continuing Participant'},
        {'name': 'New Participant'},
        {'name': 'New Summer Participant'},
        {'name': 'No Response / Unknown'},
        {'name': 'Prior Year Participant'}
    ];

    yearEndFYList = [
        {'name': 'No Reponse'},
        {'name': 'Academic Dismissal'},
        {'name': 'Continuing Student'},
        {'name': 'Graduated'}
    ];
    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService
        , private toastr: ToastrService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('GRADE_STANDING');
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
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
            if (result) {
                this.ddlGroupList = result;
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
            this.gradeGroupStandingList.graduateList = true;
            this.gradeGroupStandingList.gradingId = this.selectedRow.gradingId;
            this.gradeGroupStandingList.gradingName = this.selectedRow.gradingName;
            this.gradeGroupStandingList.gradingGroupName = this.selectedRow.gradingGroupName;
            this.gradeGroupStandingList.gradingNewGrade = '';
            this.gradeGroupStandingList.gradingParticipantStatus = this.selectedRow.gradingParticipantStatus;
            this.gradeGroupStandingList.gradingYearEnbStatus = this.selectedRow.gradingYearEnbStatus;
            this.gradeGroupStandingList.gradingFiscalYear = this.selectedRow.gradingFiscalYear;
            this.openModal(this.gradeStandingListPopupRef);
        } else {
            this.toastr.info('Please select a row to update.', '', {
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
        this.gradeGroupStandingList = new GradeGroupStandingList();
        this._gradingGroupStandingService.getGradingStandingMaxId().subscribe(result => {
            if (result) {
                this.gradeGroupStandingList.gradingId = result + 1;
            }
            this.openModal(this.gradeStandingListPopupRef);
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

    addGradeStanding() {
        this.showLoader();
        this.requestData.graduateList = true;
        this.requestData.gradingId = this.gradeGroupStandingList.gradingId;
        this.requestData.gradingName = this.gradeGroupStandingList.gradingName;
        this.requestData.gradingGroupName = this.gradeGroupStandingList.gradingGroupName;
        this.requestData.gradingNewGrade = this.gradeGroupStandingList.gradingName;
        this.requestData.gradingParticipantStatus = this.gradeGroupStandingList.gradingParticipantStatus;
        this.requestData.gradingYearEnbStatus = this.gradeGroupStandingList.gradingYearEnbStatus;
        this.requestData.gradingFiscalYear = this.gradeGroupStandingList.gradingFiscalYear;
        this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
            if (result) {
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
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
                gradingId: this.selectedRow.gradingId
            }
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradingName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._gradingGroupStandingService.deleteGradingStandingList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRow = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRowIndex = null;
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
            this.toastr.info('Please select a row to delete.', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }
    updateSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.graduateList = true;
            this.requestData.gradingId = this.gradeGroupStandingList.gradingId;
            this.requestData.gradingName = this.gradeGroupStandingList.gradingName;
            this.requestData.gradingGroupName = this.gradeGroupStandingList.gradingGroupName;
            this.requestData.gradingNewGrade = this.gradeGroupStandingList.gradingName;
            this.requestData.gradingParticipantStatus = this.gradeGroupStandingList.gradingParticipantStatus;
            this.requestData.gradingYearEnbStatus = this.gradeGroupStandingList.gradingYearEnbStatus;
            this.requestData.gradingFiscalYear = this.gradeGroupStandingList.gradingFiscalYear;
            this._gradingGroupStandingService.updateGradingStandingList(this.requestData).subscribe(response => {
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
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