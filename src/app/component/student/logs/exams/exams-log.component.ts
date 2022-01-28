import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Utility } from 'src/app/shared/global-constants/utility';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { ExamLogService } from 'src/app/services/student/exam-log.service';

@Component({
    selector: 'app-exams-logs',
    templateUrl: './exams-logs.component.html',
    styleUrls: ['./exams-logs.component.css']
})

export class ExamsLogsComponent implements OnInit {
  public columnsToDisplay: string[] =
    ['firstName', 'lastName', 'phoneNumber', 'examDate', 'examName', 'totalMarks', 'maxMarks', 'letterGrade'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  public subExamColumnsToDisplay: string[] = ['subExamName', 'subExamScore']
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  public subExamDataSource: MatTableDataSource<any>;
  @ViewChild('examStudentPopup') examStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('examStudentEditPopup') examStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  @ViewChild('subExamPopup') subExamPopupRef: TemplateRef<any>;
  public subExamModalRef: BsModalRef;
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
  @ViewChild('subExamPage', { read: MatPaginator, static: true }) subExamPaginator: MatPaginator;
  @ViewChild('subExamPopup', { read: MatSort, static: true }) subExamPopupSort: MatSort;

  public studentExamModalForm: FormGroup;
  public studentExamEditModalForm: FormGroup;
  public subExamForm: FormGroup;
  public studentExamList: any = [];
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
  public subExamNameList: any = ['ACT', 'English', 'Math-SAT', 'TAKS', 'CSAT', 'Math Finals'];
  public subExamData: any = [];
  public isSubExamEdit: boolean = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private examLogService: ExamLogService
  ) {
    this.getExamLog();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource();
    this.modalDataSource = new MatTableDataSource();
    this.subExamDataSource = new MatTableDataSource();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.modalDataSource.paginator = this.editPopupPaginator;
      this.subExamDataSource.paginator = this.subExamPaginator;

      this.dataSource.sort = this.sort;
      this.modalDataSource.sort = this.editPopupSort;
      this.subExamDataSource.sort = this.subExamPopupSort;
    }, 10);
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.studentExamModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: ['']
    });

    this.initializeExamForm();
  }

  /**
   * @method initializeExamForm
   */
  public initializeExamForm() {
    this.studentExamEditModalForm = this.fb.group({
      examDate: ['', Validators.required],
      examName: ['', Validators.required],
      letterGrade: ['', Validators.required],
      subExamName: [''],
      maximumMarks: [0, Validators.required],
      totalMarks: [{value: 0, disabled: true}, Validators.required],
      examNotes: ['']
    });

    this.initializeSubExamForm();
  }

  /**
   * @method initializeSubExamForm
   */
  public initializeSubExamForm() {
    this.subExamForm = this.fb.group({
      subExamName: ['', Validators.required],
      subExamScore: [0, Validators.required]
    })
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
    this.modalRef = this.modalService.show(this.examStudentPopupRef, this.studentModalConfigSM);
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
      this.initializeExamForm();
    }
    this.editModalRef = this.modalService.show(this.examStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method getExamLog
   */
   public getExamLog() {
    this.spinner = true;
    this.examLogService.getExamLog().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentExamList = result;
        this.dataSource = new MatTableDataSource(this.studentExamList);
        setTimeout(() => {
          this.dataSource.paginator = this.editPopupPaginator;
          this.dataSource.sort = this.editPopupSort;
        }, 10);
        this.getSelectedRow(this.studentExamList[0], 0);
      }
    });
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.examLogService.getStudentsList().subscribe((result: any) => {
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
      this.studentExamModalForm.controls.siteLocation.patchValue([
        ...this.siteLocation.map((item) => item.value)]);
    } else {
      this.studentExamModalForm.controls.siteLocation.patchValue([]);
    }
  }

  /**
   * @method togglePerOne
   */
  public togglePerOne(selected: string) {
    this.allSelected = this.studentExamModalForm.controls.siteLocation.value.length ==
    this.siteLocation.length;
  }

  /**
   * @method addStudentExam
   */
  public addStudentExam() {
    this.examLogService.addExamLog(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getExamLog();
        }
      });
  }

  /**
   * @method editStudentExam
   */
  public editStudentExam(): any {
    if (this.selectedRowData == null) { return true; };
    let request: any = this.requestPayload();
    if (request['id'] == undefined) {
      request['id'] = this.selectedRowData.id
      request['ssno'] = this.selectedRowData.ssno
    }
    this.examLogService.editExamLog(request)
      .subscribe((result: any) => {
        if (result) {
          this.getExamLog();
        }
      });
  }

  /**
   * @method deleteStudentExam
   */
  public deleteStudentExam() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure you want to delete this Exam information?`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.examLogService.deleteExamLog({ id: this.selectedRowData.id })
          .subscribe((result: any) => {
            if (result) {
              this.getExamLog();
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
        this.addStudentExam();
        break;
      case 'Edit':
        this.editStudentExam();
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
   * @method openSubExamName
   */
  public openSubExamName(selector: string) {
    this.isSubExamEdit = selector === 'Edit';
    if (this.isSubExamEdit) {
      if (this.subExamData.length > 0) {
        this.subExamForm.patchValue({
          subExamName: this.selectedEditModalRowData?.subExamName,
          subExamScore: this.selectedEditModalRowData?.subExamScore
        });
        this.subExamModalRef = this.modalService.show(this.subExamPopupRef, this.modalConfigSM);
      }
    } else {
      this.subExamForm.patchValue({
        subExamName: this.studentExamEditModalForm.controls['subExamName'].value,
        subExamScore: 0
      });
      this.subExamModalRef = this.modalService.show(this.subExamPopupRef, this.modalConfigSM);
    }
  }

  /**
   * @method addSubExam
   */
   public addSubExam() {
    if (this.isSubExamEdit) {
      this.subExamData[this.selectedEditModalRow] = { subExamName: this.subExamForm.value.subExamName,
        subExamScore: this.subExamForm.value.subExamScore };
    } else {
      this.subExamData.push({ subExamName: this.subExamForm.value.subExamName,
        subExamScore: this.subExamForm.value.subExamScore });
    }
    this.studentExamEditModalForm.controls['subExamName'].setValue(null);
    let subExamScore = 0;
    if (this.subExamData.length > 0) {
      this.subExamData.forEach((element: any) => {
        subExamScore += element.subExamScore;
      });
    }
    this.studentExamEditModalForm.controls['totalMarks'].setValue(subExamScore);
    this.getSelectedEditModalRow(this.subExamData[0], 0);
    this.subExamDataSource = new MatTableDataSource(this.subExamData);
    this.subExamDataSource.paginator = this.subExamPaginator;
    this.subExamDataSource.sort = this.subExamPopupSort;
  }

  /**
   * @method removeSubExamName
   */
   public removeSubExamName() {
    if (this.subExamData.length > 0) {
      this.subExamData.splice([this.selectedEditModalRow], 1);
      let subExamScore = 0;
      if (this.subExamData.length > 0) {
        this.subExamData.forEach((element: any) => {
          subExamScore += element.subExamScore;
        });
      }
      this.studentExamEditModalForm.controls['totalMarks'].setValue(subExamScore);
    }
    this.subExamDataSource = new MatTableDataSource(this.subExamData);
    this.subExamDataSource.paginator = this.subExamPaginator;
    this.subExamDataSource.sort = this.subExamPopupSort;
   }

  /**
   * @method patchValuesToForm
   */
  public patchValuesToForm() {
    this.studentExamEditModalForm.patchValue({
      examDate: Utility.formatDate(this.selectedRowData?.examDate),
      examName: this.selectedRowData?.examName,
      letterGrade: this.selectedRowData?.letterGrade,
      subExamName: this.selectedRowData?.subExamName,
      maximumMarks: this.selectedRowData?.maxMarks,
      totalMarks: this.selectedRowData?.totalMarks,
      examNotes: this.selectedRowData?.examNotes
    });

    this.subExamData = this.selectedRowData.subExamLogEntry ? this.selectedRowData.subExamLogEntry : [];
    this.getSelectedEditModalRow(this.subExamData[0], 0);
    this.subExamDataSource = new MatTableDataSource(this.subExamData);
    this.subExamDataSource.paginator = this.subExamPaginator;
    this.subExamDataSource.sort = this.subExamPopupSort;
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    const formValue = this.studentExamEditModalForm.value;
    const student = this.selectedOption === 'Edit' && this.selectedRowData.id ?
      this.selectedRowData : this.selectedModalRowData
    return {
      subExamLogEntry: this.subExamData,
      examDate: new Date(formValue?.examDate).toISOString(),
      examName: formValue?.examName,
      letterGrade: formValue?.letterGrade,
      subExamName: formValue?.subExamName,
      maxMarks: formValue?.maximumMarks.toString(),
      totalMarks: this.studentExamEditModalForm.controls.totalMarks.value.toString(),
      examNotes: formValue?.examNotes,
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
