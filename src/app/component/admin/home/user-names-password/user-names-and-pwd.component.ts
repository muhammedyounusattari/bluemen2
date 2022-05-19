import { Component, TemplateRef, ViewChild, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from "ng-zorro-antd/modal";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-user-names-password',
    templateUrl: './user-names-and-pwd.component.html',
    styleUrls: ['./user-names-and-pwd.component.css']
})

export class UserNamesAndPasswordComponent implements OnInit {
    formGroup: FormGroup;
    isVisible: boolean = false;
    selectedRow: any = '';
    isEdit: boolean = false;
    selectedRowIndex: any;
    isLoading: boolean = true;
    roleList: any;
    siteLocationList: any;
    cityList: any;
    stateList: any;
    validationClass: ValidationClass = new ValidationClass();

    emailVerified = false;
    userEnabled = false;
    userId = null;
    boltId = 0;
    userList: any;
    userSearchList: any = [];
    userActiveDeActiveList: any = [];

    @Input() organizationId: any;
    @Input() organizationCode: any;
    orgId = null;
    isDisabled = false;
    organizationsList: any;
    selectedOrgId: any;
    user: any;
    isSuperAdmin: boolean = false;
    request: any;

    public dataLoading: boolean = false;
    public userDataObject: any;
    userModalVisible: boolean = false;
    userModalHeader: string = 'User Information';
    isConfirmUserLoading: boolean = false;

    constructor(private dialog: MatDialog
        , private formBuilder: FormBuilder
        , private _userManagementService: UserManagementService
        , private router: Router
        , private sharedService: SharedService
        , private pullDownService: PullDownListService
        , private notificationService: NotificationUtilities) { }

    ngOnInit(): void {
        this.isSuperAdmin = false;
        this.sharedService.setPageTitle('User Information');
        this.userDataObject = [];
        this.user = sessionStorage.getItem('state');
        this.user = JSON.parse(this.user);
        if (this.user.roleName !== 'Super Admin' || this.organizationId) {
            this.getUserList();
        } else {
            if (!this.validationClass.isEmpty(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) &&
                !this.validationClass.isNullOrUndefined(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1))) {
                this.selectedOrgId = Number(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1));
            } else {
                this.selectedOrgId = this.organizationId;
            }
            this.isSuperAdmin = true;
            this.getOrganizationList();
        }
        this.createForm();
        this.bindDropDownValues();
        this.fillUserDataObject();
    }

    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    * 
    */
    bindDropDownValues() {
        let data: any = 'CITY,STATE,SITE LOCATION';
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            if (result?.CITY) {
                this.cityList = result.CITY;
            }
            if (result?.STATE) {
                this.stateList = result.STATE;
            }
            if (result['SITE LOCATION']) {
                this.siteLocationList = result['SITE LOCATION'];
            }
        });
        this._userManagementService.getRoleNamesList().subscribe(result => {
            if (result) {
                this.roleList = result.filter((item: any) => item.name != 'Super Admin');
            }
        });
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            formLayout: ['vertical'],
            'id': [null],
            'email': ['', Validators.required],
            'mobile': [''],
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
            'enabled': [false],
            'deleted': [false]
        });
    }

    fillUserDataObject() {
        this.userDataObject = {
            id: null,
            email: '',
            mobile: '',
            roleName: '',
            siteLocation: '',
            firstName: '',
            lastName: '',
            active: true,
            address1: '',
            sendMail: false,
            address2: '',
            city: '',
            state: '',
            phone2: '',
            zipcode: '',
            fax: '',
            notes: '',
            botLink: '',
            startDate: '',
            boltActive: false,
            endDate: '',
            link: '',
            lastGenerated: '',
            orgId: '',
            emailVerified: false,
            enabled: false,
            deleted: false
        }
    }

    addNewData(): void {
        this.createForm();
        this.fillUserDataObject();
        this.clearFormValue();
        this.selectedRow = null;
        this.selectedRowIndex = null;
        this.isEdit = false;
        this.userModalVisible = true;
    }

    handleCancel(): void {
        this.clearFormValue();
        this.userModalVisible = false;
    }

    clearFormValue() {
        for (let control in this.formGroup.controls) {
            this.formGroup.controls[control].markAsPristine();
            this.formGroup.controls[control].markAsUntouched();
            this.formGroup.controls[control].updateValueAndValidity();
        }
    }

    getUserList() {
        if (this.isSuperAdmin) {
            this.orgId = this.selectedOrgId;
        } else {
            this.orgId = this.organizationId ? this.organizationId : this.user.orgId;
        }
        this.selectedOrgId = this.orgId;
        this._userManagementService.getUserList(this.orgId).subscribe(result => {
            this.hideLoader();
            if (result) {
                // this.userList = result.users.filter((item: any) => item.active);
                this.userList = result.users.filter((item: any) => !item.deleted);
                this.userSearchList = result.users.filter((item: any) => !item.deleted);
                this.userActiveDeActiveList = result.users;
                this.selectedRowIndex = null;
            }
        });
    }

    getOrganizationList() {
        this._userManagementService.getOrganizationsList().subscribe(result => {
            this.hideLoader();
            if (result) {
                this.organizationsList = result.filter((item: any) => item.orgActive);//.filter((v: any, i: any, a: string | any[]) => a.indexOf(v) === i);
                if (!this.selectedOrgId) {
                    this.selectedOrgId = result[0].orgId;
                }
                this.populateUserList(this.selectedOrgId);
            }
        });
    }

    populateUserList(event: any) {
        if (event !== null) {
            this.selectedOrgId = event;
            const result = this.organizationsList.filter((item: any) => item.orgId === Number(this.selectedOrgId));
            if (result && result[0].users) {
                // this.userList = result[0].users.filter((item: any) => item.active);
                this.userList = result[0].users.filter((item: any) => !item.deleted);
                this.userSearchList = result[0].users.filter((item: any) => !item.deleted);
                this.userActiveDeActiveList = result[0].users;
            }
            this.selectedRowIndex = null;
            this.orgId = this.selectedOrgId;
            this.organizationCode = result[0].orgCode;
        } else {
            this.userList = '';
            this.userSearchList = '';
            this.userActiveDeActiveList = '';
        }
    }

    hideLoader() {
        this.isLoading = false;
    }

    showLoader() {
        this.isLoading = true;
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
        if (this.user.orgSiteLocation && (this.validationClass.isEmpty(this.userDataObject.siteLocation)
            || this.validationClass.isNullOrUndefined(this.userDataObject.siteLocation))) {
            this.notificationService.createNotificationBasic('info', "User Creation", 'Please select site location !');
            return;
        }
        if (this.formGroup.valid) {
            this.isConfirmUserLoading = true;
            const request = this.getRequestPayload();
            this._userManagementService.createUser(request).subscribe(result => {
                if (result) {
                    this.isConfirmUserLoading = false;
                    this.userModalVisible = false;
                    if (this.isSuperAdmin) {
                        this.getOrganizationList();
                    } else {
                        this.getUserList();
                    }
                    this.notificationService.createNotificationBasic('success', "User Creation", 'User created successfully !');
                }
            }, (error: any) => {
                if (error) {
                    this.isConfirmUserLoading = false;
                    let message = JSON.parse(error.error);
                    this.notificationService.createNotificationBasic('error', "User Creation", "System error : " + message.message);
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

    setValuesToUpdate(data: any) {
        if (data) {
            this.isEdit = true;
            this.userDataObject.id = data.id;
            this.userDataObject.active = data.active;
            this.userDataObject.address1 = data.address1;
            this.userDataObject.address2 = data.address2;
            this.userDataObject.city = data.city;
            this.userDataObject.email = data.email;
            this.userDataObject.fax = data.fax;
            this.userDataObject.firstName = data.firstName
            this.userDataObject.lastName = data.lastName;
            this.userDataObject.mobile = data.mobile;
            this.userDataObject.notes = data.notes;
            this.userDataObject.orgId = Number(data.orgId);
            this.organizationCode = data.orgCode;
            this.userDataObject.phone2 = data.phone2;
            this.userDataObject.roleName = data.roleName;
            this.userDataObject.sendMail = data.sendMail;
            this.userDataObject.siteLocation = data.siteLocation;
            this.userDataObject.state = data.state;
            this.userDataObject.zipcode = data.zipcode;
            this.userModalVisible = true;
        }
    }

    removeUser(data: any) {
        if (data) {
            this.showLoader();
            data.active = false;
            data.deleted = true;
            this._userManagementService.updateUser(data).subscribe(res => {
                if (res) {
                    this.hideLoader();
                    this.getUserList();
                    this.notificationService.createNotificationBasic('success', "User Deletion", "System error : " + 'User deleted successfully !');
                }
            }, (error: any) => {
                this.hideLoader();
                const errorResponse = JSON.parse(error.error);
                this.notificationService.createNotificationBasic('error', "User Deletion", "System error : " + errorResponse.message);
            });
        }
    }

    updateUser() {
        if (this.formGroup.valid) {
            this.isConfirmUserLoading = true;
            this.request = this.getRequestPayload();
            this.request.id = this.userDataObject.id;
            this._userManagementService.updateUser(this.request).subscribe(result => {
                if (result) {
                    this.isConfirmUserLoading = false;
                    this.userModalVisible = false;
                    this.getUserList();
                    this.notificationService.createNotificationBasic('success', "User Updation", 'User updated successfully !');
                }
            }, (error: any) => {
                if (error) {
                    this.isConfirmUserLoading = false;
                    const errorResponse = JSON.parse(error.error);
                    this.notificationService.createNotificationBasic('error', "User Updation", "System error : " + errorResponse.message);
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

    getRequestPayload() {
        const payload = {
            'active': this.userDataObject.active,
            'address1': this.userDataObject.address1,
            'address2': this.userDataObject.address2,
            // 'bolt': {
            //     'boltActive': this.userDataObject.boltActive,
            //     'startDate': this.userDataObject.startDate,
            //     'endDate': this.userDataObject.endDate,
            //     'id': this.boltId,
            //     'lastGenerated': this.userDataObject.lastGenerated,
            //     'link': this.userDataObject.link
            // },
            'bolt': null,
            'city': this.userDataObject.city,
            'email': this.userDataObject.email,
            'emailVerified': this.emailVerified,
            'enabled': this.userEnabled,
            'fax': this.userDataObject.fax,
            'firstName': this.userDataObject.firstName,
            'lastName': this.userDataObject.lastName,
            'mobile': this.userDataObject.mobile,
            'notes': this.userDataObject.notes,
            'orgId': Number(this.orgId),
            'orgCode': this.organizationCode,
            'phone2': this.userDataObject.phone2,
            'roleName': this.userDataObject.roleName,
            'sendMail': this.userDataObject.sendMail,
            'siteLocation': this.userDataObject.siteLocation,
            'state': this.userDataObject.state,
            'zipcode': this.userDataObject.zipcode,
            'deleted': this.userDataObject.deleted
        }
        return payload;
    }

    resetPassword(test: any) {
        this.isLoading = true;
        this._userManagementService.resetPassword(test.email, test.orgCode).subscribe(result => {
            if (result) {
                this.isLoading = false;
                this.notificationService.createNotificationBasic('success', "Reset Password", result.message);
            }
        }, (error: any) => {
            this.notificationService.createNotificationBasic('error', "Reset Password", "System error: " + error);
        });
    }

    cancelReset() {

    }

    navigateToBackScreen() {
        this.router.navigate(['admin/home']);
    }

    //Move Function Start
    showMoveItemPopup(data: any): void {
        this.selectedRow = null;
        this.selectedRow = data;
        this.initMoveItemForm();
    }

    initMoveItemForm() {
    }

    //Merge Function Start
    showMergeItemPopup(data: any): void {
        this.selectedRow = null;
        this.selectedRow = data;
        this.initMergeItemForm();
    }

    initMergeItemForm() {
    }

    cancelDelete(): void { }

    //Print Function Start
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['Organization Code', 'First Name', 'Last Name', 'Email', 'Role Name', 'Site Location', 'Active']]
        let data: any = [];
        this.userList.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.id);
            tempObj.push(e.orgCode);
            tempObj.push(e.firstName);
            tempObj.push(e.lastName);
            tempObj.push(e.email);
            tempObj.push(e.roleName);
            tempObj.push(e.siteLocation);
            tempObj.push(e.active);
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
                doc.text("Compansol TRIO User List", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "User List"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'standing.pdf' });
        //doc.save('college.pdf');  
    }
    //Print Function End

    /**
     * @method applyFilter
     * @description apply the content search from list
     */
    applyFilter(filterValue: any) {
        this.isLoading = true;
        const targetValue: any[] = [];
        this.userSearchList.forEach((value: any) => {
            let keys = ["orgCode", "email", "firstName", "lastName", "roleName", "siteLocation", "active"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(filterValue)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.userList = targetValue;
        this.isLoading = false;
    }
}
