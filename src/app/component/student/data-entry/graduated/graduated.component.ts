import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Utility } from 'src/app/shared/global-constants/utility';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { StudentService } from 'src/app/services/student/student.service';


@Component({
    selector: 'app-graduated',
    templateUrl: './graduated.component.html',
    styleUrls: ['./graduated.component.css']
})

export class GraduatedComponent implements OnInit {
  public columnsToDisplay: string[] =
    ['firstName', 'lastName', 'track', 'graduated', 'counselor', 'phone1', 'major', 'employer'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  @ViewChild('graduatedStudentPopup') graduatedStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('graduatedStudentEditPopup') graduatedStudentEditPopupRef: TemplateRef<any>;
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

  public studentGraduatedModalForm: FormGroup;
  public studentGraduatedEditModalForm: FormGroup;
  public studentAddressNotesForm: FormGroup;
  public studentGraduatedList: any = [];
  public studentsList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;
  public spinner: boolean = true;
  public studentData: any;
  public counselorsList: any = [];
  public cityList: any = [];
  public stateList: any = [];


  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private studentService: StudentService
  ) {
    this.dataSource = new MatTableDataSource();
    this.modalDataSource = new MatTableDataSource();
    this.getStudentsList();
    this.getStateList();
    this.getCityList();
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
    this.studentGraduatedModalForm = this.fb.group({
      fiscalYear: ['2017'],
      served: [''],
      siteLocation: [''],
      active: [''],
      reported: ['']
    });

    this.initializeGraduatedForm();
    this.initializeAddressForm();
  }

  /**
   * @method initializeGraduatedForm
   */
  public initializeGraduatedForm() {
    this.studentGraduatedEditModalForm = this.fb.group({
      counselor: [''],
      degreeIn: [''],
      employer: [''],
      titleOrPosition: [''],
      militaryType: [''],
      graduatedYear:[new Date().getFullYear()],
      militaryRank: [''],
      track:[false],
      major: [''],
      graduatedEducationStatus: [''],
      employmentType: [''],
      // graduated: [''],
      // phone1: [''],
      // firstName: [''],
      // lastName: ['']
    });
  }

  /**
   * @method initializeAddressForm
   */
   public initializeAddressForm() {
    this.studentAddressNotesForm = this.fb.group({
      address: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      phone1: [''],
      phone2: [''],
      website: [''],
      email: [''],
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
    this.modalRef = this.modalService.show(this.graduatedStudentPopupRef, this.studentModalConfigSM);
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    this.getStaffList();
    this.studentData = this.selectedOption === 'Edit' && this.selectedRowData.ssno
      ? this.selectedRowData : this.selectedModalRowData;
    if (this.selectedOption === 'Edit') {
      this.patchValuesToForm();
    } else {
      this.initializeGraduatedForm();
      this.initializeAddressForm();
    }
    this.editModalRef = this.modalService.show(this.graduatedStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.studentService.getTStudentsList().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentsList = result;
        this.dataSource = this.modalDataSource = new MatTableDataSource(this.studentsList);
        this.dataSource.paginator = this.modalDataSource.paginator = this.editPopupPaginator;
        this.dataSource.sort = this.modalDataSource.sort = this.editPopupSort;
        this.getSelectedRow(this.studentsList[0], 0);
        this.getSelectedModalRow(this.studentsList[0], 0);
      }
    });
  }

  /**
   * @method getStaffList
   */
   public getStaffList() {
    this.studentService.getStaffList().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element && element.name && element.code) {
            this.stateList.push({name: element.name, code: element.code});
          }
        });
      }
    });
  }

  /**
   * @method getStateList
   */
   public getStateList() {
    this.studentService.getPulldownState().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element && element.name && element.code) {
            this.stateList.push({name: element.name, code: element.code});
          }
        });
      }
    });
  }

  /**
   * @method getCityList
   */
   public getCityList() {
    this.studentService.getPulldownCity().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element && element.name && element.code) {
            this.cityList.push({name: element.name, code: element.code});
          }
        });
      }
    });
  }

  /**
   * @method addStudentGraduated
   */
  public addStudentGraduated() {
    let request: any = this.requestPayload();
    if (request['ssno'] == undefined) {
      request['ssno'] = this.selectedModalRowData.ssno
    }
    console.log(request, 'request request');

    this.studentService.editStudentsList(request)
      .subscribe((result: any) => {
        if (result) {
          this.getStudentsList();
        }
      });
  }

  /**
   * @method editStudentGraduated
   */
  public editStudentGraduated(): any {
    if (this.selectedRowData == null) { return true; };
    let request: any = this.requestPayload();
    if (request['ssno'] == undefined) {
      request['ssno'] = this.selectedRowData.ssno
    }
    console.log(request, 'request');

    this.studentService.editStudentsList(request)
      .subscribe((result: any) => {
        if (result) {
          this.getStudentsList();
        }
      });
  }

  /**
   * @method deleteStudentGraduated
   */
  public deleteStudentGraduated() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure, you want to delete ${this.selectedRowData?.firstName}
        ${this.selectedRowData?.lastName} information?`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.studentService.deleteStudentsList({ ssno: this.selectedRowData.ssno })
          .subscribe((result: any) => {
            if (result) {
              this.getStudentsList();
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
        this.addStudentGraduated();
        break;
      case 'Edit':
        this.editStudentGraduated();
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
   * @method patchValuesToForm
   */
  public patchValuesToForm() {
    this.studentGraduatedEditModalForm.patchValue({
      counselor: this.selectedRowData?.graduatedInformation?.counselor,
      degreeIn: this.selectedRowData?.graduatedInformation?.degreeIn,
      employer: this.selectedRowData?.graduatedInformation?.employer,
      titleOrPosition: this.selectedRowData?.graduatedInformation?.titleOrPosition,
      militaryType: this.selectedRowData?.graduatedInformation?.militaryType,
      graduatedYear: this.selectedRowData?.graduatedInformation?.graduatedYear,
      militaryRank: this.selectedRowData?.graduatedInformation?.militaryRank,
      track: this.selectedRowData?.graduatedInformation?.track ?
        JSON.parse(this.selectedRowData?.graduatedInformation?.track) : false,
      major: this.selectedRowData?.graduatedInformation?.major,
      graduatedEducationStatus: this.selectedRowData?.graduatedInformation?.graduatedEducationStatus,
      employmentType: this.selectedRowData?.graduatedInformation?.employmentType,
    });

    this.studentAddressNotesForm.patchValue({
      address: this.selectedRowData?.graduatedInformation?.addressNotes?.address,
      city: this.selectedRowData?.graduatedInformation?.addressNotes?.city,
      state: this.selectedRowData?.graduatedInformation?.addressNotes?.state,
      zipcode: this.selectedRowData?.graduatedInformation?.addressNotes?.zipcode,
      phone1: this.selectedRowData?.graduatedInformation?.addressNotes?.phone1,
      phone2: this.selectedRowData?.graduatedInformation?.addressNotes?.phone2,
      website: this.selectedRowData?.graduatedInformation?.addressNotes?.website,
      email: this.selectedRowData?.graduatedInformation?.addressNotes?.email,
      notes: this.selectedRowData?.graduatedInformation?.addressNotes?.notes,
    });
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    let formValue = this.studentGraduatedEditModalForm.value;
    formValue = {...formValue, ...{ addressNotes: this.studentAddressNotesForm.value}}
    return {
      ...this.selectedRowData,
      ...{ graduatedInformation: formValue}
    }
  }
}
