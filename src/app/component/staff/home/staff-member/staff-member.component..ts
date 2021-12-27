import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';

@Component({
    selector: 'app-staff-member',
    templateUrl: './staff-member.component.html',
    styleUrls: ['./staff-member.component.css']
})

export class StaffMemberComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    public staffMembersForm: FormGroup;
    public staffMembersModalForm: FormGroup;
    public staffMembersList: any;
    public selectedOption: string = '';
    public selectedRow: any = null;
    public selectedRowData: any = null;
    public spinner: boolean = true;

    constructor(
      private modalService: BsModalService,
      private fb: FormBuilder,
      private staffMembersService: StaffMembersService
    ) {
      this.getStaffMembers();
    }

    ngOnInit(): void {
      this.initialiseForm();
    }

    /**
     * @method initialiseForm
     */
    public initialiseForm() {
      this.staffMembersForm = this.fb.group({
        hireDateFrom: [''],
        hireDateTo: [''],
        active: [''],
        codes: [''],
        zipCode: [''],
      });

      this.staffMembersModalForm = this.fb.group({
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
     * @method addStaffMembers
     */
    public addStaffMembers() {
      this.staffMembersService
        .addStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();
          }
        });
    }

    /**
     * @method editStaffMembers
     */
    public editStaffMembers() {
      this.staffMembersService
        .editStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();
          }
        });
    }

    /**
     * @method getStaffMembers
     */
    public getStaffMembers() {
      this.staffMembersService.getStaffMembers().subscribe((result: any) => {
        if (result) {
          this.spinner = false;
          this.staffMembersList = result;
        }
      });
    }

    /**
     * @method deleteStaffMembers
     */
    public deleteStaffMembers() {
      this.staffMembersService
        .deleteStaffMembers({ staffName: this.staffMembersModalForm.value.name })
        .subscribe((result: any) => {
          if (result) {
            this.getStaffMembers();
          }
        });
    }

    /**
     * @method filterStaffMembers
     */
    public filterStaffMembers() {
      this.staffMembersService
        .filterStaffMembers(this.requestPayload())
        .subscribe((result: any) => {
          if (result && result.length > 0) {
            this.getStaffMembers();
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
          this.addStaffMembers();
          break;
        case 'Edit':
          this.editStaffMembers();
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
        staffCounselor: 'Morris',
        staffCustomFieldFour: null,
        staffCustomFieldOne: null,
        staffCustomFieldThree: null,
        staffCustomFieldTwo: null,
        staffDOB: moment(new Date('12/06/1985')).format('DD/MM/yyyy'),
        staffDriverLicense: null,
        staffHireDate: moment(new Date()).format('DD/MM/yyyy'),
        staffId: 1,
        staffLab: 'Adams',
        staffName: this.staffMembersModalForm.value.name,
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
      //   hireDateFrom: this.staffMembersForm.value.hireDateFrom,
      //   hireDateTo: this.staffMembersForm.value.hireDateTo,
      //   active: this.staffMembersForm.value.active,
      //   codes: this.staffMembersForm.value.codes,
      //   zipCode: this.staffMembersForm.value.zipCode,
      //   name: this.staffMembersModalForm.value.name
      // }
    }
  }
