import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-config-settings',
    templateUrl: './config-settings.component.html',
    styleUrls: ['./config-settings.component.css']
})

export class ConfigSettingsComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    constructor(private modalService: BsModalService) { }

    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
}