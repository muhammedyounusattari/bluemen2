import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';

import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';


import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { StaffMemberMoveBoxComponent } from 'src/app/component/admin/customize/move-box/staff-member-move-box/staff-member-move-box.component';
import { StaffMemberMergeBoxComponent } from 'src/app/component/admin/customize/merge-box/staff-member-merge-box/staff-member-merge-box.component';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
@Component({
  selector: 'app-staff-member',
  templateUrl: './staff-member.component.html',
  styleUrls: ['./staff-member.component.css']
})

export class StaffMemberComponent {
  size: NzButtonSize = 'small';
  activeChecked = true;
  tutorChecked = false;
  boltChecked = false;
  staffChecked = false;
  teacherChecked = false;
  labChecked = false;
  counselorChecked = false;
  public staffDetailsForm!: FormGroup;
  viewOptions = ['Custom 1', 'Custom 2', 'Custom 3'];
  viewphoneType = ['Work', 'Home', 'Office'];
  public staffAddressForm!: FormGroup;
  public staffData = [{
    mailing_name: 'Karintha Ashe',
    email_address: 'karinthaashe@gmail.com',
    phone1: '(713)646-4654',
    phone2: '0987654321',
    phone3: '8789654123',
    fax: 'karinthaashe@fax.com',
    action: 'Approve'
  },
  {
    mailing_name: 'Test',
    email_address: 'test@gmail.com',
    phone1: '12134567890',
    phone2: '0987654321',
    phone3: '8789654123',
    fax: 'test@fax.com',
    action: 'Approve'
  },
  {
    mailing_name: 'Test',
    email_address: 'test@gmail.com',
    phone1: '12134567890',
    phone2: '0987654321',
    phone3: '8789654123',
    fax: 'test@fax.com',
    action: 'Approve'
  }]

  @ViewChild('staffDataEntryPopup') staffDataEntryPopupRef: TemplateRef<any>;
  isVisible: boolean = false;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  }
  public staffMembersForm: FormGroup;
  public staffMembersModalForm: FormGroup;
  public staffMembersList: any = [];
  public staffSearchMembersList: any = [];

  staffName: string;
  staff: string;
  title: string;
  staffActive: string;
  staffTutor: string;
  ssn: string;
  staffCounselor: string;
  staffTeacher: string;
  staffLab: string;
  codes: string;
  dob: string;
  spouse: string;
  staffHireDate: string;
  license: string;
  terminationDate: string;
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  notes: string;
  picture: string;
  staffBolt: string;
  staffPhoneNumber: string;

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
  public id: string;
  public pullDownName: string;
  public isEdit: boolean;
  public activeToggle: boolean = true;
  imageSrc = "../../../../../assets/img/photo.png";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";


  columnsToDisplay: string[] = ['id', 'staffName', 'title', 'staffActive', 'staffCounselor', 'staffTutor', 'staffTeacher', 'staffBolt', 'staff', 'staffLab', 'staffPhoneNumber', 'staffHireDate'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  codeListArray : any = [];
  customFieldListArray1: any = [];
  customFieldListArray2 : any = [];
  customFieldListArray3: any = [];
  customFieldListArray4: any = [];
  cityList : any = [];
  stateList: any = [];
  phoneTypesList: any = [];

  formGroup: FormGroup;
  searchFormGroup: FormGroup;
  validationClass: ValidationClass = new ValidationClass();
  isStaffDetail = true;
  addressDom: any;
  staffDom: any;
  uploadfile: any;
  selectedStudentRowIndex: any;
  selectedClassesStudentRow: any;
  columnsToDisplay1: string[] = ['staffMaillingName', 'staffEmail', 'staffPhone1', 'staffPhone2', 'staffPhone3', 'staffFax', 'action'];
  dataSource1: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator1: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort1: MatSort;
  @ViewChild(MatSort) set matSort1(sort1: MatSort) {
    if (this.dataSource1 && !this.dataSource1.sort) {
      this.dataSource1.sort = sort1;
    }
  }
  permanentAddress: any;
  addressData: any;
  isLoading1: boolean = true;
  addressList: any = [];
  isEditAddress = false;
  addressId = null;
  staffMaillingName = null;
  stctlbName = '';
  minHireDate: any;
  minTermDate: any;
  maxDob: any;
  isDOBValid = true;
  isHireValid = true;
  addressListIndex = 0;
  constructor(
    private modalService: BsModalService
    , private fb: FormBuilder
    , private formBuilder: FormBuilder
    , private staffMembersService: StaffMembersService
    , private dialog: MatDialog
    , private toastr: ToastrService
    , private sharedService: SharedService,
    private datepipe: DatePipe,
    private pullDownService: PullDownListService
  ) {
  }

  ngOnInit(): void {
    this.staffDetailsForm = this.fb.group({
			formLayout: ['vertical'],
			staff_title: [null],
      staff_name: [null],
      staff_SSNo: [null],
      staff_id: [null],
      staff_codes: [null],
      staff_license: [null],
      staff_dob: [null],
      staff_hire: [null],
      staff_terminate: [null],
      staff_spouse: [null],
      staff_custom1: [null],
      staff_custom2: [null],
      staff_custom3: [null],
      staff_custom4: [null],
      staff_notes: [null],
      tutuor_chk: [null],
      bolt_chk: [null],
      staff_chk: [null],
      counselor_chk: [null],
      teacher_chk: [null],
      lab_chk: [null],
      active_toggle: [null]
		});
    this.staffAddressForm = this.fb.group({
			formLayout: ['vertical'],
			staff_mailing_address: [null],
      staff_primary_address: [null],
      staff_mailing_name: [null],
      staff_city: [null],
      staff_state: [null],
      staff_phone1: [null],
      staff_phone1_type: [null],
      staff_email: [null],
      staff_phone2: [null],
      staff_phone2_type: [null],
      staff_website: [null],
      staff_phone3: [null],
      staff_phone3_type: [null],
      staff_zip_code: [null],
      staff_fax: [null],
      staff_address: [null]
		});
    
    this.sharedService.setPageTitle('Staff Data Filter');
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    this.isDOBValid = true;
    this.isHireValid = true;
    this.isStaffDetail = true;
    this.createForm();
    this.createSearchForm();
    this.getStaffMembers();
    this.bindDropDownValues();
    this.isEdit = false;
  }

  imageChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      //this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      //this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  bindDropDownValues() {
    let data: any = 'CITY,STATE,CODES, CUSTOMFIELDONE, CUSTOMFIELDTWO, CUSTOMFIELDTHREE, CUSTOMFIELDFOUR, PHONETYPE';
    this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
        if (result?.CITY) {
            this.cityList = result.CITY;
        }
        if (result?.STATE) {
            this.stateList = result.STATE;
        }
        if (result?.CODES) {
            this.codeListArray = result.CODES;
        }
        if (result?.CUSTOMFIELDONE) {
          this.customFieldListArray1 = result.CUSTOMFIELDONE;
         }
        if (result?.CUSTOMFIELDTWO) {
            this.customFieldListArray2 = result.CUSTOMFIELDTWO;
        }
        if (result?.CUSTOMFIELDTHREE) {
          this.customFieldListArray3 = result.CUSTOMFIELDTHREE;
        }
        if (result?.CUSTOMFIELDFOUR) {
          this.customFieldListArray4 = result.CUSTOMFIELDFOUR;
        }
        if (result?.PHONETYPE) {
          this.phoneTypesList = result.PHONETYPE;
        }
    });
 }
  switchBetweenTabs(activeTab: string) {
    if (!this.validationClass.isNullOrUndefined(activeTab) && !this.validationClass.isEmpty(activeTab)) {
      this.isStaffDetail = activeTab === 'staff-detail' ? true : activeTab === 'address' ? false : true;
    } else {
      this.isStaffDetail = true;
    }

    if (this.staffDom && this.addressDom) {
      if (this.isStaffDetail) {
        this.staffDom.style.borderBottom = "thick solid #0000FF";
        this.addressDom.style.borderBottom = "unset";
      } else {
        this.staffDom.style.borderBottom = "unset";
        this.addressDom.style.borderBottom = "thick solid #0000FF";
      }
    } else {
      setTimeout(() => {
        this.staffDom = window.document.getElementById('Staff_Detail');
        this.addressDom = window.document.getElementById('Address');
        if (this.isStaffDetail && this.staffDom && this.addressDom) {
          this.staffDom.style.borderBottom = "thick solid #0000FF";
          this.addressDom.style.borderBottom = "unset";
        } else if (this.addressDom && this.staffDom) {
          this.staffDom.style.borderBottom = "unset";
          this.addressDom.style.borderBottom = "thick solid #0000FF";
        }
      }, (500));
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'id': [''],
      'staffId': [''],
      'staffName': ['', Validators.required],
      'staff': [false],
      'title': [''],
      'staffActive': [true],
      'staffTutor': [false],
      'ssn': [''],
      'staffCounselor': [false],
      'staffTeacher': [false],
      'staffLab': [false],
      'codes': [''],
      'dob': [''],
      'spouse': [''],
      'staffHireDate': [''],
      'license': [''],
      'terminationDate': [''],
      'customField1': [''],
      'customField2': [''],
      'customField3': [''],
      'customField4': [''],
      'notes': [''],
      'picture': [''],
      'staffPhoneNumber': [''],
      'staffBolt': [false],
      'staffMaillingName': [''],
      'staffCity': [''],
      'staffState': [''],
      'staffEmail': ['', [Validators.pattern(this.emailPattern)]],
      'staffWebsite': [''],
      'staffZipcodes': [''],
      'staffFax': [''],
      'staffPhone1': [''],
      'staffPhone2': [''],
      'staffPhone3': [''],
      'staffPhoneType1': [''],
      'staffPhoneType2': [''],
      'staffPhoneType3': [''],
      'staffAddress': [''],
      'permanentAddress': [''],
      'usedForMailling': ['']
    });
  }

  createSearchForm() {
    this.searchFormGroup = this.formBuilder.group({
      'staffHireDate1': [''],
      'staffHireDate2': [''],
      'activeStaff': [''],
      'codesStaff': ['']
    });
  }

  addNewDropdown() {
    this.openModal(this.staffDataEntryPopupRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  /**
   * @method addStaffMembers
   */
  public addStaffMembers() {
    if (this.formGroup.valid) {
      this.isEdit = false;
      let staffName = this.formGroup?.get('staffName')?.value;
      this.staffMembersService.getStaffNameByOrgId(staffName).subscribe(result3 => {
        if (result3) {
          this.toastr.info('Staff Name is already exist!', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.formGroup.get('staffName')?.setValue('');
          return;
        } else {
          this.showLoader();
          this.staffMembersService
            .addStaffMembers(this.requestPayload(), this.uploadfile)
            .subscribe((result: any) => {
              if (result) {
                this.toastr.success('Saved Successfully !', '', {
                  timeOut: 5000,
                  closeButton: true
                });
                this.modalRef.hide();
                this.getStaffMembers();
                this.hideLoader();
              }else{
                this.hideLoader();
              }
            });
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffName')?.value) {
        this.toastr.info('Please enter the staff name!', '', {
          timeOut: 5000,
          closeButton: true
        });
        return;
      }
    }
  }

  updateSelectedRow() {
    if (this.formGroup.valid) {
      this.isEdit = true;
      let staffName = this.formGroup?.get('staffName')?.value;
      this.staffMembersService.getStaffNameByOrgId(staffName).subscribe(result3 => {
        if (!result3) {
          this.updateStaffList();
        } else {
          if (this.selectedRow.staffName.toLowerCase() == this.formGroup?.get('staffName')?.value.toLowerCase()) {
            this.updateStaffList();
          } else {
            this.toastr.info('Staff Name is already exist!', '', {
              timeOut: 5000,
              closeButton: true
            });
            this.formGroup.get('staffName')?.setValue('');
            return;
          }
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffName')?.value) {
        this.toastr.info('Please enter the staff name!', '', {
          timeOut: 5000,
          closeButton: true
        });
        return;
      }
    }
  }

  updateStaffList() {
    this.showLoader();
    this.staffMembersService
      .addStaffMembers(this.requestPayload(), this.uploadfile)
      .subscribe((result: any) => {
        if (result) {
          this.selectedRow = null;
          this.toastr.success('Updated Successfully !', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.modalRef.hide();
          this.getStaffMembers();
          this.hideLoader();
        }else{
          this.hideLoader();
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
    this.formGroup.get('id')?.setValue(this.selectedRowData.id);
  }

  /**
   * @method getStaffMembers
   */
  public getStaffMembers() {
    this.showLoader();
    this.staffMembersService.getStaffMembers().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.staffMembersList = result;
        this.staffSearchMembersList = result;
        setTimeout(() => {
          this.staffDom = window.document.getElementById('Staff_Detail');
          this.addressDom = window.document.getElementById('Address');
          this.switchBetweenTabs('');
        }, (500));
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.selectedRowIndex = null;
        this.dataSource.sort = this.sort;
        this.hideLoader();
      }else{
        this.hideLoader();
      }
    });
  }

  /**
   * @method deleteStaffMembers
   */
  public deleteStaffMembers() {
    if (this.selectedRow) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm remove record',
          message: 'Are you sure, you want to remove this record: ' + this.selectedRow.staffName
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.showLoader();
          this.staffMembersService
            .deleteStaffMembers({ id: this.selectedRow.id })
            .subscribe((result: any) => {
              if (result) {
                this.selectedRow = null;
                this.toastr.success('Deleted Successfully !', '', {
                  timeOut: 5000,
                  closeButton: true
                });
                this.getStaffMembers();
                this.hideLoader();
              }
            });

        } else {
          this.hideLoader();
        }
      });
    } else {
      this.toastr.info('Please select a row to delete', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }

  /**
   * @method filterStaffMembers
   */
  public filterStaffMembers() {
    this.staffMembersService
      .filterStaffMembers(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getStaffMembers();
        }
      });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.staffDom = window.document.getElementById('Staff_Detail');
    this.addressDom = window.document.getElementById('Address');
    this.selectedOption = selectedOption;
    // this.staffMembersModalForm.reset();
    // this.staffMembersModalForm.updateValueAndValidity();
    if (this.selectedOption === 'Edit') {
      if (this.selectedRow) {
        this.addressList = [];
        this.isEdit = true;
        this.switchBetweenTabs('staff-detail');
        //this.staffMembersModalForm.get('name')?.setValue(this.selectedRow.staffName);
        this.stctlbName = this.selectedRow.staffName;
        this.formGroup.get('staffName')?.setValue(this.selectedRow.staffName);
        this.formGroup.get('staffId')?.setValue(this.selectedRow.staffId);
        this.formGroup.get('id')?.setValue(this.selectedRow.id);
        this.formGroup.get('title')?.setValue(this.selectedRow.staffTitle);
        this.formGroup.get('staffActive')?.setValue(this.selectedRow.staffActive);
        this.formGroup.get('staffTutor')?.setValue(this.selectedRow.staffTutor);
        this.formGroup.get('ssn')?.setValue(this.selectedRow.staffSSNO);
        this.formGroup.get('staffCounselor')?.setValue(this.selectedRow.staffCounselor);
        this.formGroup.get('staffTeacher')?.setValue(this.selectedRow.staffTeacher);
        this.formGroup.get('staffLab')?.setValue(this.selectedRow.staffLab);
        this.formGroup.get('codes')?.setValue(this.selectedRow.staffCodes);
        this.formGroup.get('dob')?.setValue(this.selectedRow.staffDOB);
        this.formGroup.get('spouse')?.setValue(this.selectedRow.staffSpouseName);
        this.formGroup.get('staffHireDate')?.setValue(this.selectedRow.staffHireDate);
        this.formGroup.get('license')?.setValue(this.selectedRow.staffDriverLicense);
        this.formGroup.get('customField1')?.setValue(this.selectedRow.staffCustomFieldOne);
        this.formGroup.get('customField2')?.setValue(this.selectedRow.staffCustomFieldTwo);
        this.formGroup.get('customField3')?.setValue(this.selectedRow.staffCustomFieldThree);
        this.formGroup.get('customField4')?.setValue(this.selectedRow.staffCustomFieldFour);
        this.formGroup.get('notes')?.setValue(this.selectedRow.staffNotes);
        this.formGroup.get('picture')?.setValue(this.selectedRow.staffPicture);
        this.formGroup.get('staffBolt')?.setValue(this.selectedRow.staffBolt);
        this.formGroup.get('staff')?.setValue(this.selectedRow.staff);
        this.formGroup.get('staffPhoneNumber')?.setValue(this.selectedRow.staffPhoneNumber);
        if (this.selectedRow.address && this.selectedRow.address.length > 0) {
          this.addressData = this.selectedRow.address;
          this.permanentAddress = this.selectedRow.address.filter((item: any) => item.permanentAddress)[0];
          this.bindAddressValueToFB();
          this.addressList = this.selectedRow.address;
          this.dataSource1 = new MatTableDataSource(this.selectedRow.address);
          this.dataSource1.paginator = this.paginator1;
          this.dataSource1.sort = this.sort1;
        }else{
          this.addressData = [];
          this.permanentAddress = '';
          this.bindAddressValueToFB();
          this.addressList = [];
          this.dataSource1 = new MatTableDataSource();;
          this.dataSource1.paginator = null;
          this.dataSource1.sort = null;
        }
        this.openModal(this.staffDataEntryPopupRef);
        // this.staffMembersModalForm.updateValueAndValidity();
      } else {
        this.toastr.info('Please select a row to update', '', {
          timeOut: 5000,
          closeButton: true
        });
      }
    } else {
      this.addressList = [];
      this.isEdit = false;
      this.isEditAddress = false;
      this.stctlbName = '';
      this.switchBetweenTabs('staff-detail');
      this.resetFields();
      this.dataSource1 = this.addressList;
      this.openModal(this.staffDataEntryPopupRef);
    }
  }

  bindAddressValueToFB() {
    this.formGroup.get('staffMaillingName')?.setValue('');
    this.formGroup.get('staffCity')?.setValue('');
    this.formGroup.get('staffState')?.setValue('');
    this.formGroup.get('staffEmail')?.setValue('');
    this.formGroup.get('staffWebsite')?.setValue('');
    this.formGroup.get('staffFax')?.setValue('');
    this.formGroup.get('staffZipcodes')?.setValue('');
    this.formGroup.get('staffPhone1')?.setValue('');
    this.formGroup.get('staffPhone2')?.setValue('');
    this.formGroup.get('staffPhone3')?.setValue('');
    this.formGroup.get('staffPhoneType1')?.setValue('');
    this.formGroup.get('staffPhoneType2')?.setValue('');
    this.formGroup.get('staffPhoneType3')?.setValue('');
    this.formGroup.get('staffAddress')?.setValue('');
    this.formGroup.get('permanentAddress')?.setValue('');
    this.formGroup.get('usedForMailling')?.setValue('');
  }
  addAddressToList() {
    if (this.formGroup.valid) {
      if (this.validateToAdd()) {
        if (this.checkMallingName(this.formGroup.get('staffMaillingName')?.value)) {
          if (!this.isEditAddress) {
            this.addressId = null;
            let data = {
              'staffMaillingName': this.formGroup.get('staffMaillingName')?.value,
              'staffCity': this.formGroup.get('staffCity')?.value,
              'staffState': this.formGroup.get('staffState')?.value,
              'staffEmail': this.formGroup.get('staffEmail')?.value,
              'staffWebsite': this.formGroup.get('staffWebsite')?.value,
              'staffFax': this.formGroup.get('staffFax')?.value,
              'staffZipcodes': this.formGroup.get('staffZipcodes')?.value,
              'staffPhone1': this.formGroup.get('staffPhone1')?.value,
              'staffPhone2': this.formGroup.get('staffPhone2')?.value,
              'staffPhone3': this.formGroup.get('staffPhone3')?.value,
              'staffPhoneType1': this.formGroup.get('staffPhoneType1')?.value,
              'staffPhoneType2': this.formGroup.get('staffPhoneType2')?.value,
              'staffPhoneType3': this.formGroup.get('staffPhoneType3')?.value,
              'staffAddress': this.formGroup.get('staffAddress')?.value,
              'permanentAddress': this.formGroup.get('permanentAddress')?.value,
              'usedForMailling': this.formGroup.get('usedForMailling')?.value
            }
            this.addressList.push(data);
          } else if (this.isEditAddress) {
            // if (!this.validationClass.isNullOrUndefined(this.addressId)) {
            this.addressList.forEach((element: any) => {
              if (element.id && this.addressId && element.id === this.addressId) {
                element.staffMaillingName = this.formGroup.get('staffMaillingName')?.value;
                element.staffCity = this.formGroup.get('staffCity')?.value;
                element.staffState = this.formGroup.get('staffState')?.value;
                element.staffEmail = this.formGroup.get('staffEmail')?.value;
                element.staffWebsite = this.formGroup.get('staffWebsite')?.value;
                element.staffFax = this.formGroup.get('staffFax')?.value;
                element.staffZipcodes = this.formGroup.get('staffZipcodes')?.value;
                element.staffPhone1 = this.formGroup.get('staffPhone1')?.value;
                element.staffPhone2 = this.formGroup.get('staffPhone2')?.value;
                element.staffPhone3 = this.formGroup.get('staffPhone3')?.value;
                element.staffPhoneType1 = this.formGroup.get('staffPhoneType1')?.value;
                element.staffPhoneType2 = this.formGroup.get('staffPhoneType2')?.value;
                element.staffPhoneType3 = this.formGroup.get('staffPhoneType3')?.value;
                element.staffAddress = this.formGroup.get('staffAddress')?.value;
                element.permanentAddress = this.formGroup.get('permanentAddress')?.value;
                element.usedForMailling = this.formGroup.get('usedForMailling')?.value;
              } else {
                if (element.staffMaillingName && this.staffMaillingName && element.staffMaillingName === this.staffMaillingName) {
                  element.staffMaillingName = this.formGroup.get('staffMaillingName')?.value;
                  element.staffCity = this.formGroup.get('staffCity')?.value;
                  element.staffState = this.formGroup.get('staffState')?.value;
                  element.staffEmail = this.formGroup.get('staffEmail')?.value;
                  element.staffWebsite = this.formGroup.get('staffWebsite')?.value;
                  element.staffFax = this.formGroup.get('staffFax')?.value;
                  element.staffZipcodes = this.formGroup.get('staffZipcodes')?.value;
                  element.staffPhone1 = this.formGroup.get('staffPhone1')?.value;
                  element.staffPhone2 = this.formGroup.get('staffPhone2')?.value;
                  element.staffPhone3 = this.formGroup.get('staffPhone3')?.value;
                  element.staffPhoneType1 = this.formGroup.get('staffPhoneType1')?.value;
                  element.staffPhoneType2 = this.formGroup.get('staffPhoneType2')?.value;
                  element.staffPhoneType3 = this.formGroup.get('staffPhoneType3')?.value;
                  element.staffAddress = this.formGroup.get('staffAddress')?.value;
                  element.permanentAddress = this.formGroup.get('permanentAddress')?.value;
                  element.usedForMailling = this.formGroup.get('usedForMailling')?.value;
                }
              }
            });
            // } else {

            // }
          }
          this.dataSource1 = new MatTableDataSource(this.addressList);
          this.bindAddressValueToFB();
          this.toastr.success('Successfully added in list of addresses! To save it against record please click on Save & Close button.', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.isEditAddress = false;
        } else {

        }
      } else {
        // this.toastr.error('Empty details can not be added as address.', '', {
        this.toastr.error('Staff mailling name field is required!', '', {
          timeOut: 5000,
          closeButton: true
        });
      }
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffName')?.value) {
        this.toastr.info('Please enter the staff name!', '', {
          timeOut: 5000,
          closeButton: true
        });
        return;
      }
      if (this.formGroup?.get('staffEmail')?.value) {
        if (!this.formGroup?.get('staffEmail')?.valid) {
          this.toastr.info('Please enter the correct email, this email is not valid!', '', {
            timeOut: 5000,
            closeButton: true
          });
          return;
        }
      }
    }
  }
  validateToAdd() {
    // if (this.validationClass.isEmpty(this.formGroup.get('staffMaillingName')?.value)
    //   && this.validationClass.isEmpty(this.formGroup.get('staffEmail')?.value)
    //   && this.validationClass.isEmpty(this.formGroup.get('staffFax')?.value)
    //   && this.validationClass.isEmpty(this.formGroup.get('staffPhone1')?.value)
    //   && this.validationClass.isEmpty(this.formGroup.get('staffPhone2')?.value)
    //   && this.validationClass.isEmpty(this.formGroup.get('staffPhone3')?.value)) {
    //   return false
    // }
    // return true;
    if (this.validationClass.isEmpty(this.formGroup.get('staffMaillingName')?.value)) {
      return false
    }
    return true;
  }
  editAddress(element: any, index: number) {
    this.staffMaillingName = null;
    this.isEditAddress = true;
    this.addressId = element.id;
    this.staffMaillingName = element.staffMaillingName;
    this.addressListIndex = index;
    this.formGroup.get('staffMaillingName')?.setValue(element.staffMaillingName);
    this.formGroup.get('staffCity')?.setValue(element.staffCity);
    this.formGroup.get('staffState')?.setValue(element.staffState);
    this.formGroup.get('staffEmail')?.setValue(element.staffEmail);
    this.formGroup.get('staffWebsite')?.setValue(element.staffWebsite);
    this.formGroup.get('staffFax')?.setValue(element.staffFax);
    this.formGroup.get('staffZipcodes')?.setValue(element.staffZipcodes);
    this.formGroup.get('staffPhone1')?.setValue(element.staffPhone1);
    this.formGroup.get('staffPhone2')?.setValue(element.staffPhone2);
    this.formGroup.get('staffPhone3')?.setValue(element.staffPhone3);
    this.formGroup.get('staffPhoneType1')?.setValue(element.staffPhoneType1);
    this.formGroup.get('staffPhoneType2')?.setValue(element.staffPhoneType2);
    this.formGroup.get('staffPhoneType3')?.setValue(element.staffPhoneType3);
    this.formGroup.get('staffAddress')?.setValue(element.staffAddress);
    this.formGroup.get('permanentAddress')?.setValue(element.permanentAddress);
    this.formGroup.get('usedForMailling')?.setValue(element.usedForMailling);
    window.scrollTo(0, 0);
  }

  deleteAddress(element: any, index: number) {
    if (!this.validationClass.isNullOrUndefined(this.addressId)) {
      this.addressList = this.addressList.filter((item: any) => item.id !== this.addressId);
    } else {
      this.addressList = this.addressList.splice(0, index);
    }
    this.dataSource1 = new MatTableDataSource(this.addressList);
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
      id: this.formGroup?.get('id')?.value,
      staffId: this.formGroup?.get('staffId')?.value,
      staffName: this.formGroup?.get('staffName')?.value,
      staffTitle: this.formGroup?.get('title')?.value,
      staffActive: this.formGroup?.get('staffActive')?.value,
      staffTutor: this.formGroup?.get('staffTutor')?.value,
      staffSSNO: this.formGroup?.get('ssn')?.value,
      staffCounselor: this.formGroup?.get('staffCounselor')?.value,
      staffTeacher: this.formGroup?.get('staffTeacher')?.value,
      staffLab: this.formGroup?.get('staffLab')?.value,
      staffCodes: this.formGroup?.get('codes')?.value,
      staffDOB: this.formGroup?.get('dob')?.value,
      staffSpouseName: this.formGroup?.get('spouse')?.value,
      staffHireDate: this.formGroup?.get('staffHireDate')?.value,
      staffDriverLicense: this.formGroup?.get('license')?.value,
      staffTerminationDate: this.formGroup?.get('terminationDate')?.value,
      staffCustomFieldOne: this.formGroup?.get('customField1')?.value,
      staffCustomFieldTwo: this.formGroup?.get('customField2')?.value,
      staffCustomFieldThree: this.formGroup?.get('customField3')?.value,
      staffCustomFieldFour: this.formGroup?.get('customField4')?.value,
      staffNotes: this.formGroup?.get('notes')?.value,
      staffPicture: this.formGroup?.get('picture')?.value,
      staffBolt: this.formGroup?.get('staffBolt')?.value,
      staffPhoneNumber: this.formGroup?.get('staffPhoneNumber')?.value,
      staff: this.formGroup?.get('staff')?.value,
      address: this.addressList
    };
  }

  applyFilter(filterValue: any) {
    if (filterValue.target.value.trim().toLowerCase() == 'no') {
      console.log(this.staffMembersList);
      this.dataSource.filter = 'false';
    } else if (filterValue.target.value.trim().toLowerCase() == 'yes') {
      this.dataSource.filter = 'true';
    } else {
      this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
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
    this.createForm();
    this.staffMembersService.getStaffMaxId().subscribe(result => {
      if (!this.validationClass.isNullOrUndefined(result)) {
        this.formGroup.get('staffId')?.setValue(result + 1);
      } else {
        this.formGroup.get('staffId')?.setValue(1);
      }
    });
    // this.id = ''; this.staffName = ''; this.title = ''; this.staffActive = 'true'; this.staffTutor = ''; this.ssn = ''; this.staffCounselor = ''; this.staffTeacher = ''; this.staffLab = ''; this.codes = ''; this.dob = ''; this.spouse = ''; this.staffHireDate = ''; this.license = ''; this.terminationDate = ''; this.customField1 = ''; this.customField2 = ''; this.customField3 = ''; this.customField4 = ''; this.notes = ''; this.picture = ''; this.staffBolt = '';
  }

  checkMallingName(mallingName: any) {
    if (this.staffMaillingName && mallingName && mallingName.trim() === this.staffMaillingName) {
      return true;
    } else {
      const data = this.addressList.filter((item: any) => (item.staffMaillingName).toLowerCase().trim() === (mallingName).toLowerCase().trim());
      if (data && data.length > 0) {
        this.toastr.info('Staff Malling Name is already exist', '', {
          timeOut: 5000,
          closeButton: true
        });
        this.formGroup.get('staffMaillingName')?.setValue('');
        return false;
      } else {
        this.formGroup.get('staffMaillingName')?.setValue(mallingName);
        return true;
      }
    }
  }

  checkName(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      let staffName = this.formGroup?.get('staffName')?.value;
      this.staffMembersService.getStaffNameByOrgId(staffName).subscribe(result3 => {
        if (result3) {
          this.toastr.info('Staff Name is already exist!', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.formGroup.get('staffName')?.setValue('');
          return;
        }else {
          this.stctlbName = event.target.value;
        }
      });
    }
  }

  checkMallingStaffName(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      this.checkMallingName(this.formGroup?.get('staffMaillingName')?.value);
    }
  }

  checkValidDate(event: any) {
    const today = new Date(event.target.value);
    this.minTermDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    this.isHireValid = false;
  }
  enabledHireDate(event: any) {
    if (!this.validationClass.isEmpty(event.target.value) && !this.validationClass.isNullOrUndefined(event.target.value)) {
      this.isDOBValid = false;
    }
  }

  onFileChange(event: any, fileInput: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      console.log(file);
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadfile = reader.result;
        };
      } else {
        fileInput.value = "";
        this.imageSrc = "../../../../../assets/img/photo.png";
        this.toastr.info('File type should be jpeg or png!', '', {
          timeOut: 5000,
          closeButton: true
        });
      }
    }
  }

  /**
* @method showMoveItemPopup
* @description Open the popup for move the record
*/
  showMoveItemPopup() {
    if (this.selectedRow) {
      //this.showLoader();
      const confirmDialog = this.dialog.open(StaffMemberMoveBoxComponent, {
        data: {
          title: 'Customize Staff Member',
          message: '',
          staffList: this.staffMembersList,
          selectedId: this.selectedRow.id,
          selectedStaffId: this.selectedRow.staffId,
          selectedStaffName: this.selectedRow.staffName,
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.showLoader();
          this.getStaffMembers();
        }
      });
    } else {
      this.toastr.info('Please select a row to move', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }


  /**
  * @method showMergeItemPopup
  * @description Open the popup for merge the record
  */
  showMergeItemPopup() {
    if (this.selectedRow) {
      //this.showLoader();
      const confirmDialog = this.dialog.open(StaffMemberMergeBoxComponent, {
        data: {
          title: 'Customize Staff Member',
          message: 'Are you sure, you want to merge this record ' + this.selectedRow.staffName,
          staffList: this.staffMembersList,
          selectedId: this.selectedRow.id,
          selectedStaffId: this.selectedRow.staffId,
          selectedStaffName: this.selectedRow.staffName
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.getStaffMembers();
        }
      });
    } else {
      this.toastr.info('Please select a row to merge', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }

  /**
     * @method print
     * @description show print and download the data.
     */
  print() {
    var doc = new jsPDF('l', 'mm', 'a4');
    const head = [['Staff ID', 'Staff Name', 'Title', 'Active', 'Counselor', 'Tutor', 'Teacher', 'Bolt', 'Staff', 'Lab', 'Phone Number', 'Hire date']]
    let data: any = [];
    this.staffSearchMembersList.forEach((e: any) => {
      var tempObj = [];
      tempObj.push(e.staffId);
      tempObj.push(e.staffName);
      tempObj.push(e.staffTitle);
      tempObj.push(e.staffActive);
      tempObj.push(e.staffCounselor);
      tempObj.push(e.staffTutor);
      tempObj.push(e.staffTeacher);
      tempObj.push(e.staffBolt);
      tempObj.push(e.staff);
      tempObj.push(e.staffLab);
      if (e.staffPhoneNumber) {
        tempObj.push(e.staffPhoneNumber.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
      }
      if (e.staffHireDate) {
        tempObj.push(this.datepipe.transform(e.staffHireDate, 'dd/MM/y'));
      }
      data.push(tempObj);
    });
    autoTable(doc, {
      head: head,
      body: data,
      theme: "grid",
      showHead: "everyPage",
      margin: { left: 20, right: 20, top: 30, bottom: 40 },
      startY: 25,
      headStyles: {
        fillColor: [0, 57, 107]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      tableLineColor: [208, 208, 208],
      tableLineWidth: 0.1,
      //styles : { halign : 'center'},
      bodyStyles: {
        fontSize: 12
      },
      styles: {
        cellPadding: 3
      },
      didDrawPage: function (data) {

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        //doc.text("Compansol TRIO College Listing", data.settings.margin.left, 10);
        doc.text("Compansol TRIO Staff Members Listing", 140, 15, {
          align: 'center'
        });

      },
      didDrawCell: (data) => { },
    });
    doc.setProperties({
      title: "Staff Members"
    });
    window.open(doc.output('bloburl').toString(), '_blank');
  }

  searchFields() {
    let staffHireDate1 = this.searchFormGroup?.get('staffHireDate1')?.value;
    let staffHireDate2 = this.searchFormGroup?.get('staffHireDate2')?.value;
    let activeStaff = this.searchFormGroup?.get('activeStaff')?.value;
    let codesStaff = this.searchFormGroup?.get('codesStaff')?.value;
    let date1: any;
    let date2: any;
    let data: any = this.staffMembersList;
    
    if (staffHireDate1 && staffHireDate2) {
      date1 = this.datepipe.transform(new Date(staffHireDate1), 'dd/MM/y');
      date2 = this.datepipe.transform(new Date(staffHireDate2), 'dd/MM/y');
    }
    if ((staffHireDate1 && staffHireDate2) || activeStaff || codesStaff) {
      let verifyAll = '';
      if(activeStaff == 'all'){
        activeStaff = null;
        verifyAll == 'all';
      }else{
        activeStaff = this.searchFormGroup?.get('activeStaff')?.value;
        verifyAll == 'all';
      }
      if ((staffHireDate1 && staffHireDate2) && activeStaff && codesStaff) {
        data = data.filter((item: any) => (
          (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) >= (date1) && (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) <= (date2)
          && ((item.staffActive) === (JSON.parse(activeStaff))) && ((item.staffCodes && item.staffCodes.trim()) === (codesStaff.trim()))
        ));
      }

      if ((staffHireDate1 && staffHireDate2) && activeStaff) {
        data = data.filter((item: any) => (
          (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) >= (date1) && (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) <= (date2)
          && ((item.staffActive) === (JSON.parse(activeStaff)))
        ));
      }

      if ((staffHireDate1 && staffHireDate2) && codesStaff) {
        data = data.filter((item: any) => (
          (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) >= (date1) && (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) <= (date2)
          && ((item.staffCodes && item.staffCodes.trim()) === (codesStaff.trim()))
        ));
      }

      if (activeStaff && codesStaff) {
        data = data.filter((item: any) => (
          ((item.staffActive) === (JSON.parse(activeStaff))) && ((item.staffCodes && item.staffCodes.trim()) === (codesStaff.trim()))
        ));
      }

      if ((staffHireDate1 && staffHireDate2)) {
        data = data.filter((item: any) => (
          (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) >= (date1) && (item.staffHireDate && this.datepipe.transform(new Date(item.staffHireDate), 'dd/MM/y')) <= (date2)
        ));
      }

      if (activeStaff) {
        data = data.filter((item: any) => (((item.staffActive) === (JSON.parse(activeStaff)))
        ));
      }

      if (codesStaff) {
        data = data.filter((item: any) => (
          ((item.staffCodes && item.staffCodes.trim()) === (codesStaff.trim()))
        ));
      }

      if(verifyAll){
        data = data.filter((item: any) => (((item.staffActive) === (JSON.parse("true"))) || ((item.staffActive) === (JSON.parse("false")))
        ));
      }

      this.spinner = false;
      // this.staffMembersList = data;
      this.staffSearchMembersList = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.selectedRowIndex = null;
      this.dataSource.sort = this.sort;

    } else {
      this.toastr.info('Please select correct fields for searching!', '', {
        timeOut: 5000,
        closeButton: true
      });
      return;
    }
  }
}
