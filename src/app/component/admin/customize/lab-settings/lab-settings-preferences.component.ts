import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LabSettingsEnum } from '../../../../constants/enums/lab-settings.enum';
import { LabSettingsPreferencesService } from '../../../../services/admin/lab-settings.preferences.service';
import { Router } from '@angular/router';

@Component({
    selector: 'lab-settings',
    templateUrl: './lab-settings-preferences.component.html',
    styleUrls: ['./lab-settings-preferences.css']
})

export class LabSettingsPreferencesComponent implements OnInit {
    lLabSettingsEnum: LabSettingsEnum = new LabSettingsEnum();
    requestBody = {
        id: '',
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
    isDisabled: boolean = false;
    lapSearchPriorityList = [
        {'name': 'Student ID, Scan ID, System Serial Number'},
        {'name': 'Student ID, System Serial Number, Scan ID'},
        {'name': 'Scan ID, Student ID, System Serial Number'},
        {'name': 'Scan ID, System Serial Number, Student ID'},
        {'name': 'System Serial Number, Student ID, Scan ID'},
        {'name': 'System Serial Number, Scan ID, Student ID'}
    ];
    labComponentsList = [
        {'name': 'Academic'},
        {'name': 'Both'},
        {'name': 'Not Applicable'},
        {'name': 'Summer'}
    ];

    constructor(private modalService: BsModalService
        , private router: Router
        , private _labSettingsPreferencesService: LabSettingsPreferencesService) { }

    ngOnInit(): void {
        this._labSettingsPreferencesService.getLabSettingsPreferencesData().subscribe(result => {
            if (result) {
                this.lLabSettingsEnum.id = result[0].id;
                this.lLabSettingsEnum.labAcknowledgement = result[0].labAcknowledgement;
                this.lLabSettingsEnum.labAutomaticallyCheckInCheckOut = result[0].labAutomaticallyCheckInCheckOut;
                this.lLabSettingsEnum.labComponents = result[0].labComponents;
                this.lLabSettingsEnum.labDefaultService = result[0].labDefaultService;
                this.lLabSettingsEnum.labFiscalYear = result[0].labFiscalYear;
                this.lLabSettingsEnum.labForcedTimeSpent = result[0].labForcedTimeSpent;
                this.lLabSettingsEnum.labHideCheckOutList = result[0].labHideCheckOutList;
                this.lLabSettingsEnum.labHideStudentList = result[0].labHideStudentList;
                this.lLabSettingsEnum.labMaxCheckoutTime = result[0].labMaxCheckoutTime;
                this.lLabSettingsEnum.labReasonForVisitOptionVisible = result[0].labReasonForVisitOptionVisible;
                this.lLabSettingsEnum.labServicerRequired = result[0].labServicerRequired;
                this.lLabSettingsEnum.labServicesVisibile = result[0].labServicesVisibile;
                this.lLabSettingsEnum.labStaffMemberOptionVisible = result[0].labStaffMemberOptionVisible;
                this.lLabSettingsEnum.labStudentsCanChooseMultipleService = result[0].labStudentsCanChooseMultipleService;
                this.lLabSettingsEnum.labWaitWindowTime = result[0].labWaitWindowTime;
                this.lLabSettingsEnum.lapSearchPriority = result[0].lapSearchPriority;
                if (result[0].labServicesVisibile) {
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }
            }
        });
    }

    addLabSettingsPreferences(isSave?: any) {
        this.requestBody.id = this.lLabSettingsEnum.id;
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
            if (result) {
                alert('Record Saved Successfully !');
                if (isSave === 'SaveAndClose') {
                    window.location.assign('');
                }
            }
        });
    }
    cancelClick() {
        window.location.assign('');
    }
    setEnableDisable() {
        if (this.lLabSettingsEnum.labServicesVisibile) {
            this.isDisabled = true;
        } else {
            this.isDisabled = false;
        }
    }
}
