import {Component, TemplateRef, ViewChild, OnInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TutorClassesService} from 'src/app/services/tutors/classes/tutor-classes.service';

@Component({
  selector: 'app-tutor-classes',
  templateUrl: './tutor-classes.component.html'
})

export class TutorClassesComponent implements OnInit {
  @ViewChild('tutorClassesPopup') tutorClassesPopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalStudentRef: BsModalRef;
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
  selectedRow: any = '';
  isEdit: boolean = false;
  myElement: any = null;
  public spinner: boolean = true;
  selectedRowIndex: any;
  public selectedOption: string = '';
  public studentsList: any = [];
  public tutors: any = [];
  public selectedStudentList: any [];
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;
  public selectedAssgStdModalRow: any = null;
  public selectedAssgStdModalRowData: any = null;

  //fields of form
  public currentYear: string = '';
  public classPeriod: string = '';
  public semester: string = '';
  public meetingTime: string = '';
  public duration: string = '';
  public tutorName: string = '';
  public days: string = '';
  public maxLimit: string = '';
  public subject: string = '';
  public room: string = '';
  public subjectAssg: string = '';
  public notes: string = '';
  public id: string = '';
  public studentAssigned:string = '';

  columnsToDisplay: string[] = ['currentYear', 'semester', 'tutorName', 'subject',
    'classPeriod', 'meetingTime', 'days', 'room', 'maxLimit', 'studentAssigned'];
  modalColumnsToDisplay: string[] =
    ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];


  dataSource: MatTableDataSource<any>;
  public modalDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  isLoading: boolean = true;

  constructor(private modalService: BsModalService,
              private tutorClassesService: TutorClassesService,
              private dialog: MatDialog) {
    this.selectedStudentList = [];
  }

  ngOnInit() {
    this.getTutorClassesList();
    this.getStudentsList();
    this.getTutorList();
  }

   ngAfterViewInit() {
       this.dataSource.paginator = this.paginator;
   }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openTutorClassesModal(template: TemplateRef<any>) {
    this.resetPayload();
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  openEditPopup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
    this.setValuesToUpdate();
  }

  openStudentModal(template: TemplateRef<any>) {
    this.modalStudentRef = this.modalService.show(template, this.studentModalConfigSM);
  }

  resetFields() {
    this.isEdit = false;

  }

  setValuesToUpdate() {
    if(this.selectedRow) {
      this.id = this.selectedRow.id;
      this.tutorClassesService.getTutorClassesRecordPerId(this.id).subscribe((request)=>{
      if(request){

            this.id= request.id;
            this.classPeriod= String(request.classPeriod);
            this.currentYear= String(request.currentYear);
            this.days= String(request.days);
            this.duration= String(request.duration);
            this.maxLimit= String(request.maxLimit);
            this.meetingTime= request.meetingTime;
            this.notes= request.notes;
            this.room= request.room;
            this.semester= request.semester;

            this.selectedStudentList= request.studentList;
            this.subject= request.subject;
            this.tutorName= request.tutorName
      }


      });

    }
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

  setSelectedRow(selectedRowItem: any, index: Number) {
    this.selectedRowIndex = index;
    this.selectedRow = selectedRowItem;
  }

  public getTutorClassesList() {
    this.tutorClassesService.getTutorClassesList().subscribe((result) => {
      this.hideLoader();
      if (result) {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.selectedRowIndex = null;
        this.dataSource.sort = this.sort;
        console.log('...', result);

      }

    });
  }

  public getSelectedModalRow(data: any, index: number) {
    this.selectedModalRow = index;
    this.selectedModalRowData = data;
  }

  public setSelectedAssignedStudentRow(data: any, index: number) {
    this.selectedAssgStdModalRow = index;
    this.selectedAssgStdModalRowData = data;
  }

  public removeStudentAssignRcd() {
    this.selectedStudentList = this.selectedStudentList.filter(studn => studn.ssno !== this.selectedAssgStdModalRowData.ssno);
  }

  public addSelectedStudent() {
    //this.selectedStudentList.push(this.selectedModalRowData);
    if (this.selectedStudentList && this.selectedStudentList.length > 0) {
      for (let key in this.selectedStudentList)
        if (!(this.selectedStudentList[key].ssno === this.selectedModalRowData.ssno)) {
          this.selectedStudentList.push(this.selectedModalRowData);
        }
    } else {
      this.selectedStudentList.push(this.selectedModalRowData);
    }
  }

  public openEditModal() {
    //this.editModalRef = this.modalService.show(this.staffStudentEditPopupRef, this.modalConfigSM);
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList() {
    this.spinner = true;
    this.tutorClassesService.getStudentsList().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.selectedModalRow = null;
        this.studentsList = result;
        this.modalDataSource = new MatTableDataSource(this.studentsList);
      }
    });
  }

  public getTutorList() {
    this.tutorClassesService.getTutors().subscribe((result: any) => {
      if (result) {
        result.filter(
          (tutor: any) => {
            if (tutor.staffTutor === true) {
              this.tutors.push(tutor.staffName);
              console.log(tutor.staffName);
            }
          });
      }
    });
  }

  saveTutorClassesData() {
    let payload = this.payloadFormation();
    console.log(payload);
    this.tutorClassesService.addTutorClasses(payload).subscribe((result) => {
      this.getTutorClassesList();
      console.log(result);
    });

  }

  deleteSelectedRow() {
    let payload = {
      id:this.selectedRow.id
    };
    this.tutorClassesService.deleteTutorClasses(payload).subscribe((result)=>{
      if(result){
        this.getTutorClassesList();
      }
    });
  }

  payloadFormation() {
    return {
      id: this.id,
      classPeriod: String(this.classPeriod),
      currentYear: String(this.currentYear),
      days: String(this.days),
      duration: String(this.duration),
      maxLimit: String(this.maxLimit),
      meetingTime: this.meetingTime,
      notes: this.notes,
      room: this.room,
      semester: this.semester,
      studentAssigned: this.studentAssigned,
      studentList: this.selectedStudentList,
      subject: this.subject,
      tutorName: this.tutorName
    }

  }


  resetPayload() {

        this.id = '',
        this.classPeriod = '',
        this.currentYear = '',
        this.days = '',
        this.duration = '',
        this.maxLimit = '',
        this.meetingTime = '',
        this.notes = '',
        this.room = '',
        this.semester = '',
        this.studentAssigned = '',
        this.selectedStudentList = [],
        this.subject = '',
        this.tutorName = ''

    }
}

