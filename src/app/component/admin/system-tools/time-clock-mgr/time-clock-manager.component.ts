import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TimeClockManagerService } from 'src/app/services/admin/time-clock-manager.service';

@Component({
  selector: 'app-time-clock-manager',
  templateUrl: './time-clock-manager.component.html',
})
export class TimeClockManagerComponent {
  public columnsToDisplay: string[] = ['staffName', 'checkInTime', 'checkOutTime', 'duration'];
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
  };
  public timeClockManagerForm: FormGroup;
  public timeClockManagerModalForm: FormGroup;
  public staffType: FormGroup;
  public timeClockManagerList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedData: any;
  public spinner: boolean = true;
  public staffMembersList: any = [];

  constructor(private modalService: BsModalService, private fb: FormBuilder,
    private timeClockManagerService: TimeClockManagerService) {
    this.getTimeClockManager();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initialiseForm();
    this.getStaffMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.timeClockManagerForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      staffName: ['']
    });
    this.staffType = this.fb.group({
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
        this.setDataSorce(result);
      }
    });
  }

  /**
   * @method setDataSorce
   */
  public setDataSorce(result: any) {
    result.forEach((element: any) => {
      element.checkInTime = element.checkInTime ? moment(element.checkInTime).format('DD/MM/yyyy h:mm:ss') : '';
      element.checkOutTime = element.checkOutTime ? moment(element.checkOutTime).format('DD/MM/yyyy h:mm:ss') : '';
    });
    this.spinner = false;
    this.timeClockManagerList = result;
    this.dataSource = new MatTableDataSource(this.timeClockManagerList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSelectedRow(this.timeClockManagerList[0], 0);
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
   * @method getStaffMembers
   */
   public getStaffMembers() {
    this.timeClockManagerService.getStaffMember().subscribe((resp: any) => {
      if (resp)
      resp.forEach((element: any) => {
        if (element.id && element.staffName) {
          this.staffMembersList.push({id: element.id, staffName: element.staffName});
        }
      });
    })
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
    this.spinner = true;
    this.timeClockManagerService.filterTimeClockManager(this.filterPayload())
      .subscribe((result: any) => {
        if (result ) {
          this.setDataSorce(JSON.parse(result));
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
      staffName: this.timeClockManagerModalForm.value.staffName?.staffName,
      staffId: this.timeClockManagerModalForm.value.staffName?.id
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
      staffName: this.timeClockManagerModalForm.value.staffName?.staffName,
      staffId: this.timeClockManagerModalForm.value.staffName?.id
    }
  }

  /**
   * @method filterPayload
   */
  public filterPayload() {
    return {
      staffName: this.timeClockManagerForm.value.staffName.staffName,
      fromDate: this.timeClockManagerForm.value.fromDate,
      toDate: this.timeClockManagerForm.value.toDate,
      active: this.staffType.value.active ? 'Yes' : 'No',
      counselor: this.staffType.value.counselor ? 'Yes' : 'No',
      tutor: this.staffType.value.tutor ? 'Yes' : 'No',
      teacher: this.staffType.value.teacher ? 'Yes' : 'No',
    };
  }
}
