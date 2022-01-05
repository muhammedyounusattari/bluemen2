import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
    selector: 'app-staff-member',
    templateUrl: './staff-member.component.html',
    styleUrls: ['./staff-member.component.css']
})

export class StaffMemberComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    public staffMembersForm: FormGroup;
    public staffMembersModalForm: FormGroup;
    public staffMembersList: any = [];

    staffName:string;
    staff:string;
    title:string;
    staffActive:string;
    staffTutor:string;
    ssn:string;
    staffCounselor:string;
    staffTeacher:string;
    staffLab:string;
    codes:string;
    dob:string;
    spouse:string;
    staffHireDate:string;
    license:string;
    terminationDate:string;
    customField1:string;
    customField2:string;
    customField3:string;
    customField4:string;
    notes:string;
    picture:string;
    staffBolt:string;
    staffPhoneNumber:string;

    public customFieldsForm: FormGroup;
      public customFields: any;
      public selectedOption: any;
      public selectedRow: any = null;
      public customID: any = 1;
      public spinner: boolean = true;
      public selectedRowData: any;
      public selectedRowIndex: any;
      myElement: any = null;
      isLoading: boolean = true;
      public customFieldList: any = [];
      public id:string;
      public pullDownName:string;
      public isEdit:boolean;

      columnsToDisplay: string[] = ['id', 'staffName','title', 'staffActive', 'staffCounselor', 'staffTutor', 'staffTeacher','staffBolt','staff', 'staffLab', 'staffPhoneNumber', 'staffHireDate'];
      dataSource: MatTableDataSource<any>;
      @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
      @ViewChild(MatSort, {static: true}) sort: MatSort;

      @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
          this.dataSource.sort = sort;
        }
      }

    constructor(
      private modalService: BsModalService,
      private fb: FormBuilder,
      private staffMembersService: StaffMembersService
    ) {
      this.getStaffMembers();
      this.isEdit = false;
    }

    ngOnInit(): void {
      this.initialiseForm();
    }

    /**
     * @method initialiseForm
     */
    public initialiseForm() {
      this.staffMembersForm = this.fb.group({
        hireDateFrom: [''],
        hireDateTo: [''],
        staffActive: [''],
        codes: [''],
        zipCode: [''],
      });

      this.staffMembersModalForm = this.fb.group({
        name: [''],
      });
    }

    addNewDropdown() {
      this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.modalConfigSM);
    }

    /**
     * @method addStaffMembers
     */
    public addStaffMembers() {

      this.isEdit = false;
      this.staffMembersService
        .addStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();
          }
        });
    }

    updateSelectedRow() {
    this.isEdit = true;
     this.staffMembersService
            .addStaffMembers(this.requestPayload())
            .subscribe((result: any) => {
              if (result) {
                this.getStaffMembers();
              }
            });
    }


    /**
     * @method editStaffMembers
     */
    public editStaffMembers() {
      let request: any = this.requestPayload();
      if (request['id'] == undefined) {
        request['id'] = this.selectedRowData.id
      }
      this.staffMembersService
        .editStaffMembers(request)
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();

          }
        });
    }

    /**
     * @method getStaffMembers
     */
    public getStaffMembers() {
      this.spinner = true;
      this.staffMembersService.getStaffMembers().subscribe((result: any) => {
        this.hideLoader();
        if (result) {
          this.spinner = false;
          this.staffMembersList = result;


                  this.dataSource = new MatTableDataSource(result);
                  this.dataSource.paginator = this.paginator;
                  this.selectedRowIndex = null;
                  this.dataSource.sort = this.sort;
        }
      });
    }

    /**
     * @method deleteStaffMembers
     */
    public deleteStaffMembers() {
      this.staffMembersService
        .deleteStaffMembers({ id: this.selectedRow.id })
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();
          }
        });
    }

    /**
     * @method filterStaffMembers
     */
    public filterStaffMembers() {
      this.staffMembersService
        .filterStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result && result.length > 0) {
            this.getStaffMembers();
          }
        });
    }

    /**
     * @method getSelectedOption
     * @description get the requested modal type
     */
    public getSelectedOption(selectedOption: string) {
      this.selectedOption = selectedOption;
      this.staffMembersModalForm.reset();
      this.staffMembersModalForm.updateValueAndValidity();
    if(this.selectedOption === 'Edit') {
     this.isEdit = true;
      //this.staffMembersModalForm.get('name')?.setValue(this.selectedRow.staffName);
      this.staffName = this.selectedRow.staffName;
      this.id = this.selectedRow.id;
      this.title = this.selectedRow.staffTitle;
      this.staffActive = this.selectedRow.staffActive;
      this.staffTutor =  this.selectedRow.staffTutor;
      this.ssn =  this.selectedRow.staffSSNO;
      this.staffCounselor = this.selectedRow.staffCounselor;
      this.staffTeacher =      this.selectedRow.staffTeacher;
         this.staffLab=    this.selectedRow.staffLab;
        this.codes =    this.selectedRow.staffCodes;
        this.dob =    this.selectedRow.staffDOB;
        this.spouse =    this.selectedRow.staffSpouseName;
         this.staffHireDate =    this.selectedRow.staffHireDate;
         this.license =   this.selectedRow.staffDriverLicense;
          this.terminationDate =  this.selectedRow.staffTerminationDate;
          this.customField1=  this.selectedRow.staffCustomFieldOne;
          this.customField2 =  this.selectedRow.staffCustomFieldTwo;
           this.customField3 =  this.selectedRow.staffCustomFieldThree;
           this.customField4 = this.selectedRow.staffCustomFieldFour;
           this.notes = this.selectedRow.staffNotes;
           this.picture = this.selectedRow.staffPicture;
           this.staffBolt = this.selectedRow.staffBolt;
           this.staff = this.selectedRow.staff;





      this.staffMembersModalForm.updateValueAndValidity();
    } else {
      this.isEdit = false;
      this.resetFields();
    }
    }

    /**
     * @method getSelectedRow
     * @description get selected row data to perform action
     */
    public getSelectedRow(data: any, index: number) {
      this.selectedRow = index;
      this.selectedRowData = data;
    }

    /**
     * @method handleMethodToCall
     */
    public handleMethodToCall() {
      switch (this.selectedOption) {
        case 'New':
          this.addStaffMembers();
          break;
        case 'Edit':
          this.editStaffMembers();
          break;
        case 'Rename':
          break;
        case 'Move':
          break;
        case 'Merge':
          break;
        case 'Print':
          break;
        case 'Submit':
          break;
        default:
          break;
      }
    }

    /**
     * @method requestPayload
     * @description create the request payload for API's
     */
    public requestPayload() {
      return {
             id: this.id,
             staffName: this.staffName,
             staffTitle: this.title,
             staffActive: this.staffActive ,
             staffTutor:  this.staffTutor,
              staffSSNO:  this.ssn,
              staffCounselor: this.staffCounselor ,
              staffTeacher:  this.staffTeacher,
              staffLab:  this.staffLab,
              staffCodes: this.codes ,
              staffDOB:  this.dob,
              staffSpouseName: this.spouse ,
              staffHireDate:  this.staffHireDate,
              staffDriverLicense: this.license ,
              staffTerminationDate: this.terminationDate ,
              staffCustomFieldOne:  this.customField1,
              staffCustomFieldTwo:  this.customField2,
              staffCustomFieldThree:  this.customField3,
              staffCustomFieldFour:  this.customField4,
              staffNotes:  this.notes,
              staffPicture:  this.picture,
              staffBolt: this.staffBolt,
              staffPhoneNumber:this.staffPhoneNumber,
              staff:this.staff
      };
    }

     applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }

      setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
    //    if (data && data.length > 0) {
          this.selectedRow = selectedRowItem;
     //   }
      }

      hideLoader() {
          this.myElement = window.document.getElementById('loading');
          if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
          }
        }

        showLoader() {
          if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
          }
        }

        resetFields() {
        this.id = ''; this.staffName='';this.title='';this.staffActive='true';this.staffTutor='';this.ssn='';this.staffCounselor='';this.staffTeacher='';this.staffLab='';this.codes='';this.dob='';this.spouse='';this.staffHireDate='';this.license='';this.terminationDate='';this.customField1='';this.customField2='';this.customField3='';this.customField4='';this.notes='';this.picture='';this.staffBolt='';
        }
  }
