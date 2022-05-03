import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaffMembersService } from 'src/app/services/staff/staff-members.service';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';

@Component({
  selector: 'app-staff-member-move-box',
  templateUrl: './staff-member-move-box.component.html',
  styleUrls: ['./staff-member-move-box.component.css']
})
export class StaffMemberMoveBoxComponent implements OnInit {


  title: string;
  message: string;
  formGroup: FormGroup;
  staffList: any[];
  selectedStaffId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedStaffName: any;
  constructor(public dialogRef: MatDialogRef<StaffMemberMoveBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: StaffMemberMoveBoxModel, private formBuilder: FormBuilder, private staffMembersService: StaffMembersService,
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
      this.currentValId = this.formGroup?.get('staffId')?.value;
      let status = this.verifyStaffId(this.currentValId);
      if (!status) {
        this.getDeletedItemById(this.currentValId);
      }
    } else {
      this.formGroup.markAllAsTouched();
      Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      //this.staffNameErrorTip = "Please Enter Staff Name";
      return;
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
      staffId: id,
      tempId: this.selectedStaffId
    }
    this.staffMembersService.getDeletedStaffByStaffId(id).subscribe(result => {
      if (result && result != null) {
        let message = "Staff name was deleted for this number. Do you want to recall the old activity.";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          const currentData = {
            id: result.id,
            staffId: result.staffId
          }
          if (result1 == true) {
            this.staffMembersService.recoverStaffByStaffId(currentData).subscribe(result2 => {
              if (result2) {
                this.dialogRef.close(true);
              }
            });
          } else {
            //this.dialogRef.close(true);
          }
        });
      } else {
        let message = "Do you want to move staff " + this.selectedStaffName + " from No. " + this.selectedStaffId + " to No. " + id;
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this.staffMembersService.updateStaffByStaffId(verifyData).subscribe(result3 => {
              if (result3) {
                this.dialogRef.close(true);
              }
            });
          }
        });
      }
    });
  }

  /**
    * @method verifyStaffId
    * @description Verify the staff name.
    */
  verifyStaffId(currentId: any) {
    let status = true;
    const data = this.staffList.filter((item: any) => ((item.staffId) === (currentId)));
    if (data && data.length > 0) {
      // this.toastr.info('Id already exist in list please use other id', '', {
      //   timeOut: 5000,
      //   closeButton: true
      // });
      let message = "Enter a different number as the number is already in use or To combine to lists use the merge option instead";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.formGroup.get("staffId")?.setValue('');
          status = true;
        } else {
          status = true;
          this.dialogRef.close(true);
        }
      });
    } else {
      status = false;
    }
    return status;

  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class StaffMemberMoveBoxModel {

  constructor(public title: string, public message: string, public staffList: any, public selectedId: any, public selectedStaffId: any, public selectedStaffName: any) {
  }
}