import { Component, TemplateRef, ViewChild } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-assign-student-to-teacher-classes',
    templateUrl: './assign-student-teacher-classes.component.html',
    styleUrls: ['./assign-student-teacher-classes.component.css']
})

export class AssignStudentsToTeacherClassesComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isShow: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    constructor(private modalService: BsModalService) {}

    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template : TemplateRef<any>) {
       this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
    showSecondPopup() {
        this.isShow = true;
    }
}