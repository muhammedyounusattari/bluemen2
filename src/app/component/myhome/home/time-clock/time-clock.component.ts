import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TimeClockService } from 'src/app/services/home/time-clock.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-time-clock',
  templateUrl: './time-clock.component.html',
  styleUrls: ['./time-clock.component.css']
})
export class TimeClockComponent implements OnInit {
  public timeClockForm: FormGroup;
  public clockLabel: string;
  public staffClock: any;
  public staffMembersList: any = [];
  selectedStaffName: any;
  isStaffListLoading: boolean = false;


  constructor(private fb: FormBuilder, private service: TimeClockService,
     private router: Router,private modal: NzModalRef, private notificationService: NotificationUtilities) { }

  ngOnInit(): void {
    this.timeClockForm = this.fb.group({
      staffName: ['', Validators.required]
    });
    this.clockLabel = 'Clock In';
    this.getStaffMembers();
  }

  /**
   * @method getStaffMembers
   */
  public getStaffMembers() {
    this.isStaffListLoading = true;
    this.service.getStaffMember().subscribe((resp: any) => {
      this.isStaffListLoading = false;
      if (resp)
      resp.forEach((element: any) => {
        if (element.id && element.staffName) {
          this.staffMembersList.push({id: element.id, name: element.staffName});
        }
      });
    })
  }


  /**
   * @method closeModal
   */
  public closeModal(): void {
    this.modal.destroy({ data: 'closing modal' });
  }

  /**
   * @method selectedStaff
   */
  public selectedStaff(staffMember: any) {
    if(staffMember == undefined || !staffMember) return;
    this.service.getTimeClock(staffMember.id, staffMember.name).subscribe((resp: any) => {
      if (resp && resp.code == 200 && resp.msg) {
        this.clockLabel = resp.msg?.toLowerCase()?.includes('clocked out') ? 'Clock In' : 'Clock Out';
        const data = resp.msg.split(' ');
        this.staffClock = {
          date: data[data.length-1].includes('Z') ? data[data.length-1].replace('Z','') : ''
        };
        if (data[data.length-1].includes('Z') || data[data.length-1].includes(' ')) {
          delete data[data.length-1];
        }
        this.staffClock.message = data.join(' ');
        this.staffClock.message = this.staffClock?.date == '' ? '' : this.staffClock.message;
      }
    })
  }

  /**
   * @method submitTime
   */
  public submitTime() {
    if (this.clockLabel == 'Clock In') {
      this.service.addTimeClock(this.requestPayload()).subscribe(resp => {
        this.notificationService.createNotificationBasic('Success', "Clock In", 'Clock In Successful!');
        this.closeModal();
      });
    } else {
      this.service.editTimeClock(this.requestPayload()).subscribe(resp => {
        this.notificationService.createNotificationBasic('Success', "Clock Out", 'Clock Out Successful!');
        this.closeModal();
      });
    }
  }

  /**
   * @method requestPayload
   */
  public requestPayload() {
    let request: any = {
      checkInTime: this.clockLabel == 'Clock Out' ? (this.staffClock?.date ?
        new Date(this.staffClock?.date).toISOString() : new Date().toISOString())
        : new Date().toISOString(),
      checkOutTime: this.clockLabel == 'Clock In' ? null : new Date().toISOString(),
      duration: null,
      staffName: this.timeClockForm.value.staffName?.name,
      staffId: this.timeClockForm.value.staffName?.id,
      statusInOut: this.clockLabel == 'Clock In' ? 'clock-in' : 'clock-out'
    };

    return request;
  }

}