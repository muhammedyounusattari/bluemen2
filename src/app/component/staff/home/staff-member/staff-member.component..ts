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
  formGroup: FormGroup;
  validationClass: ValidationClass = new ValidationClass();
  constructor(
    private modalService: BsModalService
    , private fb: FormBuilder
    , private formBuilder: FormBuilder
    , private staffMembersService: StaffMembersService
    , private dialog: MatDialog
    , private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getStaffMembers();
    this.isEdit = false;
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'id': [''],
      'staffName': ['', Validators.required],
      'staff': [false],
      'title': [''],
      'staffActive': [true],
      'staffTutor': [false],
      'ssn': ['', Validators.required],
      'staffCounselor': [false],
      'staffTeacher': [false],
      'staffLab': [false],
      'codes': ['', Validators.required],
      'dob': [new Date(), Validators.required],
      'spouse': [''],
      'staffHireDate': [new Date(), Validators.required],
      'license': [''],
      'terminationDate': [new Date(), Validators.required],
      'customField1': [''],
      'customField2': [''],
      'customField3': [''],
      'customField4': [''],
      'notes': [''],
      'picture': [''],
      'staffPhoneNumber': [''],
      'staffBolt': [false]
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
    // this.staffMembersService
    //   .editStaffMembers(request)
    //   .subscribe((result: any) => {
    //     if (result) {
    //       this.getStaffMembers();
    //     }
    //   });
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
      this.resetFields();
      this.openModal(this.staffDataEntryPopupRef);
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
}
