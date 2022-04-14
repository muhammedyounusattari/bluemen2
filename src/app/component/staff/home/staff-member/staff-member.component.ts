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
@Component({
  selector: 'app-staff-member',
  templateUrl: './staff-member.component.html',
  styleUrls: ['./staff-member.component.css']
})

export class StaffMemberComponent {
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

  columnsToDisplay: string[] = ['id', 'staffName', 'title', 'staffActive', 'staffCounselor', 'staffTutor', 'staffTeacher', 'staffBolt', 'staff', 'staffLab', 'staffPhoneNumber', 'staffHireDate'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  codeListArray = [{ 'name': '111' }, { 'name': '222' }];
  customFieldListArray1 = [{ 'name': 'Custom 1' }, { 'name': 'Custom 2' }, { 'name': 'Custom 3' }];
  customFieldListArray2 = [{ 'name': 'Custom 1' }, { 'name': 'Custom 2' }, { 'name': 'Custom 3' }];
  customFieldListArray3 = [{ 'name': 'Custom 1' }, { 'name': 'Custom 2' }, { 'name': 'Custom 3' }];
  customFieldListArray4 = [{ 'name': 'Custom 1' }, { 'name': 'Custom 2' }, { 'name': 'Custom 3' }];
  cityList = [{ 'name': 'London' }, { 'name': 'Pune' }, { 'name': 'New York' }];
  stateList = [{ 'name': 'Custom 1' }, { 'name': 'Custom 2' }, { 'name': 'Custom 3' }];
  phoneTypesList = [{ 'name': 'Work' }, { 'name': 'Home' }, { 'name': 'Office' }];

  formGroup: FormGroup;
  formGroup1: FormGroup;
  validationClass: ValidationClass = new ValidationClass();
  isStaffDetail = true;
  addressDom: any;
  staffDom: any;

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
    , private sharedService: SharedService
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
    this.getStaffMembers();
    this.bindDropDownValues();
    this.isEdit = false;
  }

  bindDropDownValues() {
    this.staffMembersService.getPullDownList().subscribe((result: any) => {
      if (result) {
        if (result.filter((item: any) => item.code === 'City')
          && result.filter((item: any) => item.code === 'City').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'City')[0].id)
            .subscribe(data => {
              if (data) {
                this.cityList = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'State_PostalAddress')
          && result.filter((item: any) => item.code === 'State_PostalAddress').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'State_PostalAddress')[0].id)
            .subscribe(data => {
              if (data) {
                this.stateList = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'Codes')
          && result.filter((item: any) => item.code === 'Codes').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'Codes')[0].id)
            .subscribe(data => {
              if (data) {
                this.codeListArray = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'CustomField1')
          && result.filter((item: any) => item.code === 'CustomField1').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'CustomField1')[0].id)
            .subscribe(data => {
              if (data) {
                this.customFieldListArray1 = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'CustomField2')
          && result.filter((item: any) => item.code === 'CustomField2').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'CustomField2')[0].id)
            .subscribe(data => {
              if (data) {
                this.customFieldListArray2 = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'CustomField3')
          && result.filter((item: any) => item.code === 'CustomField3').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'CustomField3')[0].id)
            .subscribe(data => {
              if (data) {
                this.customFieldListArray3 = data;
              }
            });
        }
        if (result.filter((item: any) => item.code === 'CustomField4')
          && result.filter((item: any) => item.code === 'CustomField4').length > 0) {
          this.staffMembersService.getPullDownItems(result.filter((item: any) => item.code === 'CustomField4')[0].id)
            .subscribe(data => {
              if (data) {
                this.customFieldListArray4 = data;
              }
            });
        }
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
        if (this.isStaffDetail) {
          this.staffDom.style.borderBottom = "thick solid #0000FF";
          this.addressDom.style.borderBottom = "unset";
        } else {
          this.staffDom.style.borderBottom = "unset";
          this.addressDom.style.borderBottom = "thick solid #0000FF";
        }
      }, (500));
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'id': [''],
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
      'staffEmail': [''],
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

    this.formGroup1 = this.formBuilder.group({

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
      this.staffMembersService
        .addStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.toastr.success('Saved Successfully !', '', {
              timeOut: 5000,
              closeButton: true
            });
            this.modalRef.hide();
            this.getStaffMembers();
          }
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  updateSelectedRow() {
    if (this.formGroup.valid) {
      this.isEdit = true;
      this.staffMembersService
        .addStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.selectedRow = null;
            this.toastr.success('Updated Successfully !', '', {
              timeOut: 5000,
              closeButton: true
            });
            this.modalRef.hide();
            this.getStaffMembers();
          }
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
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
      this.hideLoader();
      if (result) {
        this.spinner = false;
        this.staffMembersList = result;
        setTimeout(() => {
          this.staffDom = window.document.getElementById('Staff_Detail');
          this.addressDom = window.document.getElementById('Address');
          this.switchBetweenTabs('');
        }, (500));
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
    if (this.selectedRow) {
      this.showLoader();
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm remove record',
          message: 'Are you sure, you want to remove this record: ' + this.selectedRow.staffName
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.staffMembersService
            .deleteStaffMembers({ id: this.formGroup.get('id')?.value })
            .subscribe((result: any) => {
              if (result) {
                this.selectedRow = null;
                this.toastr.success('Deleted Successfully !', '', {
                  timeOut: 5000,
                  closeButton: true
                });
                this.getStaffMembers();
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
    this.selectedOption = selectedOption;
    // this.staffMembersModalForm.reset();
    // this.staffMembersModalForm.updateValueAndValidity();
    if (this.selectedOption === 'Edit') {
      if (this.selectedRow) {
        this.isEdit = true;
        //this.staffMembersModalForm.get('name')?.setValue(this.selectedRow.staffName);
        this.stctlbName = this.selectedRow.staffName;
        this.formGroup.get('staffName')?.setValue(this.selectedRow.staffName);
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
      this.isEdit = false;
      this.isEditAddress = false;
      this.stctlbName = '';
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
    if (this.validateToAdd()) {
      if (!this.isEditAddress) {
        this.addressId = null;
        const data = {
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
        if (!this.validationClass.isNullOrUndefined(this.addressId)) {
          this.addressList.forEach((element: any) => {
             if (element.id === this.addressId) {
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
          });
        } else {

        }
      }
      this.dataSource1 = new MatTableDataSource(this.addressList);
      this.bindAddressValueToFB();
      this.toastr.success('Successfully added in list of addresses! To save it against record please click on Save & Close button.', '', {
        timeOut: 5000,
        closeButton: true
      });
      this.isEditAddress = false;
    } else {
      this.toastr.error('Empty details can not be added as address.', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }
  validateToAdd() {
    if (this.validationClass.isEmpty(this.formGroup.get('staffMaillingName')?.value)
      && this.validationClass.isEmpty(this.formGroup.get('staffEmail')?.value)
      && this.validationClass.isEmpty(this.formGroup.get('staffFax')?.value)
      && this.validationClass.isEmpty(this.formGroup.get('staffPhone1')?.value)
      && this.validationClass.isEmpty(this.formGroup.get('staffPhone2')?.value)
      && this.validationClass.isEmpty(this.formGroup.get('staffPhone3')?.value)) {
      return false
    }
    return true;
  }
  editAddress(element: any, index: number) {
    this.isEditAddress = true;
    this.addressId = element.id;
    this.addressListIndex = index;
    this.formGroup.get('staffMaillingName')?.setValue(element.staffMaillingName);
    this.formGroup.get('staffCity')?.setValue(element.staffCity);
    this.formGroup.get('staffState')?.setValue(element.staffState);
    this.formGroup.get('staffEmail')?.setValue(element.staffEmail);
    this.formGroup.get('staffWebsite')?.setValue(element.staffWebsite);
    this.formGroup.get('staffFax')?.setValue(element.staffFax);
    this.formGroup.get('staffZipcodes')?.setValue(element.staffZipCodes);
    this.formGroup.get('staffPhone1')?.setValue(element.staffPhone1);
    this.formGroup.get('staffPhone2')?.setValue(element.staffPhone2);
    this.formGroup.get('staffPhone3')?.setValue(element.staffPhone3);
    this.formGroup.get('staffPhoneType1')?.setValue(element.staffPhoneType1);
    this.formGroup.get('staffPhoneType2')?.setValue(element.staffPhoneType2);
    this.formGroup.get('staffPhoneType3')?.setValue(element.staffPhoneType3);
    this.formGroup.get('staffAddress')?.setValue(element.staffAddress);
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
      staffBolt: this.formGroup?.get('staffBold')?.value,
      staffPhoneNumber: this.formGroup?.get('staffPhoneNumber')?.value,
      staff: this.formGroup?.get('staff')?.value,
      address: this.addressList
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
    this.createForm();
    // this.id = ''; this.staffName = ''; this.title = ''; this.staffActive = 'true'; this.staffTutor = ''; this.ssn = ''; this.staffCounselor = ''; this.staffTeacher = ''; this.staffLab = ''; this.codes = ''; this.dob = ''; this.spouse = ''; this.staffHireDate = ''; this.license = ''; this.terminationDate = ''; this.customField1 = ''; this.customField2 = ''; this.customField3 = ''; this.customField4 = ''; this.notes = ''; this.picture = ''; this.staffBolt = '';
  }

  checkName(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      const data = this.staffMembersList.filter((item: any) => (item.staffName).toLowerCase().trim() === (event.target.value).toLowerCase().trim());
      if (data && data.length > 0) {
        this.toastr.info('Name is already exist', '', {
          timeOut: 5000,
          closeButton: true
        });
        this.formGroup.get('staffName')?.setValue('');
      } else {
        this.stctlbName = event.target.value;
      }
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
}