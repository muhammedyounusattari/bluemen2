import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-fiscal-year-financial-aid',
    templateUrl: './fiscal-year-financial-aid.component.html',
    styleUrls: ['./fiscal-year-financial-aid.component.css']
})

export class FiscalYearAndFinancialAidComponent {
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

    openCity(evt:any, cityName:any) {
        switch(cityName) { 
            case 'Student': { 
                document.getElementById('Student')?.classList.add('Active');
                //statements; 
               break; 
            }
            case 'Mark': { 
                document.getElementById('Mark')?.classList.add('Active');
                //statements; 
               break; 
            } 
            default: { 
               //statements; 
               break; 
            } 
         } 
        
    }
}