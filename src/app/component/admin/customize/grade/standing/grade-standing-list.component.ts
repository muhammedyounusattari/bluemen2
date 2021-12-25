import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';

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
        gradingYearEnbStatus: ''
    }
    gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

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

    constructor(private modalService: BsModalService
        , private router: Router
        , private _gradingGroupStandingService: GradingGroupStandingService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.gradeStandingListData = result;
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
    addGradeStanding() {
        this.showLoader();
        this.requestData.graduateList = true;
        this.requestData.gradingId = this.gradeGroupStandingList.gradingId;
        this.requestData.gradingName = this.gradeGroupStandingList.gradingName;
        this.requestData.gradingGroupName = this.gradeGroupStandingList.gradingGroupName;
        this.requestData.gradingNewGrade = '';
        this.requestData.gradingParticipantStatus = this.gradeGroupStandingList.gradingParticipantStatus;
        this.requestData.gradingYearEnbStatus = this.gradeGroupStandingList.gradingYearEnbStatus;
        this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
            if (result) {
                document.getElementById('closePopup')?.click();
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.gradeStandingListData = result;
                    }
                });
            }
        });
    }
    setSelectedRow(selectedRowItem: any) {
        const data = this.gradeStandingListData.filter((item: any) => item.gradingId === selectedRowItem.gradingId);
        if (data && data.length > 0) {
            this.selectedRow = data[0];
        }
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                gradingId: this.selectedRow.gradingId
            }
            this.showLoader();
            this._gradingGroupStandingService.deleteGradingStandingList(data).subscribe(result => {
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.gradeStandingListData = result;
                    }
                });
            });
        }
    }
    setSelectedRowToUpdate() {
        this.isEdit = true;
        this.gradeGroupStandingList.graduateList = true;
        this.gradeGroupStandingList.gradingId = this.selectedRow.gradingId;
        this.gradeGroupStandingList.gradingName = this.selectedRow.gradingName;
        this.gradeGroupStandingList.gradingGroupName = this.selectedRow.gradingGroupName;
        this.gradeGroupStandingList.gradingNewGrade = '';
        this.gradeGroupStandingList.gradingParticipantStatus = this.selectedRow.gradingParticipantStatus;
        this.gradeGroupStandingList.gradingYearEnbStatus = this.selectedRow.gradingYearEnbStatus;
    }
    updateSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.graduateList = true;
            this.requestData.gradingId = this.gradeGroupStandingList.gradingId;
            this.requestData.gradingName = this.gradeGroupStandingList.gradingName;
            this.requestData.gradingGroupName = this.gradeGroupStandingList.gradingGroupName;
            this.requestData.gradingNewGrade = '';
            this.requestData.gradingParticipantStatus = this.gradeGroupStandingList.gradingParticipantStatus;
            this.requestData.gradingYearEnbStatus = this.gradeGroupStandingList.gradingYearEnbStatus;
            this._gradingGroupStandingService.updateGradingStandingList(this.requestData).subscribe(response => {
                document.getElementById('closePopup')?.click();
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                    this.hideLoader();
                    if (result) {
                        this.gradeStandingListData = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this.gradeGroupStandingList = new GradeGroupStandingList();
    }
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.myElement.style.display = 'none';
        }
    }
    showLoader() {
        if (this.myElement !== null) {
            this.myElement.style.display = 'block';
        }
    }
}