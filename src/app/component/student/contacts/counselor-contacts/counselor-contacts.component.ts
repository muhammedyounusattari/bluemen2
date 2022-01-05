import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CounselorContactsService } from 'src/app/services/counselor/counselor-contacts.service';

@Component({
    selector: 'counselor-contacts',
    templateUrl: './counselor-contacts.component.html',
    styleUrls: ['./counselor-contacts.component.css']
})

export class CounselorContactsComponent {

    public columnsToDisplay: string[] =
      ['staffFirstName', 'staffLastName', 'staffPhoneNumber', 'staffContactDate', 'staffCounselor', 'staffContactTime', 'staffRecontactDate'];
    public modalColumnsToDisplay: string[] =
      ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
  
    public dataSource: MatTableDataSource<any>;
    public modalDataSource: MatTableDataSource<any>;
  
    @ViewChild('counselorStudentPopup') counselorStudentPopupRef: TemplateRef<any>;
    public modalRef: BsModalRef;
    @ViewChild('counselorStudentEditPopup') counselorStudentEditPopupRef: TemplateRef<any>;
    public editModalRef: BsModalRef;
    modalConfigSM = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    }
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  
    public counselorContactsForm: FormGroup;
    public counselorContactsModalForm: FormGroup;
    public counselorContactsList: any = [];
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
      private counselorContactsService: CounselorContactsService
    ) {
      this.modalDataSource = this.dataSource = new MatTableDataSource();
      this.getCounselorContacts();
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
    this.counselorContactsModalForm = this.fb.group({
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

    this.counselorContactsForm = this.fb.group({
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
      this.modalRef = this.modalService.show(this.counselorStudentPopupRef, this.modalConfigSM);
      this.getTStudentsList();
    }
  
    /**
     * @method openEditModal
     */
    public openEditModal() {
      this.editModalRef = this.modalService.show(this.counselorStudentEditPopupRef, this.modalConfigSM);
    }
  
    /**
     * @method getCounselorContacts
     */
    public getCounselorContacts() {
      this.spinner = true;
      this.counselorContactsService.getCounselorContacts().subscribe((result: any) => {
        if (result && result.length > 0) {
          this.counselorContactsList = result;
          // this.counselorContactsList = result.map((x: any) => x = {...x, ...this.mockAPIResponse()});
          this.spinner = false;
          this.selectedRow = null;
          this.dataSource = new MatTableDataSource(this.counselorContactsList);
          this.getSelectedRow(this.counselorContactsList[0], 0);
        }
      });
    }
  
    /**
     * @method getTStudentsList
     */
    public getTStudentsList() {
      this.spinner = true;
      this.counselorContactsService.getTStudentsList().subscribe((result: any) => {
        if (result) {
          this.spinner = false;
          this.selectedModalRow = null;
          this.studentsList = result;
          this.modalDataSource = new MatTableDataSource(this.studentsList);
        }
      });
    }
  
  
    /**
     * @method addCounselorContacts
     */
    public addCounselorContacts() {
      this.counselorContactsService
        .addCounselorContacts(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.getCounselorContacts();
          }
        });
    }
  
    /**
     * @method editCounselorContacts
     */
    public editCounselorContacts() {
      let request: any = this.requestPayload();
      if (request['ssno'] == undefined) {
        request['ssno'] = this.selectedRowData.ssno
      }
      this.counselorContactsService
        .editCounselorContacts(request)
        .subscribe((result: any) => {
          if (result) {
            this.getCounselorContacts();
          }
        });
    }
  
    /**
     * @method deleteCounselorContacts
     */
    public deleteCounselorContacts() {
      this.counselorContactsService
        .deleteCounselorContacts({ ssno: this.selectedRowData.ssno })
        .subscribe((result: any) => {
          if (result) {
            this.getCounselorContacts();
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
          this.addCounselorContacts();
          break;
        case 'Edit':
          this.editCounselorContacts();
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