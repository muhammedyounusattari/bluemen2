import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HomeService } from 'src/app/services/home/home.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html'
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm!: FormGroup;

  public userName: string;
  public password: string;
  public newPassword: string;
  public confPassword: string;
  public securityQues1: any;
  public securityQues2: any;
  public answer1: string;
  public answer2: string;
  public securityQuesLst1: any = [];
  public securityQuesLst2: any = [];
  public passwordVisible: boolean = false;
  public passwordLength: string = "fa fa-close";;
  public isUppercase: string = "fa fa-close";;
  public isLowercase: string = "fa fa-close";;
  public isNumber: string = "fa fa-close";;
  public isSpecialChar: string = "fa fa-close";;
  public passwordMatch: string = "fa fa-close";

  constructor(public homeService: HomeService, private toastr: ToastrService,
    private sharedService: SharedService, private fb: FormBuilder,
    private message: NzMessageService, private notificationService: NotificationUtilities,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.sharedService.setPageTitle('Change Password');
    this.changePasswordForm = this.fb.group({
      formLayout: ['horizontal'],
      email: [{ disabled: true, value: "" }, [Validators.required]],
      password: [null, [Validators.required]],
      newPassword: [null, [Validators.required], [this.newPasswordAsyncValidator]],
      confPassword: [null, [Validators.required, this.confirmValidator]],
      securityQues1: [null, [Validators.required]],
      answer1: [null, [Validators.required]],
      securityQues2: [null, [Validators.required]],
      answer2: [null, [Validators.required]],
    });

    let username = sessionStorage.getItem('username');
    this.userName = username ? username : '';
    this.securityQuesLst1 = [];
    this.securityQuesLst2 = [];

    this.homeService.getSecurityQuestionList().subscribe((result) => {
      if (result) {
        this.securityQuesLst1 = result.body.question1;
        this.securityQuesLst2 = result.body.question2;
      }
    },
      (error: any) => {
        const errorResponse = JSON.parse(error.error);
        this.toastr.error(errorResponse.message, '', {
          timeOut: 5000,
          closeButton: true
        });
      });

  }

  onSubmit() {
    // for (const i in this.changePasswordForm.controls) {
    //   this.changePasswordForm.controls[i].markAsDirty();
    //   this.changePasswordForm.controls[i].updateValueAndValidity();
    // }
    if (this.changePasswordForm.valid) {
      let payload = {
        "password": this.password,
        "confPassword": this.confPassword,
        "securityQuestion1": this.securityQues1,
        "securityQuestion2": this.securityQues2,
        "securityAnswer1": this.answer1,
        "securityAnswer2": this.answer2
      };
      this.homeService.changePassword(payload).subscribe((result) => {
        result = JSON.parse(result);
        if (result.status === '200') {
          this.notificationService.createNotificationBasic('success', "Change Password", 'Password changed Successfully!');
          window.location.assign('');
        } else {
          this.notificationService.createNotificationBasic('error', "Change Password", 'Password change failed!');
        }

      }, (error: any) => {
        console.log(error);
        this.notificationService.createNotificationBasic('error', "Change Password", 'Password change failed!');
      });
    }
  }

  newPasswordAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!this.validatePassword()) {
          // you have to return `{error: true}` to mark it as an error event
          if(control.value == this.changePasswordForm.controls.password.value) {
            observer.next({ error: true, weak: true, duplicate: true });
          } else {
            observer.next({ error: true, weak: true, duplicate: false });
          }
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

    confirmValidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return { error: true, required: true };
      } else if (control.value !== this.changePasswordForm.controls.newPassword.value) {
        return { confirm: true, error: true };
      }
      return {};
    };
  
    validateConfirmPassword(): void {
      setTimeout(() => this.changePasswordForm.controls.confPassword.updateValueAndValidity());
    }


  validatePassword(): boolean {
    let value = this.newPassword;
    if (!value) {
      return false;
    }
    let valid = true;
    if (value.length >= 12 && value.length <= 50) {
      this.passwordLength = "fa fa-check";
    } else {
      this.passwordLength = "fa fa-close";
      valid = false;
    }

    let upperCaseCharacters = /[A-Z]/
    if (upperCaseCharacters.test(value) === false) {
      this.isUppercase = "fa fa-close";
      valid = false;
    } else {
      this.isUppercase = "fa fa-check";
    }

    let lowerCaseCharacters = /[a-z]+/g
    if (lowerCaseCharacters.test(value) === false) {
      this.isLowercase = "fa fa-close";
      valid = false;
    } else {
      this.isLowercase = "fa fa-check";
    }


    let numberCharacters = /[0-9]+/g
    if (numberCharacters.test(value) === false) {
      this.isNumber = "fa fa-close";
      valid = false;
    } else {
      this.isNumber = "fa fa-check";
    }

    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    if (specialCharacters.test(value) === false) {
      this.isSpecialChar = "fa fa-close";
      valid = false;
    } else {
      this.isSpecialChar = "fa fa-check";
    }
    return valid;
  }

  passwordMatchCompare() {
    this.validatePassword();
    if (this.newPassword && this.confPassword) {
      if (this.newPassword === this.confPassword) {
        this.passwordMatch = "fa fa-check";
      } else {
        this.passwordMatch = "fa fa-close";
      }
    }
  }
}
