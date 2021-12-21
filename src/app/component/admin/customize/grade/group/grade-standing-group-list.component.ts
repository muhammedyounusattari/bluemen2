import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';

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
        gradeGroupAprColumn:''
    }
    _gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

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
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
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
        this.requestData.gradeGroupId = this._gradeGroupStandingList.gradeGroupId;
        this.requestData.gradeGroupName = this._gradeGroupStandingList.gradeGroupName;
        this.requestData.gradeGroupGradeType = this._gradeGroupStandingList.gradeGroupGradeType;
        this.requestData.gradeGroupAprColumn = '';
        this._gradingGroupStandingService.postGradingGroupList(this.requestData).subscribe(result => {
            if (result) {
                alert('saved');
            }
        });
    }
}