import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class ServiceGroupListComponent implements OnInit{
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }

    constructor(private modalService: BsModalService, private router : Router) {}

    ngOnInit() {
        this.navigateToComponent('service-group-list');
    }
    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template : TemplateRef<any>) {
       this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/services-list']);
        }
    }
}