import { Component, TemplateRef, ViewChild } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-yearly-financial-aid-info',
    templateUrl: './yearl-financial-aid-info.component.html',
    styleUrls: ['./yearl-financial-aid-info.component.css']
})
export class YearlyAndFinancialAIDInfoComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    constructor(private modalService: BsModalService) {}
}