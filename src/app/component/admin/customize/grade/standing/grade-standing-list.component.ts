import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { GradeStandingListMoveBoxComponent } from '../../move-box/grade-standing-list-move-box/grade-standing-list-move-box.component';
import { GradeStandingListMergeBoxComponent } from '../../merge-box/grade-standing-list-merge-box/grade-standing-list-merge-box.component';

@Component({
    selector: 'app-grade-standing-list',
    templateUrl: './grade-standing-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class GradeStandingListComponent implements OnInit {
    formGroup: FormGroup;
    gradeStandingListData: any = [];
    requestData = {
        id:'',
        gradingId: '',
        gradingName: '',
        gradingGroupName: '',
        gradingParticipantStatus: '',
        gradingYearEnbStatus: '',
        gradingFiscalYear: ''
    }

    @ViewChild('gradeStandingListPopup') gradeStandingListPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    isMoved: boolean = false;
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
    lastIndexRow = 0;
    updateIndexValue: any;
    validationClass: ValidationClass = new ValidationClass();
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
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService) { }

    ngOnInit() {
        this.sharedService.setPageTitle('Grade/Standing List');
        this.createForm();
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
            let domElement = window.document.getElementById('GRADE_STANDING');
            this.hideLoader();
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.gradeStandingListData = result;
            }
        });
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(gradingGroupResult => {
            if (gradingGroupResult) {
                this.ddlGroupList = gradingGroupResult;
            }
        });
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'id':[''],
            'gradingId': [''],
            'gradingName': ['', Validators.required],
            'gradingGroupName': ['', Validators.required],
            'gradingFiscalYear': [''],
            'gradingParticipantStatus': [''],
            'gradingYearEnbStatus': ['']
        });
    }

    navigateToComponent(componentName: string) {
        if (componentName === 'grade-group-list') {
            this.router.navigate(['admin/customize/grade-group-list']);
        } else if (componentName === 'grade-standing-list') {
            this.router.navigate(['admin/customize/grade-standing-list']);
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
            this.formGroup.get('id')?.setValue(this.selectedRow.id);
            this.formGroup.get('gradingId')?.setValue(this.selectedRow.gradingId);
            this.formGroup.get('gradingName')?.setValue(this.selectedRow.gradingName);
            this.formGroup.get('gradingGroupName')?.setValue(this.selectedRow.gradingGroupName);
            this.formGroup.get('gradingParticipantStatus')?.setValue(this.selectedRow.gradingParticipantStatus);
            this.formGroup.get('gradingYearEnbStatus')?.setValue(this.selectedRow.gradingYearEnbStatus);
            this.formGroup.get('gradingFiscalYear')?.setValue(this.selectedRow.gradingFiscalYear);
            this.openModal(this.gradeStandingListPopupRef);
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
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingStandingMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
                // this._gradeGroupStandingList.gradeGroupId = result + 1;
            } else {
                this.formGroup.get('id')?.setValue(1);
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
        this.updateIndexValue = index+1;
        this.selectedRow = selectedRowItem;
    }

    addGradeStanding() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradingId = this.formGroup?.get('gradingId')?.value;
            this.requestData.gradingName = this.formGroup?.get('gradingName')?.value;
            this.requestData.gradingGroupName = this.formGroup?.get('gradingGroupName')?.value;
            this.requestData.gradingParticipantStatus = this.formGroup?.get('gradingParticipantStatus')?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup?.get('gradingYearEnbStatus')?.value;
            this.requestData.gradingFiscalYear = this.formGroup?.get('gradingFiscalYear')?.value;
            // let status = this.checkGroupNameAndType(this.requestData.gradingName, this.requestData.gradeGroupGradeType);
            // if(!status){
            this.showLoader();
            this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
                if (result) {
                    this.showLoader();
                    this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                        this.hideLoader();
                        this.modalRef.hide();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRow = null;
                            this.dataSource.sort = this.sort;
                            this.gradeStandingListData = result;
                            this.toastr.success('Saved successfully!', '', {
                                timeOut: 5000,
                                closeButton: true
                            });

                        }
                    });
                }
            });
        // }
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                gradingId: this.selectedRow.gradingId
            }
            //this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._gradingGroupStandingService.deleteGradingStandingList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.gradeStandingListData = result;
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
            this.isEdit = true;
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradingId = this.formGroup?.get('gradingId')?.value;
            this.requestData.gradingName = this.formGroup?.get('gradingName')?.value;
            this.requestData.gradingGroupName = this.formGroup?.get('gradingGroupName')?.value;
            this.requestData.gradingParticipantStatus = this.formGroup?.get('gradingParticipantStatus')?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup?.get('gradingYearEnbStatus')?.value;
            this.requestData.gradingFiscalYear = this.formGroup?.get('gradingFiscalYear')?.value; 
            // let status = this.checkGroupNameAndType(this.requestData.gradeGroupName, this.requestData.gradeGroupGradeType);
            // if(!status){
            this.showLoader();
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
                        this.gradeStandingListData = result;
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        // }
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    showMoveItemPopup(){
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(GradeStandingListMoveBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Name',
                    message: '',
                    gradeStandingList :this.gradeStandingListData,
                    selectedGradingId: this.selectedRow.gradingId,
                    selectedId: this.selectedRow.id,
                    selectedGradingName: this.selectedRow.gradingName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this.showLoader();
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.gradeStandingListData = result;
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
            const confirmDialog = this.dialog.open(GradeStandingListMergeBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.gradingName,
                    gradeStandingList :this.gradeStandingListData,
                    selectedGradingId: this.selectedRow.gradingId,
                    selectedId: this.selectedRow.id,
                    selectedGradingName: this.selectedRow.gradingName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.gradeStandingListData = result;
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
}