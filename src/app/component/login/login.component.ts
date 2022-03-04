import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  @Output() validateLogin = new EventEmitter();
  requestData = {
    username: '',
    password: ''
  };
  formGroup: FormGroup;
  formGroup1: FormGroup;
  isInvalidCredentials: boolean = false;
  isLoading: boolean = false;
  hide: boolean = true;
  errorMessage: string = '';
  isLoginEnabled: boolean = true;

  @ViewChild('forgotPasswordPopup') forgotPasswordPopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md'
  }
  isVisible = false;
  @ViewChild('twoFactorPopup') twoFactorPopupRef: TemplateRef<any>;
  modalRef1: BsModalRef;
  modalConfigSM1 = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  }
  errorFPMessage = '';
  fpError = false;

  constructor(private _loginService: LoginService
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private dialog: MatDialog
    , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.hide = true;
    this.createForm();
    this.createForgotPasswordForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'orgCode': ['', Validators.required],
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  getError(el: any) {
    this.isInvalidCredentials = false;
    switch (el) {
      case 'orgCode':
        if (this.formGroup.get('orgCode')?.hasError('required')) {
          return 'Organization Code required';
        }
        break;
      case 'user':
        if (this.formGroup.get('username')?.hasError('required')) {
          return 'Username required';
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

  validate(data: any) {
    if (this.formGroup.valid) {
      this.isInvalidCredentials = false;
      this.isLoading = true;
      this.requestData.username = this.formGroup?.get('username')?.value;
      this.requestData.password = this.formGroup?.get('password')?.value;

      this._loginService.validateLogin(this.requestData, this.formGroup?.get('orgCode')?.value).subscribe(result => {
        this.isLoading = false;
        if (result) {
          result = JSON.parse(result);
          if (result.status === '200') {
            sessionStorage.setItem('realmId', this.formGroup?.get('orgCode')?.value);
            sessionStorage.setItem('username', this.formGroup?.get('username')?.value);
            sessionStorage.setItem('state', JSON.stringify(result));
            if (result.isTwoFactorEnabled) {
              this.openModal(this.twoFactorPopupRef);
            } else {
              this.validateLogin.emit(result);
            }
          }
        }
        // else if (result.status === '402') {
        //   if (result.wrongAttempt === 4) {
        //     this.isInvalidCredentials = true;
        //     this.errorMessage =
        //       "WARNING: Your Account will be Locked after 2 more unsuccessful attempts.Please check your credentials and try again or click on 'Forgot Password?'";
        //   }
        // } else if (result.status === '403') {
        //   this.isInvalidCredentials = true;
        //   this.isLoginEnabled = false;
        //   this.errorMessage = result.message;
        // }
        // else {
        //   this.isInvalidCredentials = true;
        //   this.errorMessage = result.message;
        // }
      },
        (error: any) => {
          this.isLoading = false;
          this.isInvalidCredentials = true;
          const errorResponse = JSON.parse(error.error);
          if (errorResponse.status === '402') {
            if (errorResponse.wrongAttempt === 4) {
              // this.isInvalidCredentials = true;
              // this.errorMessage = errorResponse.message;
              this.toastr.error(errorResponse.message, '', {
                // timeOut: 5000,
                closeButton: true
              });
            }
          } else if (errorResponse.status === '403') {
            // this.isInvalidCredentials = true;
            this.isLoginEnabled = false;
            // this.errorMessage = errorResponse.message;
            this.toastr.error(errorResponse.message, '', {
              // timeOut: 5000,
              closeButton: true
            });
          }
          else {
            this.toastr.error(errorResponse.message, '', {
              // timeOut: 5000,
              closeButton: true
            });
            // this.isInvalidCredentials = true;
            // this.errorMessage = errorResponse.message;
          }
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  createForgotPasswordForm() {
    this.formGroup1 = this.formBuilder.group({
      'fpOrgCode': ['', Validators.required],
      'fpUsername': ['', Validators.required],
      'securityQuestion1': ['', Validators.required],
      'securityQuestion2': ['', Validators.required],
      'securityAnswer1': ['', Validators.required],
      'securityAnswer2': ['', Validators.required]
    });
  }

  forgotPwd() {
    this.createForgotPasswordForm();
    this.isVisible = false;
    this.openModal(this.forgotPasswordPopupRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  getSecQuestions() {
    this.fpError = false;
    this._loginService.getSecurityQuestions(this.formGroup1?.get('fpUsername')?.value, this.formGroup1?.get('fpOrgCode')?.value)
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
          // this.dialog.open(DialogBoxComponent, {
          //   data: {
          //     title: 'Error',
          //     message: errorResponse.message
          //   }
          // });
          this.fpError = true;
          this.errorFPMessage = errorResponse.message;
        });
  }

  validateAnswer() {
    this.fpError = false;
    if (this.formGroup1.valid) {
      const data = {
        'orgCode': this.formGroup1?.get('fpOrgCode')?.value,
        'username': this.formGroup1?.get('fpUsername')?.value,
        'securityAnswer1': this.formGroup1?.get('securityAnswer1')?.value,
        'securityAnswer2': this.formGroup1?.get('securityAnswer2')?.value
      };
      this._loginService.forgotPassword(data, this.formGroup1?.get('fpOrgcode')?.value).subscribe((result: any) => {
        if (result) {
          result = JSON.parse(result);
          // let maskid = "";
          // const myemailId = result.email;
          // const prefix = myemailId.substring(0, myemailId.lastIndexOf("@"));
          // const postfix = myemailId.substring(myemailId.lastIndexOf("@"));

          // for (var i = 0; i < prefix.length; i++) {
          //   if (i == 0 || i == prefix.length - 1) {   ////////
          //     maskid = maskid + prefix[i].toString();
          //   }
          //   else {
          //     maskid = maskid + "*";
          //   }
          // }
          // maskid = maskid + postfix;
          this.dialog.open(DialogBoxComponent, {
            data: {
              title: 'Forgot Password',
              message: result.message
            }
          });
          this.modalRef.hide();
        }
      },
        (error: any) => {
          this.isLoading = false; 
          this.isInvalidCredentials = true;
          const errorResponse = JSON.parse(error.error);
          // this.dialog.open(DialogBoxComponent, {
          //   data: {
          //     title: 'Error',
          //     message: errorResponse.message
          //   }
          // });
          this.fpError = true;
          this.errorFPMessage = errorResponse.message;

        });
    } else {
      this.formGroup1.markAllAsTouched();
    }
  }
  getSecurityCode() {

  }
}
