import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';
import { ActivatedRoute } from '@angular/router';
import { TimeClockComponent } from './time-clock/time-clock.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public popup: string;
  formGroup: FormGroup;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md'
  }
  userData: any;
  question1List: any = [];
  question2List: any = [];
  orgId : any;
  userInfo: any;
  secQuestionModalVisible: boolean = false;
  secQuestionModalHeader = 'Security Questions';
  isSubmitSecQuestions: boolean = false;

  constructor(private route: ActivatedRoute
    , private _loginService: LoginService
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private dialog: MatDialog
    , private toastr: ToastrService
    , private sharedService: SharedService
    , private notificationService: NotificationUtilities) { }

  ngOnInit() {
    this.sharedService.setPageTitle('Dashboard');
    this.route.queryParams
      .subscribe(params => {
          this.popup = params?.popup;
          if (this.popup == 'time-clock') {
            this.openTimeClock();
          }
        }
      );
    this.userInfo = sessionStorage.getItem('state');
    this.userInfo = JSON.parse(this.userInfo);
    this.orgId = this.userInfo.orgId;
    this.createForm();
    this.userData = sessionStorage.getItem('state');
    this.userData = JSON.parse(this.userData)
    if (this.userData) {
      if (this.userData.firstTime) {
        this._loginService.getSecurityQuestionList(this.orgId).subscribe((result: any) => {
          if (result) {
            this.question1List = result.body.question1;
            this.question2List = result.body.question2;
            this.secQuestionModalVisible = true;
          }
        },
        (error: any) => {
          const errorResponse = JSON.parse(error.error);
          this.notificationService.createNotificationBasic(errorResponse.message, 'Security questions','Loading Security questions failed');
        });
      }
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      formLayout: ['vertical'],
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
      this.isSubmitSecQuestions = true;
      const question1Name = this.question1List.filter((item:any) => item.id === Number(this.formGroup?.get('securityQuestion1')?.value));
      const question2Name = this.question2List.filter((item:any) => item.id === Number(this.formGroup?.get('securityQuestion2')?.value));
      if (question1Name && question2Name) {
        const data = {
          'orgCode': sessionStorage.getItem('realmId'),
          'username': sessionStorage.getItem('username'),
          'securityQuestion1': question1Name[0].name,
          'securityQuestion1Id': this.formGroup?.get('securityQuestion1')?.value,
          'securityQuestion2': question2Name[0].name,
          'securityQuestion2Id': this.formGroup?.get('securityQuestion2')?.value,
          'securityAnswer1': this.formGroup?.get('securityAnswer1')?.value,
          'securityAnswer2': this.formGroup?.get('securityAnswer2')?.value
        };
        this._loginService.updateSecurityQuestions(data).subscribe((result: any) => {
          if (result) {
            this.isSubmitSecQuestions = false;
            result = JSON.parse(result);
            this.notificationService.createNotificationBasic('success', 'Security Questions', result.message);
            this.secQuestionModalVisible = false;
          }
        }, (error: any) => {
          const errorResponse = JSON.parse(error);
          this.notificationService.createNotificationBasic(errorResponse.message, 'Security questions','Loading Security questions failed');
        });
      }
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

  handleCancel() {
    this.isSubmitSecQuestions = false;
    this.secQuestionModalVisible = false;
  }
}
