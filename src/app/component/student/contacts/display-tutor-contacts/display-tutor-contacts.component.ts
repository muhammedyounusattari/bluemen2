import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DispTutorContactsService } from 'src/app/services/tutors/disp-tutor-contacts.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Utility } from 'src/app/shared/global-constants/utility';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';

@Component({
    selector: 'display-tutor-contacts',
    templateUrl: './display-tutor-contacts.component.html',
    styleUrls: ['./display-tutor-contacts.component.css']
})

export class DisplayTutorContactsComponent implements OnInit {
    public columnsToDisplay: string[] =
    ['firstName', 'lastName', 'phoneNumber', 'staffContactDate', 'staffContactTutor', 'staffTotalTime', 'staffRecontactDate'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  public serviceColumnsToDisplay: string[] = ['activity', 'totalTime'];
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  public serviceDataSource: MatTableDataSource<any>;
  @ViewChild('tutorStudentPopup') tutorStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('tutorStudentEditPopup') tutorStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  @ViewChild('activityServicePopup') activityServicePopupRef: TemplateRef<any>;
  public activityServiceModalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }

  studentModalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('editPopupPage', { read: MatPaginator, static: true }) editPopupPaginator: MatPaginator;
  @ViewChild('activityTablePage', { read: MatPaginator, static: true }) activityPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('editPopup', { read: MatSort, static: true }) editPopupSort: MatSort;
  @ViewChild('activityTable', { read: MatSort, static: true }) activitySort: MatSort;

  public activityServiceForm: FormGroup;
  public tutorContactsModalForm: FormGroup;
  public tutorContactsEditModalForm: FormGroup;
  public tutorContactsList: any = [];
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
  public tutorsList: any = [];
  public studentData: any;
  public activityServiceList: any = [];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tutorContactService: DispTutorContactsService
  ) {
    this.dataSource = new MatTableDataSource();
    this.modalDataSource = new MatTableDataSource();
    this.serviceDataSource = new MatTableDataSource();
    this.getDispTutorContacts();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.modalDataSource.paginator = this.editPopupPaginator;
    this.serviceDataSource.paginator = this.activityPaginator;

    this.dataSource.sort = this.sort;
    this.modalDataSource.sort = this.editPopupSort;
    this.serviceDataSource.sort = this.activitySort;
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.activityServiceForm = this.fb.group({
      activity: [''],
      time: [0]
    });

    this.tutorContactsModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: ['']
    });

    this.initializeContactForm();
  }

  /**
   * @method initializeContactForm
   */
  public initializeContactForm() {
    this.tutorContactsEditModalForm = this.fb.group({
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
      totalTime: [{value: 0, disabled: true}],
      notes: ['']
    });
  }

  /**
   * @method applyFilter
   */
  public applyFilter(filterValue: any, dataSource: MatTableDataSource<any>) {
    dataSource.filter = filterValue?.target?.value?.trim()?.toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  /**
   * @method openModal
   */
  public openModal() {
    this.modalRef = this.modalService.show(this.tutorStudentPopupRef, this.studentModalConfigSM);
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    this.studentData = this.selectedOption === 'Edit' && this.selectedRowData.ssno &&
    this.selectedRowData.student ? this.selectedRowData.student : this.selectedModalRowData;
    if (this.selectedOption === 'Edit') {
      this.patchValuesToForm();
    } else {
      this.initializeContactForm();
      this.activityServiceData = [];
    }
    this.editModalRef = this.modalService.show(this.tutorStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method openActivityServiceModal
   */
  public openActivityServiceModal(selector: string) {
    this.isActivityEdit = selector === 'Edit';
    if (this.isActivityEdit) {
      if (this.activityServiceData.length > 0) {
        this.activityServiceForm.patchValue({
          activity: this.selectedEditModalRowData?.activity,
          time: this.selectedEditModalRowData?.totalTime
        });
        this.activityServiceModalRef = this.modalService.show(this.activityServicePopupRef, this.modalConfigSM);
      }
    } else {
      this.activityServiceForm.patchValue({
        activity: this.tutorContactsEditModalForm.controls['activityService'].value,
        time: 0
      });
      this.activityServiceModalRef = this.modalService.show(this.activityServicePopupRef, this.modalConfigSM);
    }
  }

  /**
   * @method getTutorContacts
   */
  public getDispTutorContacts() {
    this.spinner = true;
    this.tutorContactService.getDispTutorContacts().subscribe((result: any) => {
      if (result) {
        this.tutorContactsList = result;
        this.spinner = false;
        this.selectedRow = null;
        this.dataSource = new MatTableDataSource(this.tutorContactsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getSelectedRow(this.tutorContactsList[0], 0);
      }
    });
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.tutorContactService.getStudentsList().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentsList = result;
        this.modalDataSource = new MatTableDataSource(this.studentsList);
        setTimeout(() => {
          this.modalDataSource.paginator = this.editPopupPaginator;
          this.modalDataSource.sort = this.editPopupSort;
        }, 10);
        this.getSelectedModalRow(this.studentsList[0], 0);
      }
    });
  }

  /**
   * @method getStaffList
   */
  public getStaffList() {
    this.tutorContactService.getStaffList().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element.staffTutor && element.staffName) {
            this.tutorsList.push(element.staffName);
          }
        });
      }
    });
  }

  /**
   * @method addTutorContacts
   */
  public addDispTutorContacts() {
    this.tutorContactService
      .addDispTutorContacts(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getDispTutorContacts();
        }
      });
  }

  /**
   * @method editTutorContacts
   */
  public editDispTutorContacts(): any {
    if (this.selectedRowData == null) { return true; };
    let request: any = this.requestPayload();
    if (request['ssno'] == undefined) {
      request['ssno'] = this.selectedRowData.ssno
    }
    this.tutorContactService
      .editDispTutorContacts(request)
      .subscribe((result: any) => {
        if (result) {
          this.getDispTutorContacts();
        }
      });
  }

  /**
   * @method deleteTutorContacts
   */
  public deleteDispTutorContacts() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure, you want to delete ${this.selectedRowData?.student?.firstName}
        ${this.selectedRowData?.student?.lastName} ${this.selectedRowData?.staffContactDate}
        Contact information?`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.tutorContactService
          .deleteDispTutorContacts({ ssno: this.selectedRowData.ssno })
          .subscribe((result: any) => {
            if (result) {
              this.getDispTutorContacts();
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
    this.getStaffList();
    this.getActivityServiceList();
    if (this.selectedOption === 'Edit') {
      this.openEditModal();
    } else {
      this.getStudentsList();
      this.openModal();
    }
  }

  /**
   * @method getActivityServiceList
   */
  public getActivityServiceList() {
    this.tutorContactService.getActivityServiceList().subscribe(result => {
      if(result) {
        this.activityServiceList = result;
      }
    })
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
        this.addDispTutorContacts();
        break;
      case 'Edit':
        this.editDispTutorContacts();
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
    this.tutorContactsEditModalForm.controls['activityService'].setValue(null);
    let totalTime = 0;
    if (this.activityServiceData.length > 0) {
      this.activityServiceData.forEach((element: any) => {
        totalTime += element.totalTime;
      });
    }
    this.tutorContactsEditModalForm.controls['totalTime'].setValue(totalTime);
    this.getSelectedEditModalRow(this.activityServiceData[0], 0);
    this.serviceDataSource = new MatTableDataSource(this.activityServiceData);
    this.serviceDataSource.paginator = this.activityPaginator;
    this.serviceDataSource.sort = this.activitySort;
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
      this.tutorContactsEditModalForm.controls['totalTime'].setValue(totalTime);
    }
    this.serviceDataSource = new MatTableDataSource(this.activityServiceData);
    this.serviceDataSource.paginator = this.activityPaginator;
    this.serviceDataSource.sort = this.activitySort;
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
    this.tutorContactsEditModalForm.patchValue({
      contactDate: Utility.formatDate(this.selectedRowData?.staffContactDate),
      fiscalYear: Number(this.selectedRowData?.staffFiscalYear),
      recontactDate: Utility.formatDate(this.selectedRowData?.staffRecontactDate),
      isReContacted: this.selectedRowData?.staffRecontacted,
      tutor: this.selectedRowData?.staffContactTutor,
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
    this.serviceDataSource.paginator = this.activityPaginator;
    this.serviceDataSource.sort = this.activitySort;
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    const formValue = this.tutorContactsEditModalForm.value;
    return {
      staffContactDate: formValue.contactDate,
      staffFiscalYear: formValue.fiscalYear.toString(),
      staffRecontactDate: formValue.recontactDate,
      staffRecontacted: formValue.isReContacted,
      staffContactTutor: formValue.tutor,
      staffComponents: formValue.component,
      staffAprSubject: formValue.aprSubject,
      staffContactType: formValue.contactType,
      staffSubject: formValue.subject,
      staffInstruction: formValue.instructions,
      staffActivityService: formValue.activityService,
      staffTotalTime: this.tutorContactsEditModalForm.controls.totalTime.value.toString(),
      staffNotes: formValue.notes,
      activityRenderedList: this.activityServiceData,
      student: this.selectedOption === 'Edit' && this.selectedRowData.ssno &&
        this.selectedRowData.student ? this.selectedRowData.student : this.selectedModalRowData
    }
  }
}
