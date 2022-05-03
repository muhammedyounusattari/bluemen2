import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { GradingGroupStandingService } from 'src/app/services/admin/grading-group-standing.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-grade-standing-group-list-merge-box',
  templateUrl: './grade-standing-group-list-merge-box.component.html',
  styleUrls: ['./grade-standing-group-list-merge-box.component.css']
})
export class GradeStandingGroupListMergeBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  gradeGroupList: any[];
  selectedGradeGroupId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedGradeGroupName: any;

  constructor(public dialogRef: MatDialogRef<GradeStandingGroupListMergeBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeGroupListMergeBoxModel, private formBuilder: FormBuilder, private _gradingGroupStandingService: GradingGroupStandingService,
    private dialog: MatDialog, private notificationService: NotificationUtilities) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.gradeGroupList = data.gradeGroupList;
    this.selectedGradeGroupId = data.selectedGradeGroupId;
    this.selectedId = data.selectedId;
    this.selectedGradeGroupName = data.selectedGradeGroupName;

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
      let val = this.formGroup?.get('id')?.value.split('|')[1];
      if (val) {
        if (Number(this.selectedId) == Number(val.trim())) {
          this.notificationService.createNotificationBasic('info', "info", 'Same grading group can not be merge!');
          this.formGroup.get("id")?.setValue('');
          return;
        } else {
          this.currentValId = val.trim();
        }
      } else {
        this.notificationService.createNotificationBasic('info', "info", 'Please select correct value!');
        this.formGroup.get("id")?.setValue('');
        return;
      }
      this.getDeletedItemById(this.currentValId);
    } else {
      Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
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
      'id': ['', Validators.required]
    });
  }

  /**
   * @method getDeletedItemById
   * @description This method is used for recover record and get deleted recodes.
   */
  getDeletedItemById(id: any) {
    const verifyData = {
      id: this.selectedId
    }
    let status = this.verifyGradeGroupId(this.currentValId);
    if (!status) {
      let message = "Do you want to merge grade group " + this.selectedGradeGroupName + " from No. " + this.selectedId + " to No. " + id + "?";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this._gradingGroupStandingService.mergeGradingGroupById(verifyData).subscribe(result3 => {
            if (result3) {
              this.dialogRef.close(true);
            }
          });
        }
      });
    }
  }

  /**
     * @method verifyGradeGroupId
     * @description Verify the grade groupId name.
     */
  verifyGradeGroupId(currentId: any) {
    currentId = Number(currentId);
    let status = false;
    const data = this.gradeGroupList.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      status = false;
    } else {
      this.notificationService.createNotificationBasic('info', "info", 'This record does not exist!');
      this.formGroup.get("id")?.setValue('');
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
export class GradeGroupListMergeBoxModel {

  constructor(public title: string, public message: string, public gradeGroupList: any, public selectedGradeGroupId: any, public selectedId: any, public selectedGradeGroupName: any) {
  }
}