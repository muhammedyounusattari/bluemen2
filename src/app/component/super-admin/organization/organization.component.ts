import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { OrganizationsService } from 'src/app/services/super-admin/organizations.service';
import { UserNamesAndPasswordComponent } from 'src/app/component/admin/home/user-names-password/user-names-and-pwd.component';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.css'],
})

export class OrganizationComponent implements OnInit {

    formGroup: FormGroup;
    @ViewChild('organizationPopup') organizationPopupRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    };

    @ViewChild('userComponentPopup') userComponentPopupRef: TemplateRef<any>;
    userModalRef: BsModalRef;
    modalConfigXL = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    };
    selectedRow: any = '';
    isEdit: boolean = false;
    spinner: boolean = true;
    selectedRowIndex: any;
    isLoading: boolean = true;
    myElement: any = null;
    validationClass: ValidationClass = new ValidationClass();

    columnsToDisplay: string[] = ['orgId', 'orgName', 'orgCode', 'orgTwoFactor', 'orgDeviceAuth',
        'orgExpiryTime', 'orgActive', 'orgDaysToExpire', 'orgRemindOne', 'orgRemindTwo',
        'orgPurge', 'deleted', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }

    otherInfo: boolean = false;
    orgId: any;
    organizationList: any;
    organizationCode: any;
    isDisabledBtn: boolean = false;

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private organizationService: OrganizationsService) { }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Organization Information');
        this.createForm();
        this.myElement = window.document.getElementById('loading');
        this.getOrgList();
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
            'orgEmail': [''],
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

    getOrgList() {
        this.organizationService.getOrganizationsList().subscribe((result: any) => {
            this.hideLoader();
            if (result) {
                this.organizationList = result;
                result = result.filter((item: any) => item.orgActive);
                this.spinner = false;
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
            }
        });
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
    }

    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
        this.orgId = this.selectedRow.orgId;
        this.organizationCode = this.selectedRow.orgCode;
    }

    resetFields() {
        this.createForm();
        this.selectedRow = null;
        this.selectedRowIndex = null;
        this.isEdit = false;
        this.orgId = null;
        this.openModal(this.organizationPopupRef);
    }

    openModal(template: TemplateRef<any>, isUser?: boolean) {
        if (!isUser) {
            this.modalRef = this.modalService.show(template, this.modalConfigSM);
            this.hidePopupLoader();
        } else {
            this.userModalRef = this.modalService.show(template, this.modalConfigXL)
        }
    }

    hidePopupLoader() {
        const popupElement = window.document.getElementById('popupLoading');
        if (popupElement != null) {
            popupElement.style.display = 'none';
        }
    }

    showPopupLoader() {
        const popupElement = window.document.getElementById('popupLoading');
        if (popupElement != null) {
            popupElement.style.display = 'block';
        }
    }

    numericOnly(e: any): boolean {
        return e.keyCode === 8 && e.keyCode === 46
            ? true
            : !isNaN(Number(e.key));
    }

    imposeMinMax(el: any) {
        if (
            el.value != '' &&
            (el.value.length > parseInt(el.maxLength))
        ) {
            el.value = el.value.toString().slice(0, 2);
        }
    }

    addOrganization() {
        if (this.formGroup.valid) {
            this.isDisabledBtn = true;
            this.showPopupLoader();
            const request = this.requestPayload();
            this.organizationService.saveOrganization(request).subscribe(result => {
                this.isDisabledBtn = false;
                if (result) {
                    if (!this.orgId) {
                        this.orgId = JSON.parse(result).body;
                        this.organizationCode = this.formGroup?.get('orgCode')?.value;
                        this.hidePopupLoader();
                    } else {
                        this.showLoader();
                        this.getOrgList();
                        this.modalRef.hide();
                    }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

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

    openUserPopup() {
        this.openModal(this.userComponentPopupRef, true);
    }

    editSelectedOrg() {
        if (this.selectedRow) {
            this.formGroup.get('orgId')?.setValue(this.orgId);
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
            this.openModal(this.organizationPopupRef, false);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    deleteSelectedOrg() {
        if (this.selectedRow) {
            this.selectedRow.orgActive = false;
            this.showLoader();
            this.organizationService.saveOrganization(this.selectedRow).subscribe(result => {
                if (result) {
                    this.getOrgList();
                }
            });
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }
}