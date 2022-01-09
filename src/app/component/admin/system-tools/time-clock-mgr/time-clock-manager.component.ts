import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TimeClockManagerService } from 'src/app/services/admin/time-clock-manager.service';

@Component({
  selector: 'app-time-clock-manager',
  templateUrl: './time-clock-manager.component.html',
})
export class TimeClockManagerComponent {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
  };
  public timeClockManagerForm: FormGroup;
  public timeClockManagerModalForm: FormGroup;
  public timeClockManagerList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedData: any;
  public spinner: boolean = true;

  constructor(private modalService: BsModalService, private fb: FormBuilder,
    private timeClockManagerService: TimeClockManagerService) {
    this.getTimeClockManager();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }


  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.timeClockManagerForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      staffName: [''],
      active: [''],
      counselor: [''],
      tutor: [''],
      teacher: ['']
    });

    this.timeClockManagerModalForm = this.fb.group({
      checkInTime: [''],
      checkOutTime: [''],
      staffName: ['']
    });
  }

  /**
   * @method openModal
   */
  public openModal() {
    this.modalRef = this.modalService.show(
      this.addDropDownValueRef,
      this.modalConfigSM
    );
  }

  /**
   * @method addTimeClockManager
   */
   public addTimeClockManager() {
    this.timeClockManagerService
      .addTimeClockManager(this.requestPayloadForAddEdit())
      .subscribe((result: any) => {
        if (result) {
          this.getTimeClockManager();
        }
      });
  }

  /**
   * @method editTimeClockManager
   */
  public editTimeClockManager() {
    let request: any = this.requestPayloadForAddEdit();
    if (request['id'] == undefined) {
      request['id'] = this.selectedData.id
    }
    this.timeClockManagerService
      .editTimeClockManager(request)
      .subscribe((result: any) => {
        if (result) {
          this.getTimeClockManager();
        }
      });
  }

  /**
   * @method getTimeClockManager
   */
  public getTimeClockManager() {
    this.spinner = true;
    this.timeClockManagerService.getTimeClockManager().subscribe((result: any) => {
      if (result) {
        result.forEach((element: any) => {
          element.checkInTime = moment(element.checkInTime).format('DD/MM/yyyy h:mm:ss');
          element.checkOutTime = moment(element.checkOutTime).format('DD/MM/yyyy h:mm:ss');
        });
        this.spinner = false;
        this.timeClockManagerList = result;
      }
    });
  }

  /**
   * @method deleteTimeClockManager
   */
  public deleteTimeClockManager() {
    this.timeClockManagerService
      .deleteTimeClockManager({id: this.selectedData.id})
      .subscribe((result: any) => {
        if (result) {
          this.getTimeClockManager();
        }
      });
  }

  /**
   * @method filterTimeClockManager
   */
  public filterTimeClockManager() {
    this.timeClockManagerService
      .filterTimeClockManager(this.requestPayloadForFilter())
      .subscribe((result: any) => {
        if (result ) {
          this.getTimeClockManager();
        }
      });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.selectedOption = selectedOption;
    this.timeClockManagerModalForm.reset();
    this.timeClockManagerModalForm.updateValueAndValidity();
    if(this.selectedOption === 'Edit') {
      this.timeClockManagerModalForm.get('checkInTime')?.setValue(new Date(this.selectedData.checkInTime).toISOString().slice(0, 16));
      this.timeClockManagerModalForm.get('checkOutTime')?.setValue(new Date(this.selectedData.checkOutTime).toISOString().slice(0, 16));
      this.timeClockManagerModalForm.get('staffName')?.setValue(this.selectedData.staffName);
      this.timeClockManagerModalForm.updateValueAndValidity();
    }
  }


  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.selectedData = data;
  }

  /**
   * @method handleMethodToCall
   */
  public handleMethodToCall() {
    switch (this.selectedOption) {
      case 'New':
        this.addTimeClockManager();
        break;
      case 'Edit':
        this.editTimeClockManager()
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
   * @method requestPayloadForFilter
   * @description create the request payload for API's
   */
   public requestPayloadForFilter() {
    let checkIn = moment(this.timeClockManagerForm.value.checkInTime);
    let checkOut = moment(this.timeClockManagerForm.value.checkOutTime);
    return {
      checkInTime: new Date(this.timeClockManagerForm.value.checkInTime).toISOString(),
      checkOutTime: new Date(this.timeClockManagerForm.value.checkOutTime).toISOString(),
      duration: checkOut.diff(checkIn, 'days') + ' days ' + checkOut.diff(checkIn, 'days') + ' hours',
      id: 0,
      staffName: this.timeClockManagerForm.value.staffName
    }
  }

  /**
   * @method requestPayloadForAddEdit
   * @description create the request payload for API's
   */
  public requestPayloadForAddEdit() {
    let checkIn = moment(this.timeClockManagerModalForm.value.checkInTime);
    let checkOut = moment(this.timeClockManagerModalForm.value.checkOutTime);
    return {
      checkInTime: new Date(this.timeClockManagerModalForm.value.checkInTime).toISOString(),
      checkOutTime: new Date(this.timeClockManagerModalForm.value.checkOutTime).toISOString(),
      duration: checkOut.diff(checkIn, 'days') + ' days ' + checkOut.diff(checkIn, 'days') + ' hours',
      staffName: this.timeClockManagerModalForm.value.staffName
    }
  }
}
