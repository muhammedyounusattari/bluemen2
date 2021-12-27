import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CounselorsService } from 'src/app/services/counselor/counselors.service';

@Component({
  selector: 'app-counselors',
  templateUrl: './counselors.component.html',
  styleUrls: ['./counselors.component.css'],
})
export class CounselorsComponent {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  isVisible: boolean = false;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
  };

  public counselorsForm: FormGroup;
  public counselorModalForm: FormGroup;
  public counselorsList: any;
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public spinner: boolean = true;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private counselorsService: CounselorsService
  ) {
    this.getCounselors();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.counselorsForm = this.fb.group({
      hireDateFrom: [''],
      hireDateTo: [''],
      active: [''],
      codes: [''],
      zipCode: [''],
    });

    this.counselorModalForm = this.fb.group({
      name: [''],
    });
  }

  addNewDropdown() {
    this.openModal(this.addDropDownValueRef);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  /**
   * @method addCounselors
   */
  public addCounselors() {
    this.counselorsService
      .addCounselors(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getCounselors();
        }
      });
  }

  /**
   * @method editCounselors
   */
  public editCounselors() {
    this.counselorsService
      .editCounselors(this.requestPayload())
      .subscribe((result: any) => {
        if (result) {
          this.getCounselors();
        }
      });
  }

  /**
   * @method getCounselors
   */
  public getCounselors() {
    this.counselorsService.getCounselors().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.counselorsList = result;
      }
    });
  }

  /**
   * @method deleteCounselors
   */
  public deleteCounselors() {
    this.counselorsService
      .deleteCounselors({ staffCounselor: this.counselorModalForm.value.name })
      .subscribe((result: any) => {
        if (result) {
          this.getCounselors();
        }
      });
  }

  /**
   * @method filterCounselors
   */
  public filterCounselors() {
    this.counselorsService
      .filterCounselors(this.requestPayload())
      .subscribe((result: any) => {
        if (result && result.length > 0) {
          this.getCounselors();
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
        this.addCounselors();
        break;
      case 'Edit':
        this.editCounselors();
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
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    return {
      address: null,
      id: 1,
      staffActive: true,
      staffCodes: 2,
      staffCounselor: this.counselorModalForm.value.name,
      staffCustomFieldFour: null,
      staffCustomFieldOne: null,
      staffCustomFieldThree: null,
      staffCustomFieldTwo: null,
      staffDOB: moment(new Date('12/06/1985')).format('DD/MM/yyyy'),
      staffDriverLicense: null,
      staffHireDate: moment(new Date()).format('DD/MM/yyyy'),
      staffId: 1,
      staffLab: 'Adams',
      staffName: 'Morris',
      staffNotes: null,
      staffPicture: null,
      staffSSNO: '(856)8544555',
      staffSpouseName: null,
      staffTeacher: 'Adams',
      staffTerminationDate: null,
      staffTitle: 'Test',
      staffTutor: false,
    };

    // return {
    //   hireDateFrom: this.counselorsForm.value.hireDateFrom,
    //   hireDateTo: this.counselorsForm.value.hireDateTo,
    //   active: this.counselorsForm.value.active,
    //   codes: this.counselorsForm.value.codes,
    //   zipCode: this.counselorsForm.value.zipCode,
    //   name: this.counselorModalForm.value.name
    // }
  }
}
