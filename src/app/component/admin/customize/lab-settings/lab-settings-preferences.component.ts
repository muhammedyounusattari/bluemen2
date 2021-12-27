import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LabSettingsEnum } from '../../../../constants/enums/lab-settings.enum';
import { LabSettingsPreferencesService } from '../../../../services/admin/lab-settings.preferences.service';

@Component({
    selector: 'lab-settings',
    templateUrl: './lab-settings-preferences.component.html',
    // styleUrls: ['./lab-settings-preferences.component.css']
})

export class LabSettingsPreferencesComponent {
    lLabSettingsEnum: LabSettingsEnum = new LabSettingsEnum();
    requestBody = {
        id: 0,
        labAcknowledgement: true,
        labAutomaticallyCheckInCheckOut: true,
        labComponents: '',
        labDefaultService: '',
        labFiscalYear: '',
        labForcedTimeSpent: '',
        labHideCheckOutList: true,
        labHideStudentList: true,
        labMaxCheckoutTime: '',
        labReasonForVisitOptionVisible: true,
        labServicerRequired: true,
        labServicesVisibile: true,
        labStaffMemberOptionVisible: true,
        labStudentsCanChooseMultipleService: true,
        labWaitWindowTime: '',
        lapSearchPriority: ''
    }
    constructor(private modalService: BsModalService
        , private _labSettingsPreferencesService: LabSettingsPreferencesService) { }

    addLabSettingsPreferences() {
     this.requestBody.id = 0;
     this.requestBody.labAcknowledgement = this.lLabSettingsEnum.labAcknowledgement;
     this.requestBody.labAutomaticallyCheckInCheckOut = this.lLabSettingsEnum.labAutomaticallyCheckInCheckOut;
     this.requestBody.labComponents = this.lLabSettingsEnum.labComponents;
     this.requestBody.labDefaultService = this.lLabSettingsEnum.labDefaultService;
     this.requestBody.labFiscalYear = this.lLabSettingsEnum.labFiscalYear;
     this.requestBody.labForcedTimeSpent = this.lLabSettingsEnum.labForcedTimeSpent;
     this.requestBody.labHideCheckOutList = this.lLabSettingsEnum.labHideCheckOutList;
     this.requestBody.labHideStudentList = this.lLabSettingsEnum.labHideStudentList;
     this.requestBody.labMaxCheckoutTime = this.lLabSettingsEnum.labMaxCheckoutTime;
     this.requestBody.labReasonForVisitOptionVisible = this.lLabSettingsEnum.labReasonForVisitOptionVisible;
     this.requestBody.labServicerRequired = this.lLabSettingsEnum.labServicerRequired;
     this.requestBody.labServicesVisibile = this.lLabSettingsEnum.labServicesVisibile;
     this.requestBody.labStaffMemberOptionVisible = this.lLabSettingsEnum.labStaffMemberOptionVisible;
     this.requestBody.labStudentsCanChooseMultipleService = this.lLabSettingsEnum.labStudentsCanChooseMultipleService;
     this.requestBody.labWaitWindowTime = this.lLabSettingsEnum.labWaitWindowTime;
     this.requestBody.lapSearchPriority = this.lLabSettingsEnum.lapSearchPriority;

     this._labSettingsPreferencesService.postLabSettingsPreferences(this.requestBody).subscribe(result => {
         if(result) {
             alert('Record Saved Successfully !');
             this.lLabSettingsEnum = new LabSettingsEnum();
         }
     })
    }
}
