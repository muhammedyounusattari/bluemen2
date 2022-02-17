import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})

export class ForgotPasswordComponent {
}