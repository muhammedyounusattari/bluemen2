import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';

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
    selectedRowIndex: number;

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('GRADE_GROUP');
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.gradeGroupListData = result;
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
        if (componentName === 'grade-group-list') {
            this.router.navigate(['admin/grade-group-list']);
        } else if (componentName === 'grade-standing-list') {
            this.router.navigate(['admin/grade-standing-list']);
        }
    }
    addGradeGroup() {
        this.showLoader();
        this.requestData.gradeGroupId = this._gradeGroupStandingList.gradeGroupId;
        this.requestData.gradeGroupName = this._gradeGroupStandingList.gradeGroupName;
        this.requestData.gradeGroupGradeType = this._gradeGroupStandingList.gradeGroupGradeType;
        this.requestData.gradeGroupAprColumn = '';
        this._gradingGroupStandingService.postGradingGroupList(this.requestData).subscribe(result => {
            if (result) {
                document.getElementById('closePopup')?.click();
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.gradeGroupListData = result;
                    }
                });
            }
        });
    }
    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        const data = this.gradeGroupListData.filter((item: any) => item.gradeGroupId === selectedRowItem.gradeGroupId);
        if (data && data.length > 0) {
            this.selectedRow = data[0];
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
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._gradingGroupStandingService.deleteGradingGroupList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                            this.hideLoader();
                            if (result) {
                                this.gradeGroupListData = result;
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        }
    }
    setSelectedRowToUpdate() {
        this.isEdit = true;
        this._gradeGroupStandingList.gradeGroupId = this.selectedRow.gradeGroupId;
        this._gradeGroupStandingList.gradeGroupName = this.selectedRow.gradeGroupName;
        this._gradeGroupStandingList.gradeGroupGradeType = this.selectedRow.gradeGroupGradeType;
        this._gradeGroupStandingList.gradeGroupAprColumn = '';
    }
    updateSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.isEdit = true;
            this.requestData.gradeGroupId = this._gradeGroupStandingList.gradeGroupId;
            this.requestData.gradeGroupName = this._gradeGroupStandingList.gradeGroupName;
            this.requestData.gradeGroupGradeType = this._gradeGroupStandingList.gradeGroupGradeType;
            this.requestData.gradeGroupAprColumn = '';
            this._gradingGroupStandingService.updateGradingGroupList(this.requestData).subscribe(response => {
                document.getElementById('closePopup')?.click();
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.gradeGroupListData = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this._gradeGroupStandingList = new GradeGroupStandingList();
    }
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.myElement.style.display = 'none';
        }
    }
    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.myElement.style.display = 'block';
        }
    }
}