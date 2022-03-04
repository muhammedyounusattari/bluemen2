import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})

export class ResetPasswordComponent implements OnInit {
  formGroup: FormGroup;
  isLoading: boolean = false;
  hide: boolean = true;
  public passwordLength: string = "fa fa-close";;
  public isUppercase: string = "fa fa-close";;
  public isLowercase: string = "fa fa-close";;
  public isNumber: string = "fa fa-close";;
  public isSpecialChar: string = "fa fa-close";;
  public passwordMatch: string = "fa fa-close";
  userName: any = '';
  securityId: any = '';
  @Input() hashcode = '';
  newPasswordErrorMsg = '';
  newPasswordError = false;
  conrirmPasswordMatch = false;
  conrirmPasswordMatchMsg = '';

  constructor(private _loginService: LoginService
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private dialog: MatDialog
    , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.hide = true;
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'newPassword': ['', Validators.required],
      'reTypePassword': ['', Validators.required],
    });
    this.formGroup?.get('newPassword')?.setValue('');
    this.formGroup?.get('reTypePassword')?.setValue('');
  }

  validatePassword() {
    this.newPasswordErrorMsg = '';
    this.newPasswordError = false;
    let value = this.formGroup?.get('newPassword')?.value;
    if (!value) {
      return false;
    }
    if (value.length < 12) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Password length should be atlease 12 charectors.';
      return false;
    } else if (value.length > 50) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Password length must not be greater than 50 charectors.';
      return false;
    }

    let upperCaseCharacters = /[A-Z]/;
    if (upperCaseCharacters.test(value) === false) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Atleast one upper case charector will be there.';
      return false;
    }

    let lowerCaseCharacters = /[a-z]+/g
    if (lowerCaseCharacters.test(value) === false) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Atleast one lower case charector will be there.';
      return false;
    }

    let numberCharacters = /[0-9]+/g
    if (numberCharacters.test(value) === false) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Atleast one number value will be there.';
      return false;
    }

    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    if (specialCharacters.test(value) === false) {
      this.newPasswordError = true;
      this.newPasswordErrorMsg = 'Atleast one special charector will be there.';
      return false;
    }
    return true;
  }

  passwordMatchCompare() {
    this.conrirmPasswordMatch = false;
    this.conrirmPasswordMatchMsg = '';
    if (this.formGroup?.get('newPassword')?.value && this.formGroup?.get('reTypePassword')?.value) {
      if (this.formGroup?.get('newPassword')?.value !== this.formGroup?.get('reTypePassword')?.value) {
        this.conrirmPasswordMatch = true;
        this.conrirmPasswordMatchMsg = 'Password is not match.';
        return false;
      }
    } else {
      return false
    }
    return true;
  }
  resetPassword() {
    if (this.formGroup.valid && this.validatePassword() && this.passwordMatchCompare()) {
      const data = {
        'password': this.formGroup?.get('newPassword')?.value,
        'confPassword': this.formGroup?.get('reTypePassword')?.value
      }
      this._loginService.resetPasswordUsingLink(data, this.hashcode).subscribe((result: any) => {
        if (result) {
          console.log(result);
        }
      }, (error: any) => {
        console.log(error);
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}