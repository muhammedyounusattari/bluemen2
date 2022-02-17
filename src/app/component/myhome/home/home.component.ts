import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';
import { ActivatedRoute } from '@angular/router';
import { TimeClockComponent } from './time-clock/time-clock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public popup: string;
  formGroup: FormGroup;
  @ViewChild('resetPasswordPopup') resetPasswordPopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md'
  }
  userData: any;
  question1List: any = [];
  question2List: any = [];

  constructor(private route: ActivatedRoute
    , private _loginService: LoginService
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private dialog: MatDialog
    , private toastr: ToastrService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
          this.popup = params?.popup;
          if (this.popup == 'time-clock') {
            this.openTimeClock();
          }
        }
      );
    this.createForm();
    this.userData = sessionStorage.getItem('state');
    if (this.userData) {
      this.userData = JSON.parse(this.userData);
      if (this.userData.isFirstTime === 'true') {
        setTimeout(() => {
          document.getElementById('hiddenBtn')?.click();          
        }, 500);
      }
    }
  }
  openResetPwdPopup() {
    this._loginService.getSecurityQuestions1(sessionStorage.getItem('realmId')).subscribe((result: any) => {
      if (result) {
        result = JSON.parse(result);
        this.question1List = result;
      }
    },
    (error: any) => {
    });

    this._loginService.getSecurityQuestions2(sessionStorage.getItem('realmId')).subscribe((result: any) => {
      if (result) {
        result = JSON.parse(result);
        this.question2List = result;
      }
    },
    (error: any) => {
    });
    this.openModal(this.resetPasswordPopupRef);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'fpUsername': [''],
      'securityQuestion1': ['', Validators.required],
      'securityQuestion2': ['', Validators.required],
      'securityAnswer1': ['', Validators.required],
      'securityAnswer2': ['', Validators.required]
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  validateAnswer() {
    if (this.formGroup.valid) {
      const data = {
        'username': this.formGroup?.get('fpUsername')?.value,
        'securityQuestion1': this.formGroup?.get('securityQuestion1')?.value,
        'securityQuestion2': this.formGroup?.get('securityQuestion2')?.value,
        'securityAnswer1': this.formGroup?.get('securityAnswer1')?.value,
        'securityAnswer2': this.formGroup?.get('securityAnswer2')?.value
      };
      this._loginService.resetPassword(data, this.formGroup?.get('fpOrgcode')?.value).subscribe((result: any) => {
        if (result.status === '200') {
          this.dialog.open(DialogBoxComponent, {
            data: {
              title: 'Reset Password',
              message: 'You have successfully reset your password.'
            }
          });
          this.modalRef.hide();
          sessionStorage.clear();
          window.location.reload();
        } else {
          this.toastr.success(result.message, '', {
            timeOut: 5000,
            closeButton: true
          });
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  /**
   * @method openTimeClock
   */
  public openTimeClock() {
    this.dialog.open(TimeClockComponent, {
      width: '50%',
      panelClass: 'time-clock-container'
    });
  }
}
