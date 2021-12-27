import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RecallStudentsService } from 'src/app/services/admin/recall-students.service';

@Component({
  selector: 'app-recall-students',
  templateUrl: './recall-students.component.html',
})
export class RecallStudentsComponent implements OnInit {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm',
  };

  public selectedOption: any = '';
  public selectedRow: any = '';
  public selectedRowData: any;
  public spinner: boolean = true;
  public recallStudentsList: any = [];
  public recallStudentsModalForm: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private recallStudentsService: RecallStudentsService
  ) {
    this.getRecallStudents()
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.recallStudentsModalForm = this.fb.group({
      staffName: [''],
      staffTitle: [''],
      staffSSNO: [''],
      staffId: [''],
      staffDOB: [''],
      standing: [''],
      staffCodes: [''],
      staffSpouseName: [''],
      staffDriverLicense: [''],
      staffCustomFieldOne: [''],
      staffCustomFieldTwo: [''],
      staffCustomFieldThree: [''],
      staffCustomFieldFour: [''],
      staffNotes: [''],
      staffSchool: [''],
      staffEligibility: [''],
      staffCounselor: [''],
    });
  }

  addNewDropdown() {
    this.openModal(this.addDropDownValueRef);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  /**
   * @method getRecallStudents
   */
  public getRecallStudents() {
    this.recallStudentsService.getRecallStudentsList().subscribe((result) => {
      if (result) {
        this.spinner = false;
        this.recallStudentsList = result;
      }
    });
  }

  /**
   * @method addRecallStaffMembers
   */
  public addRecallStaffMembers() {
    this.recallStudentsService
      .addRecallStaffMembers(this.requestPayload())
      .subscribe((result) => {
        if (result) {
          this.getRecallStudents();
        }
      });
  }

  /**
   * @method editRecallStaffMembers
   */
  public editRecallStaffMembers() {
    this.recallStudentsService
      .editRecallStaffMembers(this.requestPayload())
      .subscribe((result) => {
        if (result) {
          this.getRecallStudents();
        }
      });
  }

  /**
   * @method deleteRecallStaffMembers
   */
  public deleteRecallStaffMembers() {
    this.recallStudentsService
      .deleteRecallStaffMembers({ staffId: this.selectedRowData.staffId })
      .subscribe((result) => {
        if (result) {
          this.getRecallStudents();
        }
      });
  }

  /**
   * @method filterRecallStaffMembers
   */
  public filterRecallStaffMembers() {
    this.recallStudentsService
      .filterRecallStaffMembers(this.requestPayload())
      .subscribe((result: any) => {
        if (result && result.length > 0) {
          result.forEach((data: any) => {
            data.orgType = data.orgType.toString();
          });
          this.getRecallStudents();
        }
      });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.selectedOption = selectedOption;
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
        this.addRecallStaffMembers();
        break;
      case 'Edit':
        break;
      case 'Rename':
        break;
      case 'Move':
        break;
      case 'Merge':
        break;
      case 'Delete':
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
   * @description create request payload for API
   */
  public requestPayload() {
    return {
      staffName: this.recallStudentsModalForm.value.staffName,
      staffTitle: this.recallStudentsModalForm.value.staffTitle,
      staffSSNO: this.recallStudentsModalForm.value.staffSSNO,
      staffId: this.recallStudentsModalForm.value.staffId,
      staffDOB: moment(
        new Date(this.recallStudentsModalForm.value.staffDOB)
      ).format('DD/MM/yyyy'),
      standing: this.recallStudentsModalForm.value.standing,
      staffCodes: this.recallStudentsModalForm.value.staffCodes,
      staffSpouseName: this.recallStudentsModalForm.value.staffSpouseName,
      staffDriverLicense: this.recallStudentsModalForm.value.staffDriverLicense,
      staffCustomFieldOne:
        this.recallStudentsModalForm.value.staffCustomFieldOne,
      staffCustomFieldTwo:
        this.recallStudentsModalForm.value.staffCustomFieldTwo,
      staffCustomFieldThree:
        this.recallStudentsModalForm.value.staffCustomFieldThree,
      staffCustomFieldFour:
        this.recallStudentsModalForm.value.staffCustomFieldFour,
      staffNotes: this.recallStudentsModalForm.value.staffNotes,
      staffSchool: this.recallStudentsModalForm.value.staffSchool,
      staffEligibility: this.recallStudentsModalForm.value.staffEligibility,
      staffCounselor: this.recallStudentsModalForm.value.staffCounselor,
      address: null,
      id: 1,
      staffActive: true,
      staffHireDate: moment(new Date()).format('DD/MM/yyyy'),
      staffLab: 'Adams',
      staffPicture: null,
      staffTeacher: 'Adams',
      staffTerminationDate: null,
      staffTutor: true,
    };
  }
}
