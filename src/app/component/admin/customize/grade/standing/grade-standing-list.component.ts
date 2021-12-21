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
        gradeStandingId: 1,
        gradingName: '',
        gradingGroupName: '',
        gradingNewGrade: '',
        gradingParticipantStatus:'',
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
    constructor(private modalService: BsModalService
        , private router: Router
        , private _gradingGroupStandingService: GradingGroupStandingService) { }

    ngOnInit() {
        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
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
        this.requestData.graduateList = true;
        this.requestData.gradeStandingId = this.gradeGroupStandingList.gradeStandingId;
        this.requestData.gradingName = this.gradeGroupStandingList.gradingName;
        this.requestData.gradingGroupName = this.gradeGroupStandingList.gradingGroupName;
        this.requestData.gradingNewGrade = '';
        this.requestData.gradingParticipantStatus = this.gradeGroupStandingList.gradingParticipantStatus;
        this.requestData.gradingYearEnbStatus = this.gradeGroupStandingList.gradingYearEnbStatus;
        this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
            if (result) {
                alert('saved');
            }
        });
    }
}