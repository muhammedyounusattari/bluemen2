import { Component, TemplateRef, ViewChild } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-lab-contacts',
    templateUrl: './lab-contacts.component.html',
    styleUrls: ['./lab-contacts.component.css']
})

export class AttendanceLogsComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
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
}