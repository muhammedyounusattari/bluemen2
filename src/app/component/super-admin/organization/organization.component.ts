import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { OrganizationsService } from 'src/app/services/super-admin/organizations.service';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.css'],
})

export class OrganizationComponent implements OnInit {

    formGroup: FormGroup;
    searchFormGroup: FormGroup;
    selectedRow: any = '';
    isEdit: boolean = false;
    selectedRowIndex: any;
    myElement: any = null;
    validationClass: ValidationClass = new ValidationClass();
    public dataLoading: boolean = false;

    otherInfo: boolean = false;
    orgId: any;
    organizationList: any;
    organizationCode: any;
    isDisabledBtn: boolean = false;

    siteLocationList: any = [];
    cityList: any = [];
    stateList: any = [];
    //organizationTypeList: any = [];
    activeList: any = [{ 'longpullna': 'Yes' }, { 'longpullna': 'No' }];
    purgeList: any = [{ 'longpullna': 'Yes' }, { 'longpullna': 'No' }];
    //programTypeList: any = [];
    deletedList: any = [{ 'longpullna': 'Yes' }, { 'longpullna': 'No' }];
    panels = [
        {
            active: false,
            name: 'Other Information',
            disabled: false
        }
    ];
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    public organizationModalVisible: boolean = false;
    public organizationModalHeader: string = 'Organization Information';
    public isConfirmOrgnizationLoading: boolean = false;
    organizationSearchList: any = [];
    organizationActiveDeActiveList: any = [];

    programTypeList: any = [{ 'longpullna': 'TS' }, { 'longpullna': 'EOC' }, { 'longpullna': 'UB' }, { 'longpullna': 'VUB' }, { 'longpullna': 'UBMS' }, { 'longpullna': 'SSS' }, { 'longpullna': 'MCN' }];
    organizationTypeList: any = [{ 'longpullna': 'Live Customer Data' }, { 'longpullna': 'Customer Demo' }, { 'longpullna': 'Tech Support Demo' }, { 'longpullna': 'Dev Team Demo' }, { 'longpullna': 'Testing Scenario Demo' }];

    userModalVisible: boolean = false;
    userModalHeader = 'User Information';

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private notificationService: NotificationUtilities
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private organizationService: OrganizationsService
        , private pullDownService: PullDownListService) { }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Organization Information');
        this.createForm();
        this.createSearchForm();
        this.myElement = window.document.getElementById('loading');
        this.getOrgList();
        this.bindDropDownValues();

    }

    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
    bindDropDownValues() {
        let data: any = 'CITY,STATE, ORGANIZATIONTYPE, PROGRAMTYPE';
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            if (result?.CITY) {
                this.cityList = result?.CITY;
            }
            if (result?.STATE) {
                this.stateList = result?.STATE;
            }
            // if (result?.ORGANIZATIONTYPE) {
            //     this.organizationTypeList = result?.ORGANIZATIONTYPE;
            // }
            // if (result?.PROGRAMTYPE) {
            //     this.programTypeList = result?.PROGRAMTYPE;
            // }
        });
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'orgId': [0],
            'orgName': ['', Validators.required],
            'orgCode': ['', Validators.required],
            'orgProgramType': ['', Validators.required],
            'orgOrganizationType': ['', Validators.required],
            'orgDescription': [''],
            'orgBulkTemplate': [''],
            'orgAddress1': [''],
            'orgAddress2': [''],
            'orgCity': [''],
            'orgState': [''],
            'orgZipCode': [''],
            'orgPhoneOne': [''],
            'orgPhoneTwo': [''],
            'orgPhoneThree': [''],
            'orgFax': [''],
            'mailServer': [''],
            'orgWebSite': [''],
            'orgEmail': ['', [Validators.pattern(this.emailPattern)]],
            'orgUserName': [''],
            'orgDirector': [''],
            'orgTwoFactor': [false],
            'orgDeviceAuth': [false],
            'orgSendMail': [false],
            'orgSiteLocation': [false],
            'orgScript': [false],
            'orgTrioBlumenLab': [false],
            'orgActive': [true],
            'orgPurge': [false],
            'orgExpiryTime': [''],
            'orgDaysToExpire': [''],
            'orgRemindOne': [''],
            'orgRemindTwo': [''],
            'orgGoodTill': [''],
            'orgNotes': [''],
            'users': []
        });
    }

    /**
    * @method createSearchForm
    * @description initialize serching fileds
    */
    createSearchForm() {
        this.searchFormGroup = this.formBuilder.group({
            'formLayout': ['vertical'],
            'organizationType': [''],
            'name': [''],
            'code': [''],
            'active': [''],
            'purge': [''],
            'city': [''],
            'state': [''],
            'programType': [''],
            'deleted': ['']
        });
    }

    /**
     * @method getOrgList
     * @description Get the org list
     */
    getOrgList() {
        this.dataLoading = true;
        this.organizationService.getOrganizationsList().subscribe((result: any) => {
            this.hideLoader();
            if (result) {
                this.organizationActiveDeActiveList = result;
                // result = result.filter((item: any) => item.orgActive);
                this.organizationList = result;
                this.organizationSearchList = result;
                this.selectedRowIndex = null;
            }
        });
    }

    /**
     * @method applyFilter
     * @description apply the content search from list
     */
    applyFilter(filterValue: any) {
        const targetValue: any[] = [];
        this.organizationSearchList.forEach((value: any) => {
            let keys = ["orgId", "orgName", "orgCode", "orgTwoFactor", "orgDeviceAuth", "orgExpiryTime", "orgActive", "orgDaysToExpire", "orgRemindOne", "orgRemindTwo", "orgPurge", "deleted"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(filterValue)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.organizationList = targetValue;
    }

    /**
    * @method hideLoader
    * @description hide the popup on list
    */
    hideLoader() {
        this.dataLoading = false;
    }

    /**
    * @method showLoader
    * @description show the popup on list
    */
    showLoader() {
        this.dataLoading = true;
    }

    /**
    * @method setSelectedRow
    * @description set the selected fields
    */
    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
        this.orgId = this.selectedRow.orgId;
        this.organizationCode = this.selectedRow.orgCode;
    }

    /**
    * @method resetFields
    * @description reset all fields
    */
    resetFields() {
        this.createForm();
        this.selectedRow = null;
        this.selectedRowIndex = null;
        this.isEdit = false;
        this.orgId = null;
        this.organizationModalVisible = true;
    }

    /**
    * @method hidePopupLoader
    * @description hide the loader on list
    */
    hidePopupLoader() {
        this.dataLoading = false;
    }

    /**
    * @method showPopupLoader
    * @description show the loader on list
    */
    showPopupLoader() {
        this.dataLoading = true;
    }

    /**
    * @method numericOnly
    * @description
    */
    numericOnly(e: any): boolean {
        return e.keyCode === 8 && e.keyCode === 46
            ? true
            : !isNaN(Number(e.key));
    }

    /**
    * @method imposeMinMax
    * @description
    */
    imposeMinMax(el: any) {
        if (
            el.value != '' &&
            (el.value.length > parseInt(el.maxLength))
        ) {
            el.value = el.value.toString().slice(0, 2);
        }
    }

    /**
    * @method addOrganization
    * @description add the organization
    */
    addOrganization() {
        if (this.formGroup.valid) {
            this.isDisabledBtn = true;
            this.showPopupLoader();
            const request = this.requestPayload();
            this.organizationService.saveOrganization(request).subscribe(result => {
                this.isDisabledBtn = false;
                if (result) {
                    this.orgId = JSON.parse(result).body;
                    this.organizationCode = this.formGroup?.get('orgCode')?.value;
                    this.hidePopupLoader();
                    this.notificationService.createNotificationBasic('success', 'success', 'Organization created successfully.');
                    this.getOrgList();
                }
            });
        } else {
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    /**
    * @method requestPayload
    * @description add the add in this payload
    */
    public requestPayload() {
        return {
            mailServer: this.formGroup?.get('mailServer')?.value,
            orgActive: this.formGroup?.get('orgActive')?.value,
            orgAddress1: this.formGroup?.get('orgAddress1')?.value,
            orgAddress2: this.formGroup?.get('orgAddress2')?.value,
            orgBulkTemplate: this.formGroup?.get('orgBulkTemplate')?.value,
            orgCity: this.formGroup?.get('orgCity')?.value,
            orgCode: this.formGroup?.get('orgCode')?.value,
            orgDaysToExpire: this.formGroup?.get('orgDaysToExpire')?.value,
            orgDescription: this.formGroup?.get('orgDescription')?.value,
            orgDeviceAuth: this.formGroup?.get('orgDeviceAuth')?.value,
            orgDirector: this.formGroup?.get('orgDirector')?.value,
            orgEmail: this.formGroup?.get('orgEmail')?.value,
            orgExpiryTime: this.formGroup?.get('orgExpiryTime')?.value,
            orgFax: this.formGroup?.get('orgFax')?.value,
            orgGoodTill: this.formGroup?.get('orgGoodTill')?.value,
            orgName: this.formGroup?.get('orgName')?.value,
            orgId: this.orgId,
            orgNotes: this.formGroup?.get('orgNotes')?.value,
            orgOrganizationType: this.formGroup?.get('orgOrganizationType')?.value,
            orgPhoneOne: this.formGroup?.get('orgPhoneOne')?.value,
            orgPhoneThree: this.formGroup?.get('orgPhoneThree')?.value,
            orgPhoneTwo: this.formGroup?.get('orgPhoneTwo')?.value,
            orgProgramType: this.formGroup?.get('orgProgramType')?.value,
            orgPurge: this.formGroup?.get('orgPurge')?.value,
            orgRemindOne: this.formGroup?.get('orgRemindOne')?.value,
            orgRemindTwo: this.formGroup?.get('orgRemindTwo')?.value,
            orgScript: this.formGroup?.get('orgScript')?.value,
            orgSendMail: this.formGroup?.get('orgSendMail')?.value,
            orgSiteLocation: this.formGroup?.get('orgSiteLocation')?.value,
            orgState: this.formGroup?.get('orgState')?.value,
            orgTrioBlumenLab: this.formGroup?.get('orgTrioBlumenLab')?.value,
            orgTwoFactor: this.formGroup?.get('orgTwoFactor')?.value,
            orgUserName: this.formGroup?.get('orgUserName')?.value,
            orgWebSite: this.formGroup?.get('orgWebSite')?.value,
            orgZipCode: this.formGroup?.get('orgZipCode')?.value,
            users: []
        };
    }

    /**
    * @method openUserPopup
    * @description show the user popup for the add organization
    */
    openUserPopup() {
        this.userModalVisible = true;
    }

    /**
    * @method editSelectedOrg
    * @description show the edit popup for the organization update
    */
    editSelectedOrg(selectedRowItem: any, index: any) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
        if (this.selectedRow) {
            this.orgId = this.selectedRow.orgId;
            this.isEdit = true;
            this.formGroup.get('orgId')?.setValue(this.selectedRow.orgId);
            this.formGroup.get('orgName')?.setValue(this.selectedRow.orgName);
            this.formGroup.get('mailServer')?.setValue(this.selectedRow.mailServer);
            this.formGroup.get('orgActive')?.setValue(this.selectedRow.orgActive);
            this.formGroup.get('orgAddress1')?.setValue(this.selectedRow.orgAddress1);
            this.formGroup.get('orgAddress2')?.setValue(this.selectedRow.orgAddress2);
            this.formGroup.get('orgBulkTemplate')?.setValue(this.selectedRow.orgBulkTemplate);
            this.formGroup.get('orgCity')?.setValue(this.selectedRow.orgCity);
            this.formGroup.get('orgCode')?.setValue(this.selectedRow.orgCode);
            this.formGroup.get('orgDaysToExpire')?.setValue(this.selectedRow.orgDaysToExpire);
            this.formGroup.get('orgDescription')?.setValue(this.selectedRow.orgDescription);
            this.formGroup.get('orgDeviceAuth')?.setValue(this.selectedRow.orgDeviceAuth);
            this.formGroup.get('orgDirector')?.setValue(this.selectedRow.orgDirector);
            this.formGroup.get('orgEmail')?.setValue(this.selectedRow.orgEmail);
            this.formGroup.get('orgExpiryTime')?.setValue(this.selectedRow.orgExpiryTime);
            this.formGroup.get('orgFax')?.setValue(this.selectedRow.orgFax);
            this.formGroup.get('orgGoodTill')?.setValue(this.selectedRow.orgGoodTill);
            this.formGroup.get('orgName')?.setValue(this.selectedRow.orgName);
            this.formGroup.get('orgNotes')?.setValue(this.selectedRow.orgNotes);
            this.formGroup.get('orgOrganizationType')?.setValue(this.selectedRow.orgOrganizationType);
            this.formGroup.get('orgPhoneOne')?.setValue(this.selectedRow.orgPhoneOne);
            this.formGroup.get('orgPhoneTwo')?.setValue(this.selectedRow.orgPhoneTwo);
            this.formGroup.get('orgPhoneThree')?.setValue(this.selectedRow.orgPhoneThree);
            this.formGroup.get('orgProgramType')?.setValue(this.selectedRow.orgProgramType);
            this.formGroup.get('orgPurge')?.setValue(this.selectedRow.orgPurge);
            this.formGroup.get('orgRemindOne')?.setValue(this.selectedRow.orgRemindOne);
            this.formGroup.get('orgRemindTwo')?.setValue(this.selectedRow.orgRemindTwo);
            this.formGroup.get('orgScript')?.setValue(this.selectedRow.orgScript);
            this.formGroup.get('orgSendMail')?.setValue(this.selectedRow.orgSendMail);
            this.formGroup.get('orgSiteLocation')?.setValue(this.selectedRow.orgSiteLocation);
            this.formGroup.get('orgState')?.setValue(this.selectedRow.orgState);
            this.formGroup.get('orgTrioBlumenLab')?.setValue(this.selectedRow.orgTrioBlumenLab);
            this.formGroup.get('orgTwoFactor')?.setValue(this.selectedRow.orgTwoFactor);
            this.formGroup.get('orgUserName')?.setValue(this.selectedRow.orgUserName);
            this.formGroup.get('orgWebSite')?.setValue(this.selectedRow.orgWebSite);
            this.formGroup.get('orgZipCode')?.setValue(this.selectedRow.orgZipCode);
            this.organizationModalVisible = true;
        } else {
            this.notificationService.createNotificationBasic('info', 'info', 'Please select a row to update');
        }
    }

    /**
    * @method deleteSelectedOrg
    * @description this method is used for deletd the selected organization
    */
    deleteSelectedOrg(selectedRowItem: any, index: any) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
        if (this.selectedRow) {
            this.selectedRow.orgActive = false;
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm remove record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.orgName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.organizationService.updateOrganization(this.selectedRow).subscribe(result => {
                        if (result) {
                            this.notificationService.createNotificationBasic('success', 'success', 'Deleted successfully.');
                            this.getOrgList();
                            this.hideLoader();
                        }
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.notificationService.createNotificationBasic('info', 'info', 'Please select a row to delete.');
        }
    }

    /**
    * @method updateOrganization
    * @description this method is used for update the organization
    */
    updateOrganization() {
        if (this.selectedRow) {
            this.isConfirmOrgnizationLoading = true;
            this.showLoader();
            const request = this.requestPayload();
            request.orgId = this.selectedRow.orgId;
            this.organizationService.updateOrganization(request).subscribe(result => {
                this.isConfirmOrgnizationLoading = false;
                if (result) {
                    this.notificationService.createNotificationBasic('success', 'success', 'Updated successfully.');
                    this.getOrgList();
                    this.organizationModalVisible = false;
                    //this.modalRef.hide();
                }
            });
        } else {
            this.notificationService.createNotificationBasic('info', 'info', 'Please select a row to delete.');
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    /**
    * @method updateOrganizationAfterSave
    * @description this method is used for update the organization after first time save
    */
    updateOrganizationAfterSave() {
        let name = this.formGroup.get('orgName')?.value;
        let orgCode = this.formGroup.get('orgCode')?.value;
        let orgProgramType = this.formGroup.get('orgProgramType')?.value;
        let orgOrganizationType = this.formGroup.get('orgOrganizationType')?.value;
        if (name && orgCode && orgProgramType) {
            this.isConfirmOrgnizationLoading = true;
            this.showLoader();
            const request = this.requestPayload();
            request.orgId = this.orgId;
            this.organizationService.updateOrganization(request).subscribe(result => {
                this.isConfirmOrgnizationLoading = false;
                if (result) {
                    this.notificationService.createNotificationBasic('success', 'success', 'Updated successfully.');
                    this.getOrgList();
                    this.organizationModalVisible = false;
                    //this.modalRef.hide();
                }
            });
        } else {
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    /**
    * @method handleCancel
    * @description this method is used for hide the pop
    */
    handleCancel(): void {
        this.organizationModalVisible = false;

    }

    /**
    * @method checkOrgCode
    * @description verifying org code already exist or not.
    */
    checkOrgCode(event: any) {
        if (!this.validationClass.isNullOrUndefined(event)) {
            let checkOrgCode = this.formGroup?.get('orgCode')?.value;
            if (checkOrgCode) {
                const data = this.organizationActiveDeActiveList.filter((item: any) => item && (item.orgCode.trim().toLowerCase() === checkOrgCode.trim().toLowerCase()) && (item.orgId === this.orgId));
                if (data && data.length > 0) {
                    return;
                } else {
                    const data = this.organizationActiveDeActiveList.filter((item: any) => item && item.orgCode.trim().toLowerCase() === checkOrgCode.trim().toLowerCase());
                    if (data && data.length > 0) {
                        this.notificationService.createNotificationBasic('info', "info", 'Oragnization code is already exist!');
                        this.formGroup.get('orgCode')?.setValue('');
                    }
                }
            }
        }
    }

    /**
    * @method checkOrgCode
    * @description verifying org code already exist or not.
    */
    checkOrgName(event: any) {
        if (!this.validationClass.isNullOrUndefined(event)) {
            let checkName = this.formGroup?.get('orgName')?.value;
            if (checkName) {
                const data = this.organizationActiveDeActiveList.filter((item: any) => item && (item.orgName.trim().toLowerCase() === checkName.trim().toLowerCase()) && (item.orgId === this.orgId));
                if (data && data.length > 0) {
                    return;
                } else {
                    const data = this.organizationActiveDeActiveList.filter((item: any) => item && item.orgName.trim().toLowerCase() === checkName.trim().toLowerCase());
                    if (data && data.length > 0) {
                        this.notificationService.createNotificationBasic('info', "info", 'Oragnization name is already exist!');
                        this.formGroup.get('orgName')?.setValue('');
                    }
                }
            }
        }
    }


    /**
    * @method searchOragization
    * @description this method is used for filter the data from organization list
    */
    searchOragization() {
        let organizationType = this.searchFormGroup.get('organizationType')?.value;
        let name = this.searchFormGroup.get('name')?.value;
        let code = this.searchFormGroup.get('code')?.value;
        let active = this.searchFormGroup.get('active')?.value;
        let purge = this.searchFormGroup.get('purge')?.value;
        let city = this.searchFormGroup.get('city')?.value;
        let state = this.searchFormGroup.get('state')?.value;
        let programType = this.searchFormGroup.get('programType')?.value;
        let deleted = this.searchFormGroup.get('deleted')?.value;
        let list = this.organizationSearchList;
        let list1: any = [];
        if (list && list.length > 0) {
            if (organizationType || name || code || active || purge || city || state || programType || deleted) {
                list1 = list.filter((item: any) => {
                    let query: any = 'true';
                    if (organizationType) {
                        query = (query && organizationType && item.orgOrganizationType.trim().toLowerCase() == organizationType.trim().toLowerCase());
                    }
                    if (name) {
                        query = (query && name && item.orgName.trim().toLowerCase() == name.trim().toLowerCase());
                    }
                    if (code) {
                        query = (query && code && item.orgCode.trim().toLowerCase() == code.trim().toLowerCase());
                    }
                    if (active) {
                        let activeVal = false;
                        if (active == 'Yes') {
                            activeVal = true;
                        } else {
                            activeVal = false;
                        }
                        query = (query && active && item.orgActive == activeVal);
                    }
                    if (purge) {
                        let purgeVal = false;
                        if (purge == 'Yes') {
                            purgeVal = true;
                        } else {
                            purgeVal = false;
                        }
                        query = (query && purge && item.orgPurge == purgeVal);
                    }
                    if (city) {
                        query = (query && city && item.orgCity.trim().toLowerCase() == city.trim().toLowerCase());
                    }
                    if (state) {
                        query = (query && state && item.orgState.trim().toLowerCase() == state.trim().toLowerCase());
                    }
                    if (programType) {
                        query = (query && programType && item.orgProgramType.trim().toLowerCase() == programType.trim().toLowerCase());
                    }
                    if (deleted) {
                        let deletedVal = false;
                        if (deleted == 'Yes') {
                            deletedVal = true;
                        } else {
                            deletedVal = false;
                        }
                        query = (query && deleted && item.deleted == deletedVal);
                    }

                    return query;
                })
                this.organizationList = list1;
            } else {
                this.organizationList = this.organizationSearchList;
            }
            return this.organizationList;
        } else {
            return this.organizationList;
        }


    }

    /**
     * @method print
     * @description this method is used for print the organization list
     */
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['orgId', 'Organization Name', 'Code', 'Two Factor', 'Device Auth', 'Expiry Time', 'Active', 'Days To Expire'
            , 'Remind One', 'Remind Two', 'Purge', 'Deleted']]
        let data: any = [];
        this.organizationList.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.orgId);
            tempObj.push(e.orgName);
            tempObj.push(e.orgCode);
            tempObj.push(e.orgExpiryTime);
            tempObj.push(e.orgDaysToExpire);
            tempObj.push(e.orgRemindOne);
            tempObj.push(e.orgRemindTwo);

            if (e.orgTwoFactor == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }

            if (e.orgDeviceAuth == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }

            if (e.deleted == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }

            if (e.orgPurge == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }

            if (e.orgActive == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }

            data.push(tempObj);
        });
        autoTable(doc, {
            head: head,
            body: data,
            theme: "grid",
            showHead: "everyPage",
            margin: { left: 20, right: 20, top: 30, bottom: 40 },
            startY: 25,
            headStyles: {
                fillColor: [0, 57, 107]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            tableLineColor: [208, 208, 208],
            tableLineWidth: 0.1,
            //styles : { halign : 'center'},
            bodyStyles: {
                fontSize: 12
            },
            styles: {
                cellPadding: 3
            },
            didDrawPage: function (data) {

                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                //doc.text("Compansol TRIO College Listing", data.settings.margin.left, 10);
                doc.text("Compansol TRIO Organization Listing", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "Organization"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'standingGroup.pdf' });
        //doc.save('college.pdf');  
    }
    //Print Function End

    /**
     * @method sorting
     * @description this method is used for asc sorting
     */
    sorting(attr: string) {
        if (this.organizationList.length > 0) {
            this.organizationList = [...this.organizationList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
    * @method sorting
    * @description this method is used for desc sorting
    */
    sorting2(attr: string) {
        if (this.organizationList.length > 0) {
            this.organizationList = [...this.organizationList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
    
    handleUserCancel() {
        this.userModalVisible = false;
    }
}