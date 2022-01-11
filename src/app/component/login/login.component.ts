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
    username: 'mumbaiuniversity.user1',
    password: 'mupassword1234'
  }
  uname: string = 'EOC_DEMO';
  password: string = 'mupassword1234';

  constructor(private _loginService: LoginService) {}

  validate() {
    this._loginService.validateLogin(this.requestData).subscribe(result => {
      if (result) {
        this.validateLogin.emit(result);
      }
    });
    const result = {
      body: {
        access_token: 'asfjaskdf090909-dasfsadfdsfa09090909'
      }
    }
    this.validateLogin.emit(result);
  }
}