import { Component, TemplateRef, ViewChild } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-stipend-logs',
    templateUrl: './stipend-logs.component.html',
    styleUrls: ['./stipend-logs.component.css']
})

export class StipendLogsComponent {
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