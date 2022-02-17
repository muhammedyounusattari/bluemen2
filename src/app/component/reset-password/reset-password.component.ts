import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-reset',
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
  }

  validatePassword() {

    let value = this.formGroup?.get('newPassword')?.value;

    if (!value) {
      return;
    }

    if (value.length >= 12 && value.length <= 50) {
      this.passwordLength = "fa fa-check";
    } else {
      this.passwordLength = "fa fa-close";
    }

    let upperCaseCharacters = /[A-Z]/
    if (upperCaseCharacters.test(value) === false) {
      this.isUppercase = "fa fa-close";
    } else {
      this.isUppercase = "fa fa-check";
    }

    let lowerCaseCharacters = /[a-z]+/g
    if (lowerCaseCharacters.test(value) === false) {
      this.isLowercase = "fa fa-close";
    } else {
      this.isLowercase = "fa fa-check";
    }


    let numberCharacters = /[0-9]+/g
    if (numberCharacters.test(value) === false) {
      this.isNumber = "fa fa-close";
    } else {
      this.isNumber = "fa fa-check";
    }

    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    if (specialCharacters.test(value) === false) {
      this.isSpecialChar = "fa fa-close";
    } else {
      this.isSpecialChar = "fa fa-check";
    }

  }

  passwordMatchCompare() {
    this.validatePassword();
    if (this.formGroup?.get('newPassword')?.value && this.formGroup?.get('reTypePassword')?.value) {
      if (this.formGroup?.get('newPassword')?.value === this.formGroup?.get('reTypePassword')?.value) {
        this.passwordMatch = "fa fa-check";
      } else {
        this.passwordMatch = "fa fa-close";
      }
    }
  }
  resetPassword() {
    if(this.formGroup.valid) {
      
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}