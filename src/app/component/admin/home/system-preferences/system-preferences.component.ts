import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-system-preferences',
    templateUrl: './system-preferences.component.html'
})

export class SystemPreferencesComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    fiscalYearDate = new FormControl(new Date());
    currentYearDate = new FormControl(new Date());
    reportFromDate = new FormControl(new Date());
    reportToDate = new FormControl(new Date());
    expDate = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());
    
    constructor(private modalService: BsModalService) { }

    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
}