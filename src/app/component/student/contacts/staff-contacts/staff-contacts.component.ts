import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StaffContactsService } from 'src/app/services/staff/staff-contacts.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { Utility } from 'src/app/shared/global-constants/utility';

@Component({
  selector: 'staff-contacts',
  templateUrl: './staff-contacts.component.html',
  styleUrls: ['./staff-contacts.component.css']
})

export class StaffContactsComponent {
  public columnsToDisplay: string[] =
    ['firstName', 'lastName', 'phoneNumber', 'staffContactDate', 'staffContactStaff', 'staffTotalTime', 'staffRecontactDate'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  public serviceColumnsToDisplay: string[] = ['activity', 'totalTime'];
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  public serviceDataSource: MatTableDataSource<any>;

  @ViewChild('staffStudentPopup') staffStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('staffStudentEditPopup') staffStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  @ViewChild('activityServicePopup') activityServicePopupRef: TemplateRef<any>;
  public activityServiceModalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public activityServiceForm: FormGroup;
  public staffContactsEditModalForm: FormGroup;
  public staffContactsModalForm: FormGroup;
  public staffContactsList: any = [];
  public studentsList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;
  public selectedEditModalRow: any = null;
  public selectedEditModalRowData: any = null;
  public spinner: boolean = true;
  public activityServiceData: any = [];
  public isActivityEdit: boolean = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private staffContactsService: StaffContactsService
  ) {
    this.modalDataSource = this.dataSource = new MatTableDataSource();
    this.getStaffContacts();
  }

  ngOnInit(): void {
    this.initialiseForm();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.activityServiceForm = this.fb.group({
      activity: [''],
      time: [0]
    });

    this.staffContactsModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: ['']
    });

    this.staffContactsEditModalForm = this.fb.group({
      contactDate: [''],
      fiscalYear: ['2017'],
      recontactDate: [''],
      isReContacted: [''],
      tutor: [''],
      component: [''],
      aprSubject: [''],
      contactType: [''],
      subject: [''],
      instructions: [''],
      activityService: [''],
      totalTime: [{ value: 0, disabled: true }],
      notes: ['']
    });
  }


  /**
   * @method applyFilter
   */
  public applyFilter(filterValue: any, dataSource: MatTableDataSource<any>) {
    dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  /**
   * @method openModal
   */
  public openModal() {
    this.modalRef = this.modalService.show(this.staffStudentPopupRef, this.modalConfigSM);
    this.getStudentsList();
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    if (this.selectedOption === 'Edit') {
      this.patchValuesToForm();
    }
    this.editModalRef = this.modalService.show(this.staffStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method openActivityServiceModal
   */
  public openActivityServiceModal(selector: string) {
    this.isActivityEdit = selector === 'Edit';
    if (this.isActivityEdit) {
      if (this.activityServiceData.length > 0) {
        this.activityServiceForm.patchValue({
          activity: this.selectedEditModalRowData?.activityService,
          time: this.selectedEditModalRowData?.totalTime
        });
        this.activityServiceModalRef = this.modalService.show(this.activityServicePopupRef, this.modalConfigSM);
      }
    } else {
      this.activityServiceForm.patchValue({
        activity: this.staffContactsEditModalForm.controls['activityService'].value,
        time: 0
      });
      this.activityServiceModalRef = this.modalService.show(this.activityServicePopupRef, this.modalConfigSM);
    }
  }

  /**
   * @method getStaffContacts
   */
  public getStaffContacts() {
    this.spinner = true;
    this.staffContactsService.getStaffContacts().subscribe((result: any) => {
      if (result) {
        this.staffContactsList = result;
        this.spinner = false;
        this.selectedRow = null;
        this.dataSource = new MatTableDataSource(this.staffContactsList);
        this.getSelectedRow(this.staffContactsList[0], 0);
      }
    });
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.staffContactsService.getStudentsList().subscribe((result: any) => {
      if (result) {
        this.studentsList = result;
        this.spinner = false;
        this.selectedModalRow = null;
        this.modalDataSource = new MatTableDataSource(this.studentsList);
        this.getSelectedModalRow(this.studentsList[0], 0);
      }
    });
  }


  /**
   * @method addStaffContacts
   */
  public addStaffContacts() {
    this.staffContactsService
      .addStaffContacts(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getStaffContacts();
        }
      });
  }

  /**
   * @method editStaffContacts
   */
  public editStaffContacts(): any {
    if (this.selectedRowData == null) { return true; };
    let request: any = this.requestPayload();
    if (request['ssno'] == undefined) {
      request['ssno'] = this.selectedRowData.ssno
    }
    this.staffContactsService
      .editStaffContacts(request)
      .subscribe((result: any) => {
        if (result) {
          this.getStaffContacts();
        }
      });
  }

  /**
   * @method deleteStaffContacts
   */
  public deleteStaffContacts() {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm remove record',
          message: 'Are you sure, you want to remove this record: ' + this.selectedRow.activityGroupName
        }
      });
      confirmDialog.afterClosed().subscribe((result: any) => {
        if (result === true) {
          this.staffContactsService
          .deleteStaffContacts({ ssno: this.selectedRowData.ssno })
          .subscribe((result: any) => {
            if (result) {
              this.getStaffContacts();
            }
          });
        }
      });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.selectedOption = selectedOption;
    if (this.selectedOption === 'Edit') {
      this.openEditModal()
    } else {
      this.getStudentsList();
      this.openModal();
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
        this.addStaffContacts();
        break;
      case 'Edit':
        this.editStaffContacts();
        break;
      default:
        break;
    }
  }

  /**
   * @method getSelectedModalRow
   * @description get selected row data to perform action on modal
   */
  public getSelectedModalRow(data: any, index: number) {
    this.selectedModalRow = index;
    this.selectedModalRowData = data;
  }

  /**
   * @method addServiceActivity
   */
  public addServiceActivity() {
    if (this.isActivityEdit) {
      this.activityServiceData[this.selectedEditModalRow] = { activity: this.activityServiceForm.value.activity, totalTime: this.activityServiceForm.value.time };
    } else {
      this.activityServiceData.push({ activity: this.activityServiceForm.value.activity, totalTime: this.activityServiceForm.value.time });
    }
    this.staffContactsEditModalForm.controls['activityService'].setValue(null);
    let totalTime = 0;
    if (this.activityServiceData.length > 0) {
      this.activityServiceData.forEach((element: any) => {
        totalTime += element.totalTime;
      });
    }
    this.staffContactsEditModalForm.controls['totalTime'].setValue(totalTime);
    this.getSelectedEditModalRow(this.activityServiceData[0], 0);
    this.serviceDataSource = new MatTableDataSource(this.activityServiceData);
  }

  /**
   * @method removeServiceActivity
   */
  public removeServiceActivity() {
    if (this.activityServiceData.length > 0) {
      this.activityServiceData.splice([this.selectedEditModalRow], 1);
      let totalTime = 0;
      if (this.activityServiceData.length > 0) {
        this.activityServiceData.forEach((element: any) => {
          totalTime += element.totalTime;
        });
      }
      this.staffContactsEditModalForm.controls['totalTime'].setValue(totalTime);
    }
    this.serviceDataSource = new MatTableDataSource(this.activityServiceData);
  }

  /**
   * @method getSelectedEditModalRow
   * @description get selected row data to perform action on edit modal
   */
  public getSelectedEditModalRow(data: any, index: number) {
    this.selectedEditModalRow = index;
    this.selectedEditModalRowData = data;
  }

  /**
   * @method patchValuesToForm
   */
  public patchValuesToForm() {
    this.staffContactsEditModalForm.patchValue({
      contactDate: Utility.formatDate(this.selectedRowData?.staffContactDate),
      fiscalYear: Number(this.selectedRowData?.staffFiscalYear),
      recontactDate: Utility.formatDate(this.selectedRowData?.staffRecontactDate),
      isReContacted: this.selectedRowData?.staffRecontacted,
      tutor: this.selectedRowData?.staffContactStaff,
      component: this.selectedRowData?.staffComponents,
      aprSubject: this.selectedRowData?.staffAprSubject,
      contactType: this.selectedRowData?.staffContactType,
      subject: this.selectedRowData?.staffSubject,
      instructions: this.selectedRowData?.staffInstruction,
      activityService: this.selectedRowData?.staffActivityService,
      totalTime: this.selectedRowData?.staffTotalTime,
      notes: this.selectedRowData?.staffNotes
    });
    this.activityServiceData = this.selectedRowData.activityRenderedList ? this.selectedRowData.activityRenderedList : [];
    this.getSelectedEditModalRow(this.activityServiceData[0], 0);
    this.serviceDataSource = new MatTableDataSource(this.activityServiceData);
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    const formValue = this.staffContactsEditModalForm.value;
    return {
      staffContactDate: formValue.contactDate,
      staffFiscalYear: formValue.fiscalYear.toString(),
      staffRecontactDate: formValue.recontactDate,
      staffRecontacted: formValue.isReContacted,
      staffContactStaff: formValue.tutor,
      staffComponents: formValue.component,
      staffAprSubject: formValue.aprSubject,
      staffContactType: formValue.contactType,
      staffSubject: formValue.subject,
      staffInstruction: formValue.instructions,
      staffActivityService: formValue.activityService,
      staffTotalTime: this.staffContactsEditModalForm.controls.totalTime.value.toString(),
      staffNotes: formValue.notes,
      activityRenderedList: this.activityServiceData,
      student: this.selectedRowData && this.selectedRowData.ssno &&
        this.selectedRowData.student ? this.selectedRowData.student : this.selectedModalRowData
    }
  }
}
