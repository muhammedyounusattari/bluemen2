import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CollegeAndSchoolService } from '../../../../services/admin/college-school.service';
import { SchoolListEnum } from '../../../../constants/enums/school-list.enum';

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class SchoolListComponent implements OnInit{
    schoolDataList: any = [];
    schoolListEnum: SchoolListEnum = new SchoolListEnum();
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    constructor(private modalService: BsModalService
        , private router: Router
        , private _collegeAndSchoolService: CollegeAndSchoolService) { }
    
    ngOnInit() {
        this.navigateToComponent('service-group-list');
        this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
            if (result) {
                this.schoolDataList = result;
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
        if (componentName === 'college-list') {
            this.router.navigate(['admin/college-list']);
        } else if (componentName === 'school-list') {
            this.router.navigate(['admin/school-list']);
        }
    }
}