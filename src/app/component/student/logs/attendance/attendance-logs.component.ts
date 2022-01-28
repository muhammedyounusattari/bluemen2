import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Utility } from 'src/app/shared/global-constants/utility';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { AttendaceLogService } from 'src/app/services/student/attendance-log.service';

@Component({
  selector: 'app-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.css'],
})
export class AttendanceLogsComponent implements OnInit {
  public columnsToDisplay: string[] = [
    'firstName',
    'lastName',
    'phoneNumber',
    'attendanceDate',
    'attendanceAmount',
    'attendanceLogged',
  ];
  public modalColumnsToDisplay: string[] = [
    'ssno',
    'firstName',
    'lastName',
    'phoneNumber',
    'fiscalYear',
    'active',
    'served',
    'reported',
    'counselor',
    'school',
    'standing',
  ];
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  @ViewChild('attendanceStudentPopup')
  attendanceStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('attendanceStudentEditPopup')
  attendanceStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl',
  };

  studentModalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl',
  };
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('editPopupPage', { read: MatPaginator, static: true })
  editPopupPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('editPopup', { read: MatSort, static: true })
  editPopupSort: MatSort;

  public studentAttendanceModalForm: FormGroup;
  public studentAttendanceEditModalForm: FormGroup;
  public studentAttendanceList: any = [];
  public studentsList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;
  public selectedEditModalRow: any = null;
  public selectedEditModalRowData: any = null;
  public spinner: boolean = true;
  public studentData: any;
  public allSelected: boolean = false;
  public siteLocation = [
    { value: 'Undefined', viewValue: 'Undefined' },
    { value: 'Not Entered', viewValue: 'Not Entered' },
  ];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private attendanceLogService: AttendaceLogService
  ) {
    this.dataSource = new MatTableDataSource();
    this.modalDataSource = new MatTableDataSource();
    this.getAttendanceLog();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.modalDataSource.paginator = this.editPopupPaginator;

    this.dataSource.sort = this.sort;
    this.modalDataSource.sort = this.editPopupSort;
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.studentAttendanceModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: [''],
    });

    this.initializeAttendanceForm();
  }

  /**
   * @method initializeAttendanceForm
   */
  public initializeAttendanceForm() {
    this.studentAttendanceEditModalForm = this.fb.group({
      attendanceAmount: [''],
      attendanceChecked: [false],
      attendanceDate: [''],
      attendanceNotes: [''],
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
    this.modalRef = this.modalService.show(
      this.attendanceStudentPopupRef,
      this.studentModalConfigSM
    );
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    this.studentData =
      this.selectedOption === 'Edit' &&
      this.selectedRowData.id &&
      this.selectedRowData.student
        ? this.selectedRowData.student
        : this.selectedModalRowData;
    if (this.selectedOption === 'Edit') {
      this.patchValuesToForm();
    } else {
      this.initializeAttendanceForm();
    }
    this.editModalRef = this.modalService.show(
      this.attendanceStudentEditPopupRef,
      this.modalConfigSM
    );
  }

  /**
   * @method getAttendanceLog
   */
  public getAttendanceLog() {
    this.spinner = true;
    this.attendanceLogService.getAttendanceLog().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentAttendanceList = result;
        this.dataSource = new MatTableDataSource(this.studentAttendanceList);
        this.dataSource.paginator = this.editPopupPaginator;
        this.dataSource.sort = this.editPopupSort;
        this.getSelectedRow(this.studentAttendanceList[0], 0);
      }
    });
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.attendanceLogService.getStudentsList().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentsList = result;
        this.modalDataSource = new MatTableDataSource(this.studentsList);
        this.modalDataSource.paginator = this.editPopupPaginator;
        this.modalDataSource.sort = this.editPopupSort;
        this.getSelectedModalRow(this.studentsList[0], 0);
      }
    });
  }

  /**
   * @method toggleAllSelection
   */
  public toggleAllSelection() {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.studentAttendanceModalForm.controls.siteLocation.patchValue([
        ...this.siteLocation.map((item) => item.value),
      ]);
    } else {
      this.studentAttendanceModalForm.controls.siteLocation.patchValue([]);
    }
  }

  /**
   * @method togglePerOne
   */
  public togglePerOne(selected: string) {
    this.allSelected =
      this.studentAttendanceModalForm.controls.siteLocation.value.length ==
      this.siteLocation.length;
  }

  /**
   * @method addStudentAttendance
   */
  public addStudentAttendance() {
    this.attendanceLogService
      .addAttendanceLog(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getAttendanceLog();
        }
      });
  }

  /**
   * @method editStudentAttendance
   */
  public editStudentAttendance(): any {
    if (this.selectedRowData == null) {
      return true;
    }
    let request: any = this.requestPayload();
    if (request['id'] == undefined) {
      request['id'] = this.selectedRowData.id;
      request['ssno'] = this.selectedRowData.ssno;
    }
    this.attendanceLogService
      .editAttendanceLog(request)
      .subscribe((result: any) => {
        if (result) {
          this.getAttendanceLog();
        }
      });
  }

  /**
   * @method deleteStudentAttendance
   */
  public deleteStudentAttendance() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure you want to delete this Attendance information?`,
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.attendanceLogService
          .deleteAttendanceLog({ id: this.selectedRowData.id })
          .subscribe((result: any) => {
            if (result) {
              this.getAttendanceLog();
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
      this.openEditModal();
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
        this.addStudentAttendance();
        break;
      case 'Edit':
        this.editStudentAttendance();
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
    this.studentAttendanceEditModalForm.patchValue({
      attendanceAmount: this.selectedRowData?.attendanceAmount,
      attendanceChecked: this.selectedRowData?.attendanceLogged == 'YES'
        ? true : false,
      attendanceDate: Utility.formatDate(this.selectedRowData?.attendanceDate),
      attendanceNotes: this.selectedRowData?.attendanceNotes,
    });
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    const formValue = this.studentAttendanceEditModalForm.value;
    const student = this.selectedOption === 'Edit' && this.selectedRowData.id
      ? this.selectedRowData : this.selectedModalRowData;

    return {
      active: student?.active,
      attendanceAmount: formValue?.attendanceAmount,
      attendanceDate: formValue?.attendanceDate,
      attendanceLogged: formValue?.attendanceChecked ? 'YES' : 'NO',
      attendanceNotes: formValue?.attendanceNotes,
      councelor: student?.graduatedInformation?.counselor,
      dontApplyStipend: '',
      firstName: student?.firstName,
      fiscalYear: student?.fiscalYear,
      lastName: student?.lastName,
      phoneNumber: student?.phoneNumber,
      reported: student?.reported,
      school: student?.school,
      served: student?.served,
      standing: student?.standing,
    };
  }
}
