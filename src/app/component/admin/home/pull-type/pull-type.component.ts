import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { PullTypeServicesService } from '../../../../services/admin/pull-type.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from '../../../../shared/utilities/notificationUtilities';
import * as FileSaver from 'file-saver';
import { PullDownListsService } from 'src/app/services/admin/pulldown-lists.service';
import { OrganizationsService } from 'src/app/services/super-admin/organizations.service';

@Component({
  selector: 'app-pull-type',
  templateUrl: './pull-type.component.html',
  styleUrls: ['./pull-type.component.css']
})
export class PullTypeComponent implements OnInit {
  public pullTypeData: any;
  public pullTypeDataList: any;
  public dataLoading: boolean = false;
  public isPullTypeModalVisible: boolean = false;
  public pullTypeModalHeader: string = 'Edit Pull Type';
  public pullTypeForm!: FormGroup;
  public pullTypeFilterForm!: FormGroup;
  public isConfirmPullTypeLoading: boolean = false;
  public isSearchPullTypeLoading: boolean = false;
  public isDownloadingPullType: boolean = false;
  public programList: any;
  public existingPullTypeData: any = {
    "pullType": null,
    "numeric": null,
    "apr": null,
    "noEdit": null,
    "isPrimary": null,
    "sortOrder": null,
    "programType": null,
    "serType": null,
    "dataFields": null,
    "pullDescription": null,
    "quickEditDescription": null
  }
  public filterDescription: string = '';
  public filterPullType: string = '';
  public filterProgramType: any = '';
  public resetProcess: boolean = false;

  constructor(
    private sharedService: SharedService,
    private _pullTypeServicesService: PullTypeServicesService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notificationService: NotificationUtilities,
    private organizationService: OrganizationsService
  ) { }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Pulltype Information');
    this.getPullTypeListData();
    this.pullTypeForm = this.fb.group({
      formLayout: ['vertical'],
      pullType: [null],
      numeric: [null],
      apr: [null],
      noEdit: [null],
      isPrimary: [null],
      sortOrder: [null, [Validators.required]],
      programType: [null, [Validators.required]],
      serType: [null, [Validators.required]],
      dataFields: [null],
      pullDescription: [null],
      quickEditDescription: [null]
    });

    this.pullTypeFilterForm = this.fb.group({
      formLayout: ['horizontal'],
      description: [''],
      pullType: [''],
      programType: ['']
    });
  }

  getPullTypeListData() {
    this.dataLoading = true;
    this._pullTypeServicesService.getPullTypeList().subscribe((result: any) => {
      if (result) {
        this.pullTypeData = result;
        this.pullTypeDataList = result;
        this.dataLoading = false;
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
    });

    this.organizationService.getProgTypeList().subscribe((result: any) => {
      this.dataLoading = true;
      if (result) {
          this.programList = result;
          this.dataLoading = false;
      }
  });



  }


  updatePullType(pullTypeId: number): void {
    this.pullTypeDataList.forEach((pullTypeData: any, i: number) => {
      if (pullTypeData.pullTypeId == pullTypeId) {
        this.existingPullTypeData = {
          pullType: pullTypeData.pullType,
          numeric: pullTypeData.numeric,
          apr: pullTypeData.apr,
          noEdit: pullTypeData.noEdit,
          isPrimary: pullTypeData.primary,
          sortOrder: pullTypeData.sortOrder,
          programType: pullTypeData.projType,
          serType: pullTypeData.serType,
          dataFields: pullTypeData.dataFields,
          pullDescription: pullTypeData.pullDesc,
          quickEditDescription: pullTypeData.quickEditDesc,
          pullTypeId: pullTypeData.pullTypeId,
        }
      }
    });
    this.isPullTypeModalVisible = true;
  }

  handleCancel(): void {
    this.clearPullFormValue();
    this.isPullTypeModalVisible = false;
  }

  clearPullFormValue() {
    for (let control in this.pullTypeForm.controls) {
      // this.confirmValidateForm.controls[control].setErrors(null);
      this.pullTypeForm.controls[control].markAsPristine();
      this.pullTypeForm.controls[control].markAsUntouched();
      this.pullTypeForm.controls[control].updateValueAndValidity();
    }
    this.existingPullTypeData = {
      pullType: null,
      numeric: null,
      apr: null,
      noEdit: null,
      isPrimary: null,
      sortOrder: null,
      programType: null,
      serType: null,
      dataFields: null,
      pullDescription: null,
      quickEditDescription: null
    }
  }

  updatePullTypeForm(): void {
    this.submitPullTypeForm(this.pullTypeForm.value)
  }

  submitPullTypeForm(frmValue: any): void {
    for (const i in this.pullTypeForm.controls) {
      this.pullTypeForm.controls[i].markAsDirty();
      this.pullTypeForm.controls[i].updateValueAndValidity();
    }
    if (this.pullTypeForm.valid) {
      this.isConfirmPullTypeLoading = true;
      const requestObj = {
        "apr": frmValue.apr,
        "dataFields": frmValue.dataFields,
        "noEdit": frmValue.noEdit,
        "numeric": frmValue.numeric,
        "primary": frmValue.isPrimary,
        "projType": frmValue.programType,
        "pullDesc": frmValue.pullDescription,
        "pullType": frmValue.pullType,
        "pullTypeId": this.existingPullTypeData.pullTypeId,
        "quickEditDesc": frmValue.quickEditDescription,
        "serType": frmValue.serType,
        "sortOrder": frmValue.sortOrder
      };
      const ids = this.message.loading('Updating Pull Type Information...', { nzDuration: 0 }).messageId;
      this._pullTypeServicesService.updatePullType(requestObj).subscribe((res: any) => {
        if (res) {
          this.notificationService.createNotificationBasic('success', "Pull Type Information", 'Pull Type Updated Successfully!');
          this.clearPullFormValue();
          this.isPullTypeModalVisible = false;
          this.message.remove(ids);
          this.getPullTypeListData();
          this.isConfirmPullTypeLoading = false;
        }
      }, (error: any) => {
        this.message.remove(ids);
        this.clearPullFormValue();
        this.isPullTypeModalVisible = false;
        this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
        this.isConfirmPullTypeLoading = false;
      });
    }
  }

  searchPullType(): void {
    this.searchPullTypeForm(this.pullTypeFilterForm.value);
  }

  searchPullTypeForm(frmValue: any): void {
    for (const i in this.pullTypeFilterForm.controls) {
      this.pullTypeFilterForm.controls[i].markAsDirty();
      this.pullTypeFilterForm.controls[i].updateValueAndValidity();
    }
    if (this.pullTypeFilterForm.valid) {
      this.dataLoading = true;
      this.isSearchPullTypeLoading = true;
      const requestObj = {
        "filterDescription": frmValue.description.trim(),
        "filterPullType": frmValue.pullType.trim(),
        "filterProgramType": frmValue.programType === null ? '' : frmValue.programType
      };
      const ids = this.message.loading('Searching Pull Type Information...', { nzDuration: 0 }).messageId;
      this._pullTypeServicesService.searchPullTypeList(requestObj).subscribe((res: any) => {
        if (res) {
          this.pullTypeData = res;
          this.pullTypeDataList = res;
          this.dataLoading = false;
          this.notificationService.createNotificationBasic('success', "Pull Type Information", 'Pull Type Information Fetched Successfully!');
          this.message.remove(ids);
          this.isSearchPullTypeLoading = false;
        }
      }, (error: any) => {
        this.message.remove(ids);
        this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
        this.isSearchPullTypeLoading = false;
      });
    }
  }

  resetFilters(): void {
    for (let control in this.pullTypeFilterForm.controls) {
      // this.confirmValidateForm.controls[control].setErrors(null);
      this.pullTypeFilterForm.controls[control].markAsPristine();
      this.pullTypeFilterForm.controls[control].markAsUntouched();
      this.pullTypeFilterForm.controls[control].updateValueAndValidity();
    }
    this.resetProcess = true;
    this.filterDescription = '';
    this.filterPullType = '';
    this.filterProgramType = '';
    this.dataLoading = true;
    this._pullTypeServicesService.getPullTypeList().subscribe((result: any) => {
      if (result) {
        this.pullTypeData = result;
        this.pullTypeDataList = result;
        this.dataLoading = false;
        this.resetProcess = false;
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
      this.resetProcess = false;
    });
  }

  exportExcel(): void {
    const requestObj = {
      "filterDescription": this.filterDescription.trim(),
      "filterPullType": this.filterPullType.trim(),
      "filterProgramType": this.filterProgramType === null ? '' : this.filterProgramType
    };
    const ids = this.message.loading('Downloading Pull Type Information...', { nzDuration: 0 }).messageId;
    this.isDownloadingPullType = true;
    this._pullTypeServicesService.downloadPullTypeList(requestObj).subscribe((res: any) => {
      if (res) {
        const blob = new Blob([res.body],
          { type: 'application/vnd.ms-excel' });
        const file = new File([blob], 'PulltypeInfo.xlsx',
          { type: 'application/vnd.ms-excel' });
        FileSaver.saveAs(file);
        this.message.remove(ids);
        this.isDownloadingPullType = false;
        this.notificationService.createNotificationBasic('success', "Pull Type Information", 'Pull Type Information Downloaded Successfully!');
      }
    }, (error: any) => {
      this.message.remove(ids);
      this.isDownloadingPullType = false;
      this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
    });
  }

}
