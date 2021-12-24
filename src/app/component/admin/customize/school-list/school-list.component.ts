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
    selectedRow: any = '';
    isEdit: boolean = false;
    requestData: any = {
        orgName: '',
        orgType: '',
        name: '',
        codes: '',
        address: '',
        city: '',
        country: '',
        email: '',
        fax: '',
        notes: '',
        phone1: '',
        phone2: '',
        phone3: '',
        states: '',
        title: '',
        website: '',
        zipcode: '',
        ncesId: '',
        fiscalYears: ''
    };

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
    addNewSchoolName() {
        this.requestData.orgName= this.schoolListEnum.name;
        this.requestData.orgType = this.schoolListEnum.orgType;
        this.requestData.name = this.schoolListEnum.name;
        this.requestData.codes = this.schoolListEnum.codes;
        this.requestData.title = this.schoolListEnum.title;
        this.requestData.country = this.schoolListEnum.country;
        this.requestData.address = this.schoolListEnum.address;
        this.requestData.ncesId= this.schoolListEnum.ncesId;
        this.requestData.city = this.schoolListEnum.city;
        this.requestData.states = this.schoolListEnum.states;
        this.requestData.zipcode = this.schoolListEnum.zipcode;
        this.requestData.fiscalYears = this.schoolListEnum.fiscalYears;
        this.requestData.phone1 = this.schoolListEnum.phone1;
        this.requestData.phone2 = this.schoolListEnum.phone2;
        this.requestData.phone3 = this.schoolListEnum.phone3;
        this.requestData.fax = this.schoolListEnum.fax;
        this.requestData.website = this.schoolListEnum.website;
        this.requestData.email= this.schoolListEnum.email;
        this.requestData.notes = this.schoolListEnum.notes;

        this._collegeAndSchoolService.postCollegeSchoolName(this.requestData).subscribe(result=>{
            if(result) {
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.schoolDataList = result;
                    }
                });
            }
        });
    }

    deleteSelectedRow() {
        if(this.selectedRow) {
            this.requestData.orgName= this.selectedRow.name;
            this.requestData.orgType = this.selectedRow.orgType;
            this.requestData.name = this.selectedRow.name;
            this.requestData.codes = this.selectedRow.codes;
            this.requestData.title = this.selectedRow.title;
            this.requestData.country = this.selectedRow.country;
            this.requestData.address = this.selectedRow.address;
            this.requestData.fafsaID= this.selectedRow.fafsaID;
            this.requestData.city = this.selectedRow.city;
            this.requestData.states = this.selectedRow.states;
            this.requestData.zipcode = this.selectedRow.zipcode;
            this.requestData.fiscalYears = this.selectedRow.fiscalYears;
            this.requestData.phone1 = this.selectedRow.phone1;
            this.requestData.phone2 = this.selectedRow.phone2;
            this.requestData.phone3 = this.selectedRow.phone3;
            this.requestData.fax = this.selectedRow.fax;
            this.requestData.website = this.selectedRow.website;
            this.requestData.email= this.selectedRow.email;
            this.requestData.notes = this.selectedRow.notes;
             
            this._collegeAndSchoolService.deleteCollegeSchoolName(this.requestData).subscribe(result => {
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    if (result) {
                        this.schoolDataList = result;
                    }
                }); 
            });
        }
    }
    setSelectedRow(selectedRowItem: any) {
        const data = this.schoolDataList.filter((item: any) => item.activityId === selectedRowItem.activityId);
        if (data && data.length > 0) {
            this.selectedRow = data[0];
        }
    }
    setSelectedRowToUpdate() {
        this.isEdit = true;
        this.schoolListEnum.orgName= this.selectedRow.name;
        this.schoolListEnum.orgType = this.selectedRow.orgType;
        this.schoolListEnum.name = this.selectedRow.name;
        this.schoolListEnum.codes = this.selectedRow.codes;
        this.schoolListEnum.title = this.selectedRow.title;
        this.schoolListEnum.country = this.selectedRow.country;
        this.schoolListEnum.address = this.selectedRow.address;
        this.schoolListEnum.ncesId= this.selectedRow.ncesId;
        this.schoolListEnum.city = this.selectedRow.city;
        this.schoolListEnum.states = this.selectedRow.states;
        this.schoolListEnum.zipcode = this.selectedRow.zipcode;
        this.schoolListEnum.fiscalYears = this.selectedRow.fiscalYears;
        this.schoolListEnum.phone1 = this.selectedRow.phone1;
        this.schoolListEnum.phone2 = this.selectedRow.phone2;
        this.schoolListEnum.phone3 = this.selectedRow.phone3;
        this.schoolListEnum.fax = this.selectedRow.fax;
        this.schoolListEnum.website = this.selectedRow.website;
        this.schoolListEnum.email= this.selectedRow.email;
        this.schoolListEnum.notes = this.selectedRow.notes;
    }
    updateSelectedRow() {
        if(this.selectedRow) {
            this.requestData.orgName= this.schoolListEnum.name;
            this.requestData.orgType = this.schoolListEnum.orgType;
            this.requestData.name = this.schoolListEnum.name;
            this.requestData.codes = this.schoolListEnum.codes;
            this.requestData.title = this.schoolListEnum.title;
            this.requestData.country = this.schoolListEnum.country;
            this.requestData.address = this.schoolListEnum.address;
            this.requestData.ncesId= this.schoolListEnum.ncesId;
            this.requestData.city = this.schoolListEnum.city;
            this.requestData.states = this.schoolListEnum.states;
            this.requestData.zipcode = this.schoolListEnum.zipcode;
            this.requestData.fiscalYears = this.schoolListEnum.fiscalYears;
            this.requestData.phone1 = this.schoolListEnum.phone1;
            this.requestData.phone2 = this.schoolListEnum.phone2;
            this.requestData.phone3 = this.schoolListEnum.phone3;
            this.requestData.fax = this.schoolListEnum.fax;
            this.requestData.website = this.schoolListEnum.website;
            this.requestData.email= this.schoolListEnum.email;
            this.requestData.notes = this.schoolListEnum.notes; 
           
            this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    if (result) {
                        document.getElementById('closePopup')?.click();
                        this.schoolDataList = result;
                        this.isEdit = false;
                    }
                });
            });
        }
    }
    resetFields() {
        this.schoolListEnum = new SchoolListEnum();
    }
}