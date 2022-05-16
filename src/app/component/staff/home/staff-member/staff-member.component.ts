import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';

import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzUploadChangeParam,NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';


import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { StaffMemberMoveBoxComponent } from 'src/app/component/admin/customize/move-box/staff-member-move-box/staff-member-move-box.component';
import { StaffMemberMergeBoxComponent } from 'src/app/component/admin/customize/merge-box/staff-member-merge-box/staff-member-merge-box.component';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { ServiceUrls } from 'src/app/constants/serviceUrl';

@Component({
  selector: 'app-staff-member',
  templateUrl: './staff-member.component.html',
  styleUrls: ['./staff-member.component.css']
})

export class StaffMemberComponent {

  size: NzButtonSize = 'small';
  isVisible: boolean = false;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  }

  public staffMembersList: any = [];
  public staffSearchMembersList: any = [];
  public selectedOption: any;
  public selectedRow: any = null;
  public selectedRowData: any;
  public selectedRowIndex: any;
  myElement: any = null;
  isLoading: boolean = true;
  public customFieldList: any = [];
  public isEdit: boolean;
  public activeToggle: boolean = true;
  imageSrc = "../../../../../assets/img/photo.png";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  codeListArray: any = [];
  customFieldListArray1: any = [];
  customFieldListArray2: any = [];
  customFieldListArray3: any = [];
  customFieldListArray4: any = [];
  cityList: any = [];
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
  staffNameModalHeader = 'Add Staff Name';
  staffNameListPopupVisiblity = false;
  isConfirmStaffNameLoading = false;
  displayStaffName: any;
  uploadAction:any;

  staffModalHeader = 'Staff Data Entry';
  staffListPopupVisiblity = false;
  isConfirmStaffLoading = false;

  constructor(
      private formBuilder: FormBuilder
    , private staffMembersService: StaffMembersService
    , private dialog: MatDialog
    , private sharedService: SharedService,
    private datepipe: DatePipe,
    private pullDownService: PullDownListService,
    private notificationService: NotificationUtilities
  ) {
  }

  ngOnInit(): void {
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
    this.searchFormGroup?.get('activeStaff')?.setValue('all');

  }

  setHeaders = () => {

   const state = sessionStorage.getItem("state");
      let access_token = "";
      if (state) {
        access_token = JSON.parse(state)?.access_token;
      }
    return  { authorization: 'Bearer '+ access_token }

  };

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {

      return new Observable((observer: Observer<boolean>) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          alert("You can only upload JPG/PNG file!")
          observer.complete();
          return;
        }
        const isLt2M = file.size! / 1024 / 1024 < 2;
        if (!isLt2M) {
          alert("Image must smaller than 2MB!");
          observer.complete();
          return;
        }
        observer.next(isJpgOrPng && isLt2M);
        observer.complete();
      });
    };

    fileList: NzUploadFile[] = [];

  imageChange(info: NzUploadChangeParam): void {

  let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      this.fileList = fileList;
    if(info.file.response && info.file.response.body.staffPicture) {
      this.imageSrc = info.file.response.body.staffPicture;
    }
  }

  /**
   * @method bindDropDownValues
   * @description Shwing pulldown list according parameters
   */
  bindDropDownValues() {
    let data: any = 'CITY,STATE,STAFF CODES,CUSTOM1,CUSTOM2,CUSTOM3,CUSTOM4,PHONE TYPE';
    this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
      if (result?.CITY) {
        this.cityList = result.CITY;
      }
      if (result?.STATE) {
        this.stateList = result.STATE;
      }
      if (result['STAFF CODES']) {
        this.codeListArray = result['STAFF CODES'];
      }
      if (result?.CUSTOM1) {
        this.customFieldListArray1 = result.CUSTOM1;
      }
      if (result?.CUSTOM2) {
        this.customFieldListArray2 = result.CUSTOM2;
      }
      if (result?.CUSTOM3) {
        this.customFieldListArray3 = result.CUSTOM3;
      }
      if (result?.CUSTOM4) {
        this.customFieldListArray4 = result.CUSTOM4;
      }
      if (result['PHONE TYPE']) {
        this.phoneTypesList = result['PHONE TYPE'];
      }
    });
  }

  /**
    * @method createForm
    * @description initialize staff fileds
    */
  createForm() {
    this.formGroup = this.formBuilder.group({
      'formLayout': ['vertical'],
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

  /**
    * @method createSearchForm
    * @description initialize serching fileds
    */
  createSearchForm() {
    this.searchFormGroup = this.formBuilder.group({
      'formLayout': ['vertical'],
      'staffHireDate1': [''],
      'staffHireDate2': [''],
      'activeStaff': [''],
      'codesStaff': ['']
    });
  }

  /**
    * @method addStaffMembers
    * @description add the staff members
    */
  public addStaffMembers() {
    if (this.formGroup.valid) {
      this.isEdit = false;
      this.isConfirmStaffLoading = true;
      this.staffMembersService
        .addStaffMembers(this.requestPayload(), this.uploadfile)
        .subscribe((result: any) => {
          if (result) {
            this.notificationService.createNotificationBasic('success', "success", 'Saved Successfully!');
            this.staffListPopupVisiblity = false;
            this.getStaffMembers();
            this.isConfirmStaffLoading = false;
          } else {
            this.isConfirmStaffLoading = false;
          }
        });
    } else {
      if (!this.formGroup?.get('staffName')?.value) {
        Object.values(this.formGroup.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return;
      }
    }
  }

  /**
    * @method updateSelectedRow
    * @description update the selected row
    */
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
            this.notificationService.createNotificationBasic('info', "info", 'Staff Name is already exist!');
            this.formGroup.get('staffName')?.setValue('');
            return;
          }
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffName')?.value) {
        this.notificationService.createNotificationBasic('info', "info", 'Please enter the staff name!');
        return;
      }
    }

    this.getStaffMembers();
  }

  /**
    * @method updateStaffList
    * @description update the staff members list
    */
  updateStaffList() {
    this.showLoader();
    this.staffMembersService
      .addStaffMembers(this.requestPayload(), this.uploadfile)
      .subscribe((result: any) => {
        if (result) {
          this.selectedRow = null;
          this.notificationService.createNotificationBasic('success', "success", 'Updated Successfully!');
          this.isConfirmStaffLoading = false;
          this.getStaffMembers();
          this.staffListPopupVisiblity = false;
          this.hideLoader();
        } else {
          this.staffListPopupVisiblity = false;
          this.hideLoader();
        }
      });
  }

  /**
   * @method getStaffMembers
   * @description edit the staff members
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
    * @description get the staff members list
    */
  public getStaffMembers() {
    this.showLoader();
    this.staffMembersService.getStaffMembers().subscribe((result: any) => {
      if (result) {
        this.staffMembersList = result;
        this.staffSearchMembersList = result;
        setTimeout(() => {
          this.staffDom = window.document.getElementById('Staff_Detail');
          this.addressDom = window.document.getElementById('Address');
        }, (500));
        this.selectedRowIndex = null;
        this.hideLoader();
      } else {
        this.hideLoader();
      }
    });
  }

  /**
    * @method deleteStaffMembers
    * @description deleted the staff members
    */
  public deleteStaffMembers(selectedRowItem: any, index: any) {
    this.selectedRowIndex = index;
    const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
    this.selectedRow = selectedRowItem;
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
                this.notificationService.createNotificationBasic('success', "success", 'Deleted Successfully!');
                this.getStaffMembers();
                this.hideLoader();
              }
            });

        } else {
          this.hideLoader();
        }
      });
    } else {
      this.notificationService.createNotificationBasic('info', "info", 'Please select a row to delete!');
    }
  }

  /**
    * @method filterStaffMembers
    * @description filtering staff members
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
  public getSelectedOption(selectedOption: string, selectedRowItem: any, index: any) {
    this.selectedOption = selectedOption;
    if (this.selectedOption === 'Edit') {
      this.imageSrc = "../../../../../assets/img/photo.png";
      this.selectedRowIndex = index;
      const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
      this.selectedRow = selectedRowItem;
      if (this.selectedRow) {
        this.addressList = [];
        this.isEdit = true;
        this.uploadAction = ServiceUrls.UPLOAD_FILE+"/"+this.selectedRow.id;
        this.stctlbName = this.selectedRow.staffName;
        this.displayStaffName = this.selectedRow.staffName;
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
        if(this.selectedRow.staffPicture)
         this.imageSrc = this.selectedRow.staffPicture;
        if (this.selectedRow.address && this.selectedRow.address.length > 0) {
          this.addressData = this.selectedRow.address;
          this.permanentAddress = this.selectedRow.address.filter((item: any) => item.permanentAddress)[0];
          this.bindAddressValueToFB();
          this.addressList = this.selectedRow.address;
        } else {
          this.addressData = [];
          this.permanentAddress = '';
          this.bindAddressValueToFB();
          this.addressList = [];
        }
        this.staffListPopupVisiblity = true;
        // this.staffMembersModalForm.updateValueAndValidity();
      } else {
        this.notificationService.createNotificationBasic('info', "info", 'Please select a row to update');
      }
    } else {
      this.staffListPopupVisiblity = true;
    }
  }

  /**
    * @method addStaffMemberName
    * @description Adding staff member using staffId
    */
  public addStaffMemberName() {
    if (this.formGroup.valid) {
      this.isEdit = false;
      let staffName = this.formGroup?.get('staffName')?.value;
      this.staffMembersService.getStaffNameByOrgId(staffName).subscribe(result3 => {
        if (result3) {
          this.notificationService.createNotificationBasic('info', "info", 'Staff Name is already exist!');
          this.formGroup.get('staffName')?.setValue('');
          return;
        } else {
          this.isConfirmStaffNameLoading = true;
          this.staffMembersService
            .addStaffMembers(this.requestPayload(), this.uploadfile)
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.createNotificationBasic('success', "success", 'Saved Successfully!');
                let jsonObj = JSON.parse(result)
                this.formGroup.get('staffName')?.setValue(jsonObj.staffName);
                this.displayStaffName = this.formGroup?.get('staffName')?.value;
                this.formGroup.get('staffId')?.setValue(jsonObj.staffId);
                this.formGroup.get('id')?.setValue(jsonObj.id);
                this.staffNameListPopupVisiblity = false;
                this.uploadAction = ServiceUrls.UPLOAD_FILE+"/"+jsonObj.id;
                this.getStaffMembers();
                this.isConfirmStaffNameLoading = false;
                this.staffListPopupVisiblity = true;
              } else {
                this.isConfirmStaffNameLoading = false;
              }
            });
        }
      });
    } else {
      if (!this.formGroup?.get('staffName')?.value) {
        Object.values(this.formGroup.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return;
      }
    }
  }

  /**
   * @method showStaffNamePop
   * @description Showing add staff name pop
   */
  showStaffNamePop() {
    this.addressList = [];
    this.isEdit = false;
    this.isEditAddress = false;
    this.resetFields();
    this.staffNameListPopupVisiblity = true;
  }

  /**
   * @method bindAddressValueToFB
   * @description binging the formgroup
   */
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

  /**
   * @method addAddressToList
   * @description adding the multiple address into list
   */
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
              'usedForMailling': this.formGroup.get('usedForMailling')?.value,
              'staffPicture':this.imageSrc

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
          this.bindAddressValueToFB();
          this.notificationService.createNotificationBasic('success', "success", 'Successfully added in list of addresses! To save it against record please click on Save & Close button!');
          this.isEditAddress = false;
        } else {

        }
      } else {
        this.notificationService.createNotificationBasic('info', "info", 'Staff mailling name field is required!');
        Object.values(this.formGroup.controls).forEach(control => {
          if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
          }
      });
      }
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffName')?.value) {
        this.notificationService.createNotificationBasic('info', "info", 'Please enter the staff name!');
        return;
      }
      if (this.formGroup?.get('staffEmail')?.value) {
        if (!this.formGroup?.get('staffEmail')?.valid) {
          this.notificationService.createNotificationBasic('info', "info", 'Please enter the correct email, this email is not valid!');
          return;
        }
      }
    }
    this.getStaffMembers();
  }

  /**
   * @method validateToAdd
   * @description validating the staff mailling name
   */
  validateToAdd() {
    if (this.validationClass.isEmpty(this.formGroup.get('staffMaillingName')?.value)) {
      return false
    }
    return true;
  }

  /**
   * @method editAddress
   * @description update the address using name
   */
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

  /**
    * @method deleteAddress
    * @description deleted the address to list
    */
  deleteAddress(element: any, index: number) {
    if (!this.validationClass.isNullOrUndefined(this.addressId)) {
      this.addressList = this.addressList.filter((item: any) => item.id !== this.addressId);
    } else {
      this.addressList = this.addressList.splice(0, index);
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
      staffPicture: this.imageSrc,
      staffBolt: this.formGroup?.get('staffBolt')?.value,
      staffPhoneNumber: this.formGroup?.get('staffPhoneNumber')?.value,
      staff: this.formGroup?.get('staff')?.value,
      address: this.addressList
    };
  }

  /**
    * @method applyFilter
    * @description apply the content filter
    */
  applyFilter(search: any) {
    const targetValue: any[] = [];
    this.staffSearchMembersList.forEach((value: any) => {
      if(search && search.trim().toLowerCase() == 'no'){
        search = 'false';
      }else if(search && search.trim().toLowerCase() == 'yes'){
        search = 'true';
      }
      //let keys = Object.keys(value);
      let keys = ["staffId", "staffName", "staffTitle", "staffActive","staffCounselor", "staffTutor", "staffTeacher","staffLab" , "staffBolt","staff", "staffPhoneNumber","staffHireDate"];
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.staffMembersList = targetValue;
  }

  /**
    * @method setSelectedRow
    * @description It is used for added selected row
    */
  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
    //    if (data && data.length > 0) {
    this.selectedRow = selectedRowItem;
    //   }
  }

  /**
    * @method hideLoader
    * @description hinding loader.
    */
  hideLoader() {
    this.isLoading = false;
  }

  /**
    * @method showLoader
    * @description showing loader.
    */
  showLoader() {
    this.isLoading = true;
  }

  /**
    * @method resetFields
    * @description reset all form group fields.
    */
  resetFields() {
    this.createForm();
    this.imageSrc = "../../../../../assets/img/photo.png";
    this.staffMembersService.getStaffMaxId().subscribe(result => {
      if (!this.validationClass.isNullOrUndefined(result)) {
        this.formGroup.get('staffId')?.setValue(result + 1);
      } else {
        this.formGroup.get('staffId')?.setValue(1);
      }
    });
  }

  /**
    * @method checkMallingName
    * @description verifying malling name already exist or not.
    */
  checkMallingName(mallingName: any) {
    if (this.staffMaillingName && mallingName && mallingName.trim() === this.staffMaillingName) {
      return true;
    } else {
      const data = this.addressList.filter((item: any) => (item.staffMaillingName).toLowerCase().trim() === (mallingName).toLowerCase().trim());
      if (data && data.length > 0) {
        this.notificationService.createNotificationBasic('info', "info", 'Staff Malling Name is already exist!');
        this.formGroup.get('staffMaillingName')?.setValue('');
        return false;
      } else {
        this.formGroup.get('staffMaillingName')?.setValue(mallingName);
        return true;
      }
    }
  }

  /**
    * @method checkName
    * @description verifying staff name already exist or not.
    */
  checkName(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      let staffName = this.formGroup?.get('staffName')?.value;
      this.staffMembersService.getStaffNameByOrgId(staffName).subscribe(result3 => {
        if (result3) {
          this.notificationService.createNotificationBasic('info', "info", 'Staff Name is already exist!');
          this.formGroup.get('staffName')?.setValue('');
          return;
        } else {
          this.stctlbName = event.target.value;
        }
      });
    }
  }

  /**
    * @method checkMallingStaffName
    * @description verifying mailling staff name already exis or not.
    */
  checkMallingStaffName(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      this.checkMallingName(this.formGroup?.get('staffMaillingName')?.value);
    }
  }

  /**
    * @method checkValidDate
    * @description validate the age of user.
    */
  checkValidDate(event: any) {
    const today = new Date(event.target.value);
    this.minTermDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    this.isHireValid = false;
  }

  /**
    * @method enabledHireDate
    * @description enable the hire date of user.
    */
  enabledHireDate(event: any) {
    if (!this.validationClass.isEmpty(event.target.value) && !this.validationClass.isNullOrUndefined(event.target.value)) {
      this.isDOBValid = false;
    }
  }

  /**
    * @method onFileChange
    * @description upload the staff member image.
    */
  onFileChange(event: any, fileInput: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadfile = reader.result;
        };
      } else {
        fileInput.value = "";
        this.imageSrc = "../../../../../assets/img/photo.png";
        this.notificationService.createNotificationBasic('info', "info", 'File type should be jpeg or png!');
      }
    }
  }

  /**
* @method showMoveItemPopup
* @description Open the popup for move the record
*/
  showMoveItemPopup(selectedRowItem: any, index: any) {
    this.selectedRowIndex = index;
    const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
    this.selectedRow = selectedRowItem;
    if (this.selectedRow) {
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
      this.notificationService.createNotificationBasic('info', "info", 'Please select a row to move!');
    }
  }


  /**
  * @method showMergeItemPopup
  * @description Open the popup for merge the record
  */
  showMergeItemPopup(selectedRowItem: any, index: any) {
    this.selectedRowIndex = index;
    const data = this.customFieldList.filter((item: any) => item.id === selectedRowItem.id);
    this.selectedRow = selectedRowItem;
    if (this.selectedRow) {
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
      this.notificationService.createNotificationBasic('info', "info", 'Please select a row to merge!');
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
    this.staffMembersList.forEach((e: any) => {
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

  /**
    * @method searchFields
    * @description apply the custom searching.
    */
  searchFields() {
    let staffHireDate1 = this.searchFormGroup?.get('staffHireDate1')?.value;
    let staffHireDate2 = this.searchFormGroup?.get('staffHireDate2')?.value;
    let activeStaff = this.searchFormGroup?.get('activeStaff')?.value;
    let codesStaff = this.searchFormGroup?.get('codesStaff')?.value;
    let date1: any;
    let date2: any;
    let data: any = this.staffSearchMembersList;

    if (staffHireDate1 && staffHireDate2) {
      date1 = this.datepipe.transform(new Date(staffHireDate1), 'dd/MM/y');
      date2 = this.datepipe.transform(new Date(staffHireDate2), 'dd/MM/y');
    }
    if ((staffHireDate1 && staffHireDate2) || activeStaff || codesStaff) {
      let verifyAll = '';
      if (activeStaff == 'all') {
        activeStaff = null;
        verifyAll == 'all';
      } else {
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

      if (verifyAll) {
        data = data.filter((item: any) => (((item.staffActive) === (JSON.parse("true"))) || ((item.staffActive) === (JSON.parse("false")))
        ));
      }

      this.staffMembersList = data;
      this.selectedRowIndex = null;

    } else {
      this.notificationService.createNotificationBasic('info', "info", 'Please select correct fields for searching!');
      return;
    }
  }

  /**
    * @method sorting
    * @description Sorting for staff list.
    */
  sorting(attr: string) {
    if (this.staffMembersList.length > 0) {
      this.staffMembersList = [...this.staffMembersList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
    }
  }

  /**
    * @method sorting3
    * @description Sorting for staff list.
    */
  sorting2(attr: string) {
    if (this.staffMembersList.length > 0) {
      this.staffMembersList = [...this.staffMembersList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
    }
  }

  /**
    * @method sorting3
    * @description Sorting for address.
    */
  sorting3(attr: string) {
    if (this.addressList.length > 0) {
      this.addressList = [...this.addressList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
    }
  }

  /**
    * @method sorting4
    * @description Sorting for address.
    */
  sorting4(attr: string) {
    if (this.addressList.length > 0) {
      this.addressList = [...this.addressList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
    }
  }

  /**
    * @method handleCancel
    * @description close for popup.
    */
  handleCancel() {
    this.staffNameListPopupVisiblity = false;
    this.getStaffMembers();
  }

  /**
    * @method handleStaffCancel
    * @description close for popup.
    */
   handleStaffCancel() {
    this.staffListPopupVisiblity = false;
    this.getStaffMembers();
  }
}
