import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-staff-member-merge-box',
  templateUrl: './staff-member-merge-box.component.html',
  styleUrls: ['./staff-member-merge-box.component.css']
})
export class StaffMemberMergeBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  staffList: any[];
  selectedStaffId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedStaffName: any;

  constructor(public dialogRef: MatDialogRef<StaffMemberMergeBoxComponent>, private notificationService: NotificationUtilities,
    @Inject(MAT_DIALOG_DATA) public data: StaffMemberMergeBoxModel, private formBuilder: FormBuilder, private staffMembersService: StaffMembersService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.staffList = data.staffList;
    this.selectedId = data.selectedId;
    this.selectedStaffId = data.selectedStaffId;
    this.selectedStaffName = data.selectedStaffName;

  }

  /**
 * @method ngOnInit
 * @description call all methods
 */
  ngOnInit() {
    this.createForm();
  }

  /**
  * @method onConfirm
  * @description this method is used for move the records.
  */
  onConfirm(): void {
    // Close the dialog, return true
    if (this.formGroup.valid) {
      let val = this.formGroup?.get('staffId')?.value.split('|')[1];
      if (val) {
        if (Number(this.selectedId) == Number(val.trim())) {
          this.notificationService.createNotificationBasic('info', "info", 'Same staff can not be merge!');
          this.formGroup.get("staffId")?.setValue('');
          return;
        } else {
          this.currentValId = val.trim();
        }
      } else {
        this.notificationService.createNotificationBasic('info', "info", 'Please select correct value!');
        this.formGroup.get("staffId")?.setValue('');
        return;
      }
      this.getDeletedItemById(this.currentValId);
    } else {
      this.formGroup.markAllAsTouched();
      if (!this.formGroup?.get('staffId')?.value) {
        Object.values(this.formGroup.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return;
      }

    }
  }

  /**
 * @method onDismiss
 * @description dismiss the popup
 */
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  /**
   * @method createForm
   * @description Form group create
   */
  createForm() {
    this.formGroup = this.formBuilder.group({
      'staffId': ['', Validators.required]
    });
  }

  /**
   * @method getDeletedItemById
   * @description This method is used for recover record and get deleted recodes.
   */
  getDeletedItemById(id: any) {
    const verifyData = {
      staffId: this.selectedStaffId
    }
    let status = this.verifyStaffId(this.currentValId);
    if (!status) {
      let message = "Do you want to merge staff " + this.selectedStaffName + " from No. " + this.selectedStaffId + " to No. " + id;
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.staffMembersService.mergeStaffByStaffId(verifyData).subscribe(result3 => {
            if (result3) {
              this.dialogRef.close(true);
            }
          });
        }
      });
    }
  }

  /**
     * @method verifyStaffId
     * @description Verify the gradeing Id name.
     */
  verifyStaffId(currentId: any) {
    currentId = Number(currentId);
    let status = false;
    const data = this.staffList.filter((item: any) => ((item.staffId) === (currentId)));
    if (data && data.length > 0) {
      status = false;
    } else {
      this.notificationService.createNotificationBasic('info', "info", 'This record does not exist!');
      this.formGroup.get("staffId")?.setValue('');
      status = true;
    }
    return status;

  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class StaffMemberMergeBoxModel {

  constructor(public title: string, public message: string, public staffList: any, public selectedId: any, public selectedStaffId: any, public selectedStaffName: any) {
  }
}
