import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  @Output() validateLogin = new EventEmitter();
  requestData = {
    username: '',
    password: ''
  }
  orgCode: string ='mcn-demo';
  uname: string = 'mcn-demo.user1';
  password: string = 'mcn-demo.password1';

  constructor(private _loginService: LoginService) {}

  validate() {
    if (this.orgCode) {
      this.requestData.username = this.uname;
      this.requestData.password = this.password;
      this._loginService.validateLogin(this.requestData, this.orgCode).subscribe(result => {
        if (result) {
          sessionStorage.setItem("realmId", this.orgCode);
          sessionStorage.setItem("username", this.uname);
          sessionStorage.setItem("state", result);
          this.validateLogin.emit(result);
        }
      });
    } else {
      alert('Please enter Organization Code');
    }
  }
}
