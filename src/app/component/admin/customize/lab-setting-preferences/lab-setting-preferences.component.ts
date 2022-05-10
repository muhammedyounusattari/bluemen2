import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from '../../../../shared/utilities/notificationUtilities';
import { LabSettingsEnum } from '../../../../constants/enums/lab-settings.enum';
import { LabSettingsPreferencesService } from '../../../../services/admin/lab-settings.preferences.service';
import { Router } from '@angular/router';
import { ValidationClass } from '../../../../shared/validation/common-validation-class';
import { PullDownListService } from '../../../../services/admin/pulldown-list.service'

@Component({
  selector: 'app-lab-setting-preferences',
  templateUrl: './lab-setting-preferences.component.html',
  styleUrls: ['./lab-setting-preferences.component.css']
})
export class LabSettingPreferencesComponent implements OnInit {
  public labSettingForm: FormGroup;
  public validationClass: ValidationClass = new ValidationClass();
  public lLabSettingsEnum: LabSettingsEnum = new LabSettingsEnum();
  public labSettingData: any = {
    "lapSearchPriority": [],
    "labComponents": [],
    "labFiscalYear": '',
    "labWaitWindowTime": '',
    "labHideStudentList": false,
    "labHideCheckOutList": false,
    "labMaxCheckoutTime": '',
    "labForcedTimeSpent": '',
    "labAutomaticallyCheckInCheckOut": false,
    "labServicesVisibile": false,
    "labServicerRequired": false,
    "labDefaultService": [],
    "labStudentsCanChooseMultipleService": false,
    "labReasonForVisitOptionVisible": false,
    "labStaffMemberOptionVisible": false,
    "labAcknowledgement": false
  }

  public isDisabled: boolean = false;
  public labComponentsList: any = [];
  public lapSearchPriorityList: any = [];
  public labServiceList: any = [];
  public myElement: any = null;
  public isConfirmFormLoading: boolean = false;

  constructor(
    private sharedService: SharedService,
    private message: NzMessageService,
    private notificationService: NotificationUtilities,
    private router: Router,
    private _labSettingsPreferencesService: LabSettingsPreferencesService,
    private formBuilder: FormBuilder,
    private pullDownService: PullDownListService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Lab Settings');
    this.getLabSettingPreferencesData();
    this.bindDropDownValues();
  }

  initForm() {
    this.labSettingForm = this.formBuilder.group({
      formLayout: ['vertical'],
      lapSearchPriority: [null, Validators.required],
      labComponents: [null, Validators.required],
      labFiscalYear: ['', Validators.required],
      labWaitWindowTime: ['', [Validators.required, Validators.minLength(1)]],
      labHideStudentList: [false],
      labHideCheckOutList: [false],
      labMaxCheckoutTime: [''],
      labForcedTimeSpent: [''],
      labAutomaticallyCheckInCheckOut: [false],
      labServicesVisibile: [false],
      labServicerRequired: [false],
      labDefaultService: [null],
      labStudentsCanChooseMultipleService: [false],
      labReasonForVisitOptionVisible: [false],
      labStaffMemberOptionVisible: [false],
      labAcknowledgement: [false]
    });
  }

  getLabSettingPreferencesData(): void {
    this._labSettingsPreferencesService.getLabSettingsPreferencesData().subscribe(result => {
      if (result) {
        this.lLabSettingsEnum.id = result[0].id;
        this.labSettingData = {
          lapSearchPriority: [result[0].lapSearchPriority],
          labComponents: [result[0].labComponents],
          labFiscalYear: result[0].labFiscalYear,
          labWaitWindowTime: result[0].labWaitWindowTime,
          labHideStudentList: result[0].labHideStudentList,
          labHideCheckOutList: result[0].labHideCheckOutList,
          labMaxCheckoutTime: result[0].labMaxCheckoutTime,
          labForcedTimeSpent: result[0].labForcedTimeSpent,
          labAutomaticallyCheckInCheckOut: result[0].labAutomaticallyCheckInCheckOut,
          labServicesVisibile: result[0].labServicesVisibile,
          labServicerRequired: result[0].labServicerRequired,
          labStudentsCanChooseMultipleService: result[0].labStudentsCanChooseMultipleService,
          labReasonForVisitOptionVisible: result[0].labReasonForVisitOptionVisible,
          labStaffMemberOptionVisible: result[0].labStaffMemberOptionVisible,
          labAcknowledgement: result[0].labAcknowledgement,
          labDefaultService: [result[0].labDefaultService]
        }
        if (result[0].labServicesVisibile) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
      }
    });
  }

  bindDropDownValues() {
    let data: any = 'COMPONENT,LABSERVICE,SEARCHPRIORITY';
    this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
      console.log(result);
      if (result?.COMPONENT) {
        this.labComponentsList = result.COMPONENT;
      }
      if (result?.LABSERVICE) {
        this.labServiceList = result.LABSERVICE;
      }
      if (result?.SEARCHPRIORITY) {
        this.lapSearchPriorityList = result.SEARCHPRIORITY;
      }

    });
  }

  setEnableDisable() {
    if (this.labSettingForm?.get('labServicesVisibile')?.value) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  handleCancel(): void {
    this.clearLabSettingFormValue();
    this.isDisabled = false;
  }

  clearLabSettingFormValue() {
    for (let control in this.labSettingForm.controls) {
      // this.labSettingForm.controls[control].setErrors(null);
      this.labSettingForm.controls[control].markAsPristine();
      this.labSettingForm.controls[control].markAsUntouched();
      this.labSettingForm.controls[control].updateValueAndValidity();
    }
    this.labSettingData = {
      lapSearchPriority: [],
      labComponents: [],
      labFiscalYear: '',
      labWaitWindowTime: '',
      labHideStudentList: false,
      labHideCheckOutList: false,
      labMaxCheckoutTime: '',
      labForcedTimeSpent: '',
      labAutomaticallyCheckInCheckOut: false,
      labServicesVisibile: false,
      labServicerRequired: false,
      labDefaultService: [],
      labStudentsCanChooseMultipleService: false,
      labReasonForVisitOptionVisible: false,
      labStaffMemberOptionVisible: false,
      labAcknowledgement: false
    }
  }

  addLabSettingsPreferences(): void {
    this.submitLabSettingForm(this.labSettingForm.value)
  }

  submitLabSettingForm(frmValue: any): void {
    for (const i in this.labSettingForm.controls) {
      this.labSettingForm.controls[i].markAsDirty();
      this.labSettingForm.controls[i].updateValueAndValidity();
    }
    if (this.labSettingForm.valid) {
      this.isConfirmFormLoading = true;
      const requestObj = {
        "id": this.lLabSettingsEnum.id,
        "labAcknowledgement": frmValue.labAcknowledgement,
        "labAutomaticallyCheckInCheckOut": frmValue.labAutomaticallyCheckInCheckOut,
        "labComponents": frmValue.labComponents[0],
        "labDefaultService": frmValue.labDefaultService[0] ? frmValue.labDefaultService[0] : '',
        "labFiscalYear": frmValue.labFiscalYear,
        "labForcedTimeSpent": frmValue.labForcedTimeSpent,
        "labHideCheckOutList": frmValue.labHideCheckOutList,
        "labHideStudentList": frmValue.labHideStudentList,
        "labMaxCheckoutTime": frmValue.labMaxCheckoutTime,
        "labReasonForVisitOptionVisible": frmValue.labReasonForVisitOptionVisible,
        "labServicerRequired": frmValue.labServicerRequired,
        "labServicesVisibile": frmValue.labServicesVisibile,
        "labStaffMemberOptionVisible": frmValue.labStaffMemberOptionVisible,
        "labStudentsCanChooseMultipleService": frmValue.labStudentsCanChooseMultipleService,
        "labWaitWindowTime": frmValue.labWaitWindowTime,
        "lapSearchPriority": frmValue.lapSearchPriority[0],
      };
      const ids = this.message.loading('Adding Lab Settings Data...', { nzDuration: 0 }).messageId;
      this._labSettingsPreferencesService.postLabSettingsPreferences(requestObj).subscribe((res: any) => {
        if (res) {
          this.notificationService.createNotificationBasic('success', "Lab Settings", 'Lab Settings Data Added Successfully!');
          //this.clearLabSettingFormValue();
          this.message.remove(ids);
          this.isConfirmFormLoading = false;
        }
      }, (error: any) => {
        this.message.remove(ids);
        this.clearLabSettingFormValue();
        this.notificationService.createNotificationBasic('error', 'Lab Settings', "System error : " + error.message);
        this.isConfirmFormLoading = false;
      });
    }
  }




}
