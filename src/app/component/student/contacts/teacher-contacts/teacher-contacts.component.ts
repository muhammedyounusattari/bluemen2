import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TeacherContactsService } from 'src/app/services/teacher/teacher-contacts.service';


@Component({
  selector: 'teacher-contacts',
  templateUrl: './teacher-contacts.component.html',
  styleUrls: ['./teacher-contacts.component.css']
})

export class TeacherContactsComponent {
  public columnsToDisplay: string[] = 
  ['staffFirstName', 'staffLastName', 'staffPhoneNumber', 'staffContactDate', 'staffTeacher', 'staffContactTime', 'staffRecontactDate'];
  public modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];

  public dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;

  @ViewChild('teacherStudentPopup') teacherStudentPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  @ViewChild('teacherStudentEditPopup') teacherStudentEditPopupRef: TemplateRef<any>;
  public editModalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public teacherContactsForm: FormGroup;
  public teacherContactsModalForm: FormGroup;
  public teacherContactsList: any = [];
  public studentsList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;
  public spinner: boolean = true;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private teacherContactsService: TeacherContactsService
  ) {
    this.modalDataSource = this.dataSource = new MatTableDataSource();
    this.getTeacherContacts();
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
    this.teacherContactsModalForm = this.fb.group({
      contactDate: [''],
      fiscalYear: [''],
      recontactDate: [''],
      isReContacted: [''],
      tutor: [''],
      component: [''],
      aprSubject: [''],
      contactType: [''],
      subject: [''],
      instructions: [''],
      activityService: [''],
      totalTime: ['']
    });

    this.teacherContactsForm = this.fb.group({
      active: [''],
      contactTime: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      reported: [''],
      school: [''],
      served: [''],
      standing: [''],
      tutor: ['']
    })
  }

  /**
   * @method applyFilter
   */
  public applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @method openModal
   */
  public openModal() {
    this.modalRef = this.modalService.show(this.teacherStudentPopupRef, this.modalConfigSM);
    this.getTStudentsList();
  }

  /**
   * @method openEditModal
   */
  public openEditModal() {
    this.editModalRef = this.modalService.show(this.teacherStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method getTeacherContacts
   */
  public getTeacherContacts() {
    this.spinner = true;
    this.teacherContactsService.getTeacherContacts().subscribe((result: any) => {
      if (result && result.length > 0) {
        // this.teacherContactsList = result.map((x: any) => x = {...x, ...this.mockAPIResponse()});
        this.spinner = false;
        this.teacherContactsList = result;
        this.selectedRow = null;
        this.dataSource = new MatTableDataSource(this.teacherContactsList);
        this.getSelectedRow(this.teacherContactsList[0], 0);
      }
    });
  }

  /**
   * @method getTStudentsList
   */
  public getTStudentsList() {
    this.spinner = true;
    this.teacherContactsService.getTStudentsList().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentsList = result;
        this.modalDataSource = new MatTableDataSource(this.studentsList);
      }
    });
  }


  /**
   * @method addTeacherContacts
   */
  public addTeacherContacts() {
    this.teacherContactsService
      .addTeacherContacts(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getTeacherContacts();
        }
      });
  }

  /**
   * @method editTeacherContacts
   */
  public editTeacherContacts() {
    let request: any = this.requestPayload();
    if (request['ssno'] == undefined) {
      request['ssno'] = this.selectedRowData.ssno
    }
    this.teacherContactsService
      .editTeacherContacts(request)
      .subscribe((result: any) => {
        if (result) {
          this.getTeacherContacts();
        }
      });
  }

  /**
   * @method deleteTeacherContacts
   */
  public deleteTeacherContacts() {
    this.teacherContactsService
      .deleteTeacherContacts({ ssno: this.selectedRowData.ssno })
      .subscribe((result: any) => {
        if (result) {
          this.getTeacherContacts();
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
        this.addTeacherContacts();
        break;
      case 'Edit':
        this.editTeacherContacts();
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
   * @method getSelectedModalRow
   * @description get selected row data to perform action on modal
   */
  public getSelectedModalRow(data: any, index: number) {
    this.selectedModalRow = index;
    this.selectedModalRowData = data;
  }

  /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    return {
      active: true,
      contactDate: "12/12/2021",
      contactTime: "12/12/2021 12:30",
      firstName: "Arun",
      fiscalYear: "2021",
      lastName: "Gupta",
      phoneNumber: "999999999",
      recontactDate: "12/12/2021",
      reported: true,
      school: "Test",
      served: true,
      standing: "Test",
      tutor: "Test"
    }
  }

  /**
   * @method mockAPIResponse
   */
   public mockAPIResponse() {
    return {
      contactDate: "12/12/2021",
      contactTime: "12/12/2021 12:30",
      firstName: "Arun",
      lastName: "Gupta",
      phoneNumber: "999999999",
      recontactDate: "12/12/2021",
      tutor: "Test"
    };
  }
}
