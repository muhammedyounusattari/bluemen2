import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
  isInvalidCredentials: boolean = false;
  isLoading: boolean = false;
  hide: boolean = true;

  constructor(private _loginService: LoginService
    , private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.hide = true;
    this.createForm();
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
      this.isLoading = true;
      this.requestData.username = this.formGroup?.get('username')?.value;
      this.requestData.password = this.formGroup?.get('password')?.value;

      this._loginService.validateLogin(this.requestData, this.formGroup?.get('orgCode')?.value).subscribe(result => {
        this.isLoading = false;
        if (result) {
          sessionStorage.setItem('realmId', this.formGroup?.get('orgCode')?.value);
          sessionStorage.setItem('username', this.formGroup?.get('username')?.value);
          sessionStorage.setItem('state', result);
          this.validateLogin.emit(result);
        }
      },
        (error: any) => {
          this.isLoading = false;
          this.isInvalidCredentials = true;
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}