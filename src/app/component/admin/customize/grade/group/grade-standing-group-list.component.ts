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
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GradeStandingGroupListMoveBoxComponent } from '../../move-box/grade-standing-group-list-move-box/grade-standing-group-list-move-box.component';
import { GradeStandingGroupListMergeBoxComponent } from '../../merge-box/grade-standing-group-list-merge-box/grade-standing-group-list-merge-box.component';

@Component({
    selector: 'app-grade-standing-group-list',
    templateUrl: './grade-standing-group-list.component.html',
    styleUrls: ['./grade-standing-group.component.css']
})

export class GradeStandingGroupListComponent implements OnInit {
    formGroup: FormGroup;
    gradeGroupListData: any = [];
    requestData = {
        id:'',
        gradeGroupId: '',
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
        class: 'modal-md'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    columnsToDisplay: string[] =['id', 'gradeGroupName', 'gradeGroupAprColumn'];;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    gradeGroupGradeTypeList = [
        { 'name': 'APR Column #1 | 1' },
        { 'name': 'APR Column #2 | 2' },
        { 'name': 'APR Column #3 | 3' },
        { 'name': 'APR Column #4 | 4' }
    ];
    isLoading: boolean = true;
    validationClass: ValidationClass = new ValidationClass();

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
                this.gradeGroupListData = result;
            }
            
        });
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'id':[''],
            'gradeGroupId': [''],
            'gradeGroupName': ['', Validators.required],
            'gradeGroupGradeType': ['', Validators.required],
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
            this.formGroup.get('gradeGroupId')?.setValue(this.selectedRow.gradeGroupId);
            this.formGroup.get('gradeGroupName')?.setValue(this.selectedRow.gradeGroupName);
            this.formGroup.get('gradeGroupGradeType')?.setValue(this.selectedRow.gradeGroupGradeType);
            this.formGroup.get('gradeGroupAprColumn')?.setValue(this.selectedRow.gradeGroupGradeType);
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
        this.createForm();
        this.isEdit = false;
        this._gradeGroupStandingList = new GradeGroupStandingList();
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
            } else {
                this.formGroup.get('id')?.setValue(1);
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
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradeGroupId = this.formGroup?.get('gradeGroupId')?.value;
            this.requestData.gradeGroupName = this.formGroup?.get('gradeGroupName')?.value;
            this.requestData.gradeGroupGradeType = this.formGroup?.get('gradeGroupGradeType')?.value;
            this.requestData.gradeGroupAprColumn = this.formGroup?.get('gradeGroupGradeType')?.value;
            let status = this.checkGroupNameAndType(this.requestData.gradeGroupName, this.requestData.gradeGroupGradeType);
            if(!status){
            this.showLoader();
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
                            this.gradeGroupListData = result;
                            this.toastr.success('Saved successfully!', '', {
                                timeOut: 5000,
                                closeButton: true
                            });

                        }
                    });
                }
            });
        }
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                gradeGroupId: this.selectedRow.gradeGroupId
            }
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._gradingGroupStandingService.deleteGradingGroupList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.gradeGroupListData = result;
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
            this.requestData.gradeGroupId = this.formGroup?.get('gradeGroupId')?.value;
            this.requestData.gradeGroupName = this.formGroup?.get('gradeGroupName')?.value;
            this.requestData.gradeGroupGradeType = this.formGroup?.get('gradeGroupGradeType')?.value;
            this.requestData.gradeGroupAprColumn = this.formGroup?.get('gradeGroupGradeType')?.value; 
            let status = this.checkGroupNameAndType(this.requestData.gradeGroupName, this.requestData.gradeGroupGradeType);
            if(!status){
            this.showLoader();
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
                        this.gradeGroupListData = result;
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        }
        } else {
            this.formGroup.markAllAsTouched();
        }
    }
      checkGroupNameAndType(groupName: any, groupType: any) {
        let status = false;
          const data = this.gradeGroupListData.filter((item: any) => ((item.gradeGroupName).toLowerCase().trim() === (groupName).toLowerCase().trim()) && ((item.gradeGroupGradeType).toLowerCase().trim() === (groupType).toLowerCase().trim()));
          if (data && data.length > 0) {
            this.toastr.info('Group name should be unique in all group type!', '', {
              timeOut: 5000,
              closeButton: true
            });
            this.formGroup.get('gradeGroupName')?.setValue('');
            status = true;
          } 
        return status;
       
      }

      showMoveItemPopup(){
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(GradeStandingGroupListMoveBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Group Name',
                    message: '',
                    gradeGroupList :this.gradeGroupListData,
                    selectedGradeGroupId: this.selectedRow.gradeGroupId,
                    selectedId: this.selectedRow.id,
                    selectedGradeGroupName: this.selectedRow.gradeGroupName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this.showLoader();
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.gradeGroupListData = result;
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
            const confirmDialog = this.dialog.open(GradeStandingGroupListMergeBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Group Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.GradeGroupName+"?",
                    gradeGroupList :this.gradeGroupListData,
                    selectedGradeGroupId: this.selectedRow.gradeGroupId,
                    selectedId: this.selectedRow.id,
                    selectedGradeGroupName: this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
            if(result1 == true){
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.gradeGroupListData = result;
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