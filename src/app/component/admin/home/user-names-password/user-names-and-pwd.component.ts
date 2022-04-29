import { Component, TemplateRef, ViewChild, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { UserManagementService } from 'src/app/services/admin/user-management.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';

@Component({
    selector: 'app-user-names-password',
    templateUrl: './user-names-and-pwd.component.html',
    styleUrls: ['./user-names-and-pwd.component.css']
})

export class UserNamesAndPasswordComponent implements OnInit {
    formGroup: FormGroup;
    @ViewChild('userNamesAndPasswordPopup') userNamesAndPasswordPopupRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    }

    userBasicInfo = true;
    userAdvancedInfo = false;
    selectedRow: any = '';
    isEdit: boolean = false;
    spinner: boolean = true;
    selectedRowIndex: any;
    isLoading: boolean = true;
    myElement: any = null;
    roleList: any = [{ 'id': 'Admin', 'name': 'Admin(Default)' }, { 'id': 'Manager', 'name': 'Manager(Default)' }, { 'id': 'Counselor', 'name': 'Counselor(Default)' }];
    siteLocationList: any = [{ 'id': 1, 'name': 'Location1' }, { 'id': 2, 'name': 'Location2' }, { 'id': 2, 'name': 'Location3' }];
    cityList: any = [{ 'id': 1, 'name': 'Pune' }, { 'id': 2, 'name': 'Mumbai' }];
    stateList: any = [{ 'id': 1, 'name': 'Maharashtra' }, { 'id': 2, 'name': 'Delhi' }];

    validationClass: ValidationClass = new ValidationClass();

    columnsToDisplay: string[] = ['orgCode', 'username', 'firstName', 'lastName', 'email', 'roleName', 'siteLocation', 'active', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    emailVerified = false;
    userEnabled = false;
    userId = null;
    boltId = 0;
    userList = [];

    @Input() organizationId: any;
    @Input() organizationCode: any;
    orgId = null;
    isDisabled = false;
    organizationsList: any;
    selectedOrgId: any;
    user: any;
    isSuperAdmin: boolean = false;
    request:any;

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private _userManagementService: UserManagementService
        , private router: Router
        , private sharedService: SharedService
        , private pullDownService: PullDownListService) { }

    ngOnInit(): void {
        this.isSuperAdmin = false;
        this.user = sessionStorage.getItem('state');
        this.user = JSON.parse(this.user);
        if (this.user.roleName !== 'Super Admin' || this.organizationId) {
            this.getUserList();
            if (!this.organizationId) {
                this.sharedService.setPageTitle('User Information');
            }
        } else {
            this.isSuperAdmin = true;
            this.getOrganizationList();
        }
        this.createForm();
        this.myElement = window.document.getElementById('loading1');
        this.bindDropDownValues();
    }

    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
     bindDropDownValues() {
        let data: any = 'CITY, STATE, SITE LOCATION';
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            if (result?.CITY) {
                this.cityList = result.CITY;
            }
            if (result?.STATE) {
                this.stateList = result.STATE;
            }
            if (result?.SITELOCATION) {
                this.siteLocationList = result.SITELOCATION;
            }
        });
        this._userManagementService.getRoleNamesList().subscribe(result => {
            if (result) {
                this.roleList = result;
            }
        });
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [null],
            'username': ['', Validators.required],
            'email': ['', Validators.required],
            'mobile': ['', Validators.required],
            'roleName': ['', Validators.required],
            'siteLocation': [''],
            'firstName': [''],
            'lastName': [''],
            'active': [true],
            'address1': [''],
            'sendMail': [false],
            'address2': [''],
            'city': [''],
            'state': [''],
            'phone2': [''],
            'zipcode': [''],
            'fax': [''],
            'notes': [''],
            'botLink': [''],
            'startDate': [''],
            'boltActive': [false],
            'endDate': [''],
            'link': [''],
            'lastGenerated': [''],
            'orgId': [''],
            'emailVerified': [false],
            'enabled': [false]
        });
    }

    getUserList() {
        if (this.isSuperAdmin) {
            this.orgId = this.selectedOrgId;
        } else {
            this.orgId = this.organizationId ? this.organizationId : this.user.orgId;
        }
        this._userManagementService.getUserList(this.orgId).subscribe(result => {
            setTimeout(() => {
                this.hideLoader();
            }, 500);
            this.isLoading = false;
            if (result) {
                // const userList = result.users.filter((item: any) => { item.active === true; });
                this.dataSource = new MatTableDataSource(result.users);
                this.userList = result.users;
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
            }
        });
    }

    getOrganizationList() {
        this._userManagementService.getOrganizationsList().subscribe(result => {
            if (result) {
                this.hideLoader();
                this.organizationsList = result;
                this.selectedOrgId = result[0].orgId;
                this.populateUserList();
            }
        });
    }

    populateUserList() {
        const result = this.organizationsList.filter((item: any) => item.orgId === Number(this.selectedOrgId));
        if (result[0].users) {
            // const userList = result[0].users.filter((item: any) => { item.active === true; });
            this.dataSource = new MatTableDataSource(result[0].users);
            this.userList = result[0].users;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        this.selectedRowIndex = null;
        this.orgId = this.selectedOrgId;
        this.organizationCode = result[0].orgCode;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
        this.orgId = this.selectedRow.orgId;
    }

    hideLoader() {
        this.myElement = window.document.getElementById('loading1');
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

    resetFields() {
        this.createForm();
        this.selectedRow = null;
        this.selectedRowIndex = null;
        this.isEdit = false;
        this.openModal(this.userNamesAndPasswordPopupRef);
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

    createUser() {
        if (this.formGroup.valid) {
            this.isDisabled = true;
            const request = this.getRequestPayload();
            this._userManagementService.createUser(request).subscribe(result => {
                if (result) {
                    this.isDisabled = false;
                    this.getUserList();
                    this.toastr.success('Saved successfully !', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.modalRef.hide();
                }
            }, (error: any) => {
                if (error) {
                    const errorResponse = JSON.parse(error);
                    this.toastr.error(errorResponse.message, '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                }
                this.modalRef.hide();
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.formGroup.get('username')?.setValue(this.selectedRow.username);
            this.formGroup.get('siteLocation')?.setValue(this.selectedRow.siteLocation);
            this.formGroup.get('firstName')?.setValue(this.selectedRow.firstName);
            this.formGroup.get('lastName')?.setValue(this.selectedRow.lastName);
            this.formGroup.get('roleName')?.setValue(this.selectedRow.roleName);
            this.formGroup.get('email')?.setValue(this.selectedRow.email);
            this.formGroup.get('mobile')?.setValue(this.selectedRow.mobile);
            this.formGroup.get('phone2')?.setValue(this.selectedRow.phone2);
            this.formGroup.get('active')?.setValue(true);
            this.formGroup.get('sendMail')?.setValue(this.selectedRow.sendMail);
            this.formGroup.get('city')?.setValue(this.selectedRow.city);
            this.formGroup.get('state')?.setValue(this.selectedRow.state);
            this.formGroup.get('zipcode')?.setValue(this.selectedRow.zipcode);
            this.formGroup.get('fax')?.setValue(this.selectedRow.fax);
            this.formGroup.get('address1')?.setValue(this.selectedRow.address1);
            this.formGroup.get('address2')?.setValue(this.selectedRow.address2);
            this.formGroup.get('notes')?.setValue(this.selectedRow.notes);
            this.formGroup.get('link')?.setValue(this.selectedRow?.bolt?.link);
            this.formGroup.get('startDate')?.setValue(this.selectedRow?.bolt?.startDate);
            this.formGroup.get('endDate')?.setValue(this.selectedRow?.bolt?.endDate);
            this.formGroup.get('boltActive')?.setValue(this.selectedRow?.bolt?.active);
            this.formGroup.get('lastGenerated')?.setValue(this.selectedRow?.bolt?.lastGenerated);
            this.openModal(this.userNamesAndPasswordPopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    removeUser() {
        if (this.selectedRow) {
            this.showLoader();
            this.selectedRow.active = false;
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm remove record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.username
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._userManagementService.updateUser(this.selectedRow).subscribe(res => {
                        if (res) {
                            this.getUserList();
                            this.toastr.success('Deleted successfully !', '', {
                                timeOut: 5000,
                                closeButton: true
                            });
                        }
                    }, (error: any) => {
                        const errorResponse = JSON.parse(error);
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    updateUser() {
        if (this.formGroup.valid) {
            this.isDisabled = true;
            this.request = this.getRequestPayload();
            this.request.id = this.selectedRow.id;
            this._userManagementService.updateUser(this.request).subscribe(result => {
                if (result) {
                    this.isDisabled = false;
                    this.getUserList();
                    this.toastr.success('Updated successfully !', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.modalRef.hide();
                }
            }, (error: any) => {
                if (error) {
                    const errorResponse = JSON.parse(error);
                    this.toastr.error(errorResponse.message, '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                }
                this.modalRef.hide();
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    getRequestPayload() {
        const payload = {
            'active': this.formGroup?.get('active')?.value,
            'address1': this.formGroup?.get('address1')?.value,
            'address2': this.formGroup?.get('address2')?.value,
            // 'bolt': {
            //     'boltActive': this.formGroup?.get('boltActive')?.value,
            //     'startDate': this.formGroup?.get('startDate')?.value,
            //     'endDate': this.formGroup?.get('endDate')?.value,
            //     'id': this.boltId,
            //     'lastGenerated': this.formGroup?.get('lastGenerated')?.value,
            //     'link': this.formGroup?.get('link')?.value
            // },
            'bolt': null,
            'city': this.formGroup?.get('city')?.value,
            'email': this.formGroup?.get('email')?.value,
            'emailVerified': this.emailVerified,
            'enabled': this.userEnabled,
            'fax': this.formGroup?.get('fax')?.value,
            'firstName': this.formGroup?.get('firstName')?.value,
            'lastName': this.formGroup?.get('lastName')?.value,
            'mobile': this.formGroup?.get('mobile')?.value,
            'notes': this.formGroup?.get('notes')?.value,
            'orgId': Number(this.orgId),
            'orgCode': this.organizationCode,
            'phone2': this.formGroup?.get('phone2')?.value,
            'roleName': this.formGroup?.get('roleName')?.value,
            'sendMail': this.formGroup?.get('sendMail')?.value,
            'siteLocation': this.formGroup?.get('siteLocation')?.value,
            'state': this.formGroup?.get('state')?.value,
            'username': this.formGroup?.get('username')?.value,
            'zipcode': this.formGroup?.get('zipcode')?.value
        }
        return payload;
    }

    resetPassword(test: any) {
        this._userManagementService.resetPassword(test.email,test.orgCode).subscribe(result => {
            alert("Reset password link is sent");
        });
    }

    navigateToBackScreen() {
        this.router.navigate(['admin/home']);
    }
}
