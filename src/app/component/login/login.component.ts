import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
    @Output() validateLogin = new EventEmitter();
    requestData = {
        email: '',
        password: '',
        organization: ''
    };
    formGroup: FormGroup;
    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    isInvalidCredentials: boolean = false;
    isLoading: boolean = false;
    hide: boolean = false;
    errorMessage: string = '';
    isLoginEnabled: boolean = true;

    isVisible = false;

    errorFPMessage = '';
    fpError = false;
    isValidUser: boolean = false;
    isFirstTime: boolean = false;
    isTwoFactorEnabled: boolean = false;
    otpCode: any = '';
    authenticateResponse: any;
    isRunning: boolean = false;
    public loginModel: any = {
        "organization": '',
        "email": '',
        "password": ''
    };

    isFPModalVisible: boolean = false;
    fpModalHeader = 'Forgot password';
    isConfirmFPLoading: boolean = false;

    isTFAModalVisible: boolean = false;
    tfaModalHeader = 'Two Factor Authentication';
    isConfirmTFALoading: boolean = false;
    tfaValue = '';

    isVCModalVisible: boolean = false;
    vcModalHeader = 'Validate Code';
    isConfirmVCLoading: boolean = false;

    constructor(private _loginService: LoginService
        , private formBuilder: FormBuilder
        , private notificationService: NotificationUtilities) { }

    ngOnInit(): void {
        this.isValidUser = false;
        this.hide = true;
        this.createForm();
        this.createForgotPasswordForm();
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            formLayout: ['vertical'],
            organization: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    getError(el: any) {
        this.isInvalidCredentials = false;
        switch (el) {
            case 'organization':
                if (this.formGroup.get('organization')?.hasError('required')) {
                    return 'Organization Code required';
                }
                break;
            case 'email':
                if (this.formGroup.get('email')?.hasError('required')) {
                    return 'Email required';
                }
                break;
            case 'pass':
                if (this.formGroup.get('password')?.hasError('required')) {
                    return 'Password required';
                }
                break;
            default:
                return '';
        }
        return null;
    }

    validate() {
        for (const i in this.formGroup.controls) {
            this.formGroup.controls[i].markAsDirty();
            this.formGroup.controls[i].updateValueAndValidity();
        }

        if (this.formGroup.valid) {
            this.isInvalidCredentials = false;
            this.isLoading = true;
            this.requestData.email = this.formGroup?.get('email')?.value;
            this.requestData.password = this.formGroup?.get('password')?.value;
            this.requestData.organization = this.formGroup?.get('organization')?.value;

            this._loginService.validateLogin(this.requestData, this.formGroup?.get('organization')?.value).subscribe(result => {
                this.isLoading = false;
                if (result) {
                    result = JSON.parse(result);
                    if (result.status === 200) {
                        sessionStorage.setItem('realmId', this.requestData.organization);
                        sessionStorage.setItem('username', this.requestData.email);
                        sessionStorage.setItem('state', JSON.stringify(result));
                        sessionStorage.setItem('orgId', result.orgId);
                        this.authenticateResponse = result;
                        if (result.twoFactorEnabled) {
                            this.isTwoFactorEnabled = result.twoFactorEnabled;
                            this.createTFAFB();
                            this.tfaValue = '1';
                            this.isTFAModalVisible = true;
                        } else {
                            this.validateLogin.emit(result);
                        }
                    }
                }
            },
                (error: any) => {
                    this.isLoading = false;
                    this.isInvalidCredentials = true;
                    const errorResponse = JSON.parse(error.error);
                    // this.sharedService.sendErrorMessage(errorResponse.message);
                    // this.sharedService.showErrorMessage();
                    this.notificationService.createNotificationBasic('error', "Authenticate", "System error : " + errorResponse.message);
                    if (errorResponse.status === '403') {
                        this.isLoginEnabled = false;
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

    createTFAFB() {
        this.formGroup2 = this.formBuilder.group({
            formLayout: ['vertical'],
            twoFactor: 1
        });
    }

    createForgotPasswordForm() {
        this.formGroup1 = this.formBuilder.group({
            formLayout: ['horizontal'],
            fpOrgCode: ['', Validators.required],
            fpEmail: ['', Validators.required],
            securityQuestion1: [{ disabled: true, value: '' }, Validators.required],
            securityQuestion2: [{ disabled: true, value: '' }, Validators.required],
            securityAnswer1: ['', Validators.required],
            securityAnswer2: ['', Validators.required]
        });
    }

    handleCancel(): void {
        this.createForgotPasswordForm();
        this.isFPModalVisible = false;
        this.isTFAModalVisible = false;
        this.isVCModalVisible = false;
    }

    forgotPwd() {
        this.createForgotPasswordForm();
        this.isVisible = false;
        this.isFPModalVisible = true;
        // this.openModal(this.forgotPasswordPopupRef);
    }

    getSecQuestions() {
        this.fpError = false;
        if (this.formGroup1?.get('fpEmail')?.value && this.formGroup1?.get('fpOrgCode')?.value) {
            this._loginService.getSecurityQuestions(this.formGroup1?.get('fpEmail')?.value, this.formGroup1?.get('fpOrgCode')?.value)
                .subscribe(result => {
                    if (result) {
                        result = JSON.parse(result);
                        if (result.status === '200') {
                            this.formGroup1?.get('securityQuestion1')?.setValue(result.SecurityQuestion1);
                            this.formGroup1?.get('securityQuestion2')?.setValue(result.SecurityQuestion2);
                            this.isVisible = true;
                        }
                    }
                },
                    (error: any) => {
                        this.isLoading = false;
                        this.isInvalidCredentials = true;
                        const errorResponse = JSON.parse(error.error);
                        // this.sharedService.sendErrorMessage(errorResponse.message);
                        // this.sharedService.showErrorMessage();
                        this.notificationService.createNotificationBasic('error', "Get Security Questions", "System error : " + errorResponse.message);
                    });
        } else {
            Object.values(this.formGroup1.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    validateAnswer() {
        this.fpError = false;
        for (const i in this.formGroup1.controls) {
            this.formGroup1.controls[i].markAsDirty();
            this.formGroup1.controls[i].updateValueAndValidity();
        }
        if (this.formGroup1.valid) {
            this.isConfirmFPLoading = true;
            const data = {
                'orgCode': this.formGroup1?.get('fpOrgCode')?.value,
                'email': this.formGroup1?.get('fpEmail')?.value,
                'securityAnswer1': this.formGroup1?.get('securityAnswer1')?.value,
                'securityAnswer2': this.formGroup1?.get('securityAnswer2')?.value
            };
            this._loginService.forgotPassword(data).subscribe((result: any) => {
                if (result) {
                    result = JSON.parse(result);
                    if (result.status >= 400) {
                        this.notificationService.createNotificationBasic('error', "Validate Question & Answer", result.message);
                        this.isConfirmFPLoading = false;
                    } else {
                        this.notificationService.createNotificationBasic('success', "Validate Question & Answer", result.message);
                        this.isConfirmFPLoading = false;
                        this.isFPModalVisible = false;
                    }

                }
            },
                (error: any) => {
                    this.isLoading = false;
                    this.isInvalidCredentials = true;
                    const errorResponse = JSON.parse(error.error);
                    // this.sharedService.sendErrorMessage(errorResponse.message);
                    // this.sharedService.showErrorMessage();
                    this.notificationService.createNotificationBasic('error', "Validate Question & Answer", "System error : " + errorResponse.message);
                    this.isConfirmFPLoading = false;
                });
        } else {
            Object.values(this.formGroup1.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    createValidateVC() {
        this.formGroup3 = this.formBuilder.group({
            formLayout: ['horizontal'],
            otpCode: [null, Validators.required]
        });
    }

    getSecurityCode() {
        this.isRunning = true;
        this.isConfirmTFALoading = true;
        for (const i in this.formGroup2.controls) {
            this.formGroup2.controls[i].markAsDirty();
            this.formGroup2.controls[i].updateValueAndValidity();
        }

        if (this.formGroup2.valid) {
            this._loginService.generateCode().subscribe((result: any) => {
                if (result) {
                    this.isRunning = false;
                    this.isConfirmTFALoading = false;
                    this.isTFAModalVisible = false;
                    this.isVCModalVisible = true;
                    this.createValidateVC();
                }
            }, (error: any) => {
                error = JSON.parse(error.error);
                this.isRunning = false;
                this.isConfirmTFALoading = false;
                this.notificationService.createNotificationBasic('error', "Send Code", "System error : " + error.message);
            });
        }
    }

    validateCode() {
        this.isRunning = true;
        this.isConfirmVCLoading = true;
        for (const i in this.formGroup3.controls) {
            this.formGroup3.controls[i].markAsDirty();
            this.formGroup3.controls[i].updateValueAndValidity();
        }
        if (this.formGroup3.valid) {
            this._loginService.validateCode(this.otpCode).subscribe((result: any) => {
                if (result) {
                    this.isConfirmVCLoading = false;
                    this.isRunning = false;
                    this.validateLogin.emit(this.authenticateResponse);
                    this.isVCModalVisible = false;
                }
            }, (error: any) => {
                error = JSON.parse(error.error);
                this.isConfirmVCLoading = false;
                this.isRunning = false;
                this.notificationService.createNotificationBasic('error', "Validate OTP", "System error : " + error.message);
            });
        }
    }

    checkUserExist() {
        if (this.formGroup?.get('email')?.value && this.formGroup?.get('organization')?.value) {
            this.isLoading = true;
            this.requestData.email = this.formGroup?.get('email')?.value;
            this.requestData.organization = this.formGroup?.get('organization')?.value;
            const request = {
                email: this.requestData.email,
                orgType: this.requestData.organization
            }
            this._loginService.getSSOConfig(request).subscribe(result => {
                if (result.status === 200) {
                    this.isLoading = false;
                    this.isValidUser = true;
                    this.isFirstTime = result.isFirstTime;
                } else {
                    this.isLoading = false;
                    // this.sharedService.sendErrorMessage(result.message);
                    // this.sharedService.showErrorMessage();
                    this.notificationService.createNotificationBasic('error', "Validate Org Code and Email id", "System error : " + result.message);
                    if (result.status === '403') {
                        this.isLoginEnabled = false;
                    }
                }
            }, (error: any) => {
                error = error.error;
                this.isLoading = false;
                // this.sharedService.sendErrorMessage(error.message);
                // this.sharedService.showErrorMessage();
                this.notificationService.createNotificationBasic('error', "Validate Org Code and Email id", "System error : " + error.message);
                if (error.status === '403') {
                    this.isLoginEnabled = false;
                }
            });
        } else {
            for (const i in this.formGroup.controls) {
                this.formGroup.controls[i].markAsDirty();
                this.formGroup.controls[i].updateValueAndValidity();
            }
        }
    }
}
