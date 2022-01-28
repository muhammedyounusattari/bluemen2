import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Utility } from 'src/app/shared/global-constants/utility';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { NotesLogService } from 'src/app/services/student/notes-log.service';

@Component({
    selector: 'app-notes-logs',
    templateUrl: './notes-logs.component.html',
    styleUrls: ['./notes-logs.component.css']
})

export class NotesLogsComponent implements OnInit {
  public columnsToDisplay: string[] =
    ['firstName', 'lastName', 'phoneNumber', 'notesDate', 'notes'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  @ViewChild('logsStudentPopup') logsStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('logsStudentEditPopup') logsStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  }

  studentModalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('editPopupPage', { read: MatPaginator, static: true }) editPopupPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('editPopup', { read: MatSort, static: true }) editPopupSort: MatSort;

  public studentLogsModalForm: FormGroup;
  public studentNotesModalForm: FormGroup;
  public studentLogsList: any = [];
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
  public  allSelected: boolean = false;
  public siteLocation = [
    { value: 'Undefined', viewValue: 'Undefined' },
    { value: 'Not Entered', viewValue: 'Not Entered' },
  ];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notesLogService: NotesLogService
  ) {
    this.dataSource = new MatTableDataSource();
    this.modalDataSource = new MatTableDataSource();
    this.getNotesLog();
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
    this.studentLogsModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: ['']
    });

    this.initializeLogsForm();
  }

  /**
   * @method initializeLogsForm
   */
  public initializeLogsForm() {
    this.studentNotesModalForm = this.fb.group({
      notesDate: ['', Validators.required],
      notes: ['', Validators.required]
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
    this.modalRef = this.modalService.show(this.logsStudentPopupRef, this.studentModalConfigSM);
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    this.studentData = this.selectedOption === 'Edit' && this.selectedRowData.id &&
    this.selectedRowData.student ? this.selectedRowData.student : this.selectedModalRowData;
    if (this.selectedOption === 'Edit') {
      this.patchValuesToForm();
    } else {
      this.initializeLogsForm();
    }
    this.editModalRef = this.modalService.show(this.logsStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method getNotesLog
   */
   public getNotesLog() {
    this.spinner = true;
    this.notesLogService.getNotesLog().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentLogsList = result;
        this.dataSource = new MatTableDataSource(this.studentLogsList);
        this.dataSource.paginator = this.editPopupPaginator;
        this.dataSource.sort = this.editPopupSort;
        this.getSelectedRow(this.studentLogsList[0], 0);
      }
    });
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.notesLogService.getStudentsList().subscribe((result: any) => {
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
      this.studentLogsModalForm.controls.siteLocation.patchValue([
        ...this.siteLocation.map((item) => item.value)]);
    } else {
      this.studentLogsModalForm.controls.siteLocation.patchValue([]);
    }
  }

  /**
   * @method togglePerOne
   */
  public togglePerOne(selected: string) {
    this.allSelected = this.studentLogsModalForm.controls.siteLocation.value.length ==
    this.siteLocation.length;
  }

  /**
   * @method addStudentLogs
   */
  public addStudentLogs() {
    this.notesLogService.addNotesLog(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getNotesLog();
        }
      });
  }

  /**
   * @method editStudentLogs
   */
  public editStudentLogs(): any {
    if (this.selectedRowData == null) { return true; };
    let request: any = this.requestPayload();
    if (request['id'] == undefined) {
      request['id'] = this.selectedRowData.id
      request['ssno'] = this.selectedRowData.ssno
    }
    this.notesLogService.editNotesLog(request)
      .subscribe((result: any) => {
        if (result) {
          this.getNotesLog();
        }
      });
  }

  /**
   * @method deleteStudentLogs
   */
  public deleteStudentLogs() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure you want to delete this Logs information?`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.notesLogService.deleteNotesLog({ id: this.selectedRowData.id })
          .subscribe((result: any) => {
            if (result) {
              this.getNotesLog();
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
        this.addStudentLogs();
        break;
      case 'Edit':
        this.editStudentLogs();
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
    this.studentNotesModalForm.patchValue({
      notesDate: Utility.formatDate(this.selectedRowData?.notesDate),
      notes: this.selectedRowData?.notes
    });
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    const formValue = this.studentNotesModalForm.value;
    const student = this.selectedOption === 'Edit' && this.selectedRowData.id ?
      this.selectedRowData : this.selectedModalRowData
    return {
      notesDate: new Date(formValue?.notesDate).toISOString(),
      notes: formValue?.notes,
      councelor: student?.graduatedInformation?.counselor,
      firstName: student?.firstName,
      fiscalYear: student?.fiscalYear,
      lastName: student?.lastName,
      phoneNumber: student?.phoneNumber,
      reported: student?.reported,
      school: student?.school,
      served: student?.served,
      standing: student?.standing
    }
  }
}
