import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LabSettingsEnum } from '../../../../constants/enums/lab-settings.enum';
import { LabSettingsPreferencesService } from '../../../../services/admin/lab-settings.preferences.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'lab-settings',
    templateUrl: './lab-settings-preferences.component.html',
    styleUrls: ['./lab-settings-preferences.css']
})

export class LabSettingsPreferencesComponent implements OnInit {
    formGroup: FormGroup;
    validationClass: ValidationClass = new ValidationClass();
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
        { 'name': 'Student ID, Scan ID, System Serial Number' },
        { 'name': 'Student ID, System Serial Number, Scan ID' },
        { 'name': 'Scan ID, Student ID, System Serial Number' },
        { 'name': 'Scan ID, System Serial Number, Student ID' },
        { 'name': 'System Serial Number, Student ID, Scan ID' },
        { 'name': 'System Serial Number, Scan ID, Student ID' }
    ];
    labComponentsList = [
        { 'name': 'Academic' },
        { 'name': 'Both' },
        { 'name': 'Not Applicable' },
        { 'name': 'Summer' }
    ];
    myElement: any = null;
    constructor(private modalService: BsModalService
        , private router: Router
        , private _labSettingsPreferencesService: LabSettingsPreferencesService
        , private formBuilder: FormBuilder
        , private toastr: ToastrService) { }

    ngOnInit(): void {
        this.createForm();
        this.myElement = window.document.getElementById('loading');
        this._labSettingsPreferencesService.getLabSettingsPreferencesData().subscribe(result => {
            if (result) {
                this.lLabSettingsEnum.id = result[0].id;
                this.formGroup.get('labAcknowledgement')?.setValue(result[0].labAcknowledgement);
                this.formGroup.get('labAutomaticallyCheckInCheckOut')?.setValue(result[0].labAutomaticallyCheckInCheckOut);
                this.formGroup.get('labComponents')?.setValue(result[0].labComponents);
                this.formGroup.get('labDefaultService')?.setValue(result[0].labDefaultService);
                this.formGroup.get('labFiscalYear')?.setValue(result[0].labFiscalYear);
                this.formGroup.get('labForcedTimeSpent')?.setValue(result[0].labForcedTimeSpent);
                this.formGroup.get('labHideCheckOutList')?.setValue(result[0].labHideCheckOutList);
                this.formGroup.get('labHideStudentList')?.setValue(result[0].labHideStudentList);
                this.formGroup.get('labMaxCheckoutTime')?.setValue(result[0].labMaxCheckoutTime);
                this.formGroup.get('labReasonForVisitOptionVisible')?.setValue(result[0].labReasonForVisitOptionVisible);
                this.formGroup.get('labServicerRequired')?.setValue(result[0].labServicerRequired);
                this.formGroup.get('labServicesVisibile')?.setValue(result[0].labServicesVisibile);
                this.formGroup.get('labStaffMemberOptionVisible')?.setValue(result[0].labStaffMemberOptionVisible);
                this.formGroup.get('labStudentsCanChooseMultipleService')?.setValue(result[0].labStudentsCanChooseMultipleService);
                this.formGroup.get('labWaitWindowTime')?.setValue(result[0].labWaitWindowTime);
                this.formGroup.get('lapSearchPriority')?.setValue(result[0].lapSearchPriority);

                if (result[0].labServicesVisibile) {
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }
                this.hideLoader();
            }
        });
    }
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.myElement.style.display = 'none';
        }
    }

    showLoader() {
        if (this.myElement !== null) {
            this.myElement.style.display = 'block';
        }
    }
    createForm() {
        this.formGroup = this.formBuilder.group({
            'lapSearchPriority': ['', Validators.required],
            'labComponents': ['', Validators.required],
            'labFiscalYear': ['', Validators.required],
            'labWaitWindowTime': ['', Validators.required],
            'labHideStudentList': [''],
            'labHideCheckOutList': [''],
            'labMaxCheckoutTime': [''],
            'labForcedTimeSpent': [''],
            'labAutomaticallyCheckInCheckOut': [''],
            'labServicesVisibile': [''],
            'labServicerRequired': [''],
            'defLabServices': [''],
            'labStudentsCanChooseMultipleService': [''],
            'labReasonForVisitOptionVisible': [''],
            'labStaffMemberOptionVisible': [''],
            'labAcknowledgement': [''],
            'labDefaultService': ['']
        });
    }

    addLabSettingsPreferences(isSave?: any) {
        if (this.formGroup.valid) {
            this.showLoader();
            this.requestBody.id = this.lLabSettingsEnum.id;
            this.requestBody.labAcknowledgement = this.formGroup?.get('labAcknowledgement')?.value;
            this.requestBody.labAutomaticallyCheckInCheckOut = this.formGroup?.get('labAutomaticallyCheckInCheckOut')?.value;;
            this.requestBody.labComponents = this.formGroup?.get('labComponents')?.value;
            this.requestBody.labDefaultService = this.formGroup?.get('labDefaultService')?.value;
            this.requestBody.labFiscalYear = this.formGroup?.get('labFiscalYear')?.value;
            this.requestBody.labForcedTimeSpent = this.formGroup?.get('labForcedTimeSpent')?.value;
            this.requestBody.labHideCheckOutList = this.formGroup?.get('labHideCheckOutList')?.value;
            this.requestBody.labHideStudentList = this.formGroup?.get('labHideStudentList')?.value;
            this.requestBody.labMaxCheckoutTime = this.formGroup?.get('labMaxCheckoutTime')?.value;
            this.requestBody.labReasonForVisitOptionVisible = this.formGroup?.get('labReasonForVisitOptionVisible')?.value;
            this.requestBody.labServicerRequired = this.formGroup?.get('labServicerRequired')?.value;
            this.requestBody.labServicesVisibile = this.formGroup?.get('labServicesVisibile')?.value;
            this.requestBody.labStaffMemberOptionVisible = this.formGroup?.get('labStaffMemberOptionVisible')?.value;
            this.requestBody.labStudentsCanChooseMultipleService = this.formGroup?.get('labStudentsCanChooseMultipleService')?.value;
            this.requestBody.labWaitWindowTime = this.formGroup?.get('labWaitWindowTime')?.value;
            this.requestBody.lapSearchPriority = this.formGroup?.get('lapSearchPriority')?.value;

            this._labSettingsPreferencesService.postLabSettingsPreferences(this.requestBody).subscribe(result => {
                if (result) {
                    this.hideLoader();
                    this.toastr.success('Configured successfully !', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    if (isSave === 'SaveAndClose') {
                        window.location.assign('');
                    }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }
    cancelClick() {
        window.location.assign('');
    }
    setEnableDisable() {
        if (this.formGroup?.get('labServicesVisibile')?.value) {
            this.isDisabled = true;
        } else {
            this.isDisabled = false;
        }
    }
}
