import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from 'src/app/services/admin/grading-group-standing.service';
import { ToastrService } from 'ngx-toastr';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';

@Component({
  selector: 'app-grade-standing-group-list-move-box',
  templateUrl: './grade-standing-group-list-move-box.component.html',
  styleUrls: ['./grade-standing-group-list-move-box.component.css']
})
export class GradeStandingGroupListMoveBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  gradeGroupList: any[];
  selectedGradeGroupId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedGradeGroupName: any;

  constructor(public dialogRef: MatDialogRef<GradeStandingGroupListMoveBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: GradingGroupListMoveBoxModel, private formBuilder: FormBuilder, private _gradingGroupStandingService: GradingGroupStandingService,
    private dialog: MatDialog, private router: Router) {
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
      this.currentValId = this.formGroup ?.get('id') ?.value;
      let status = this.verifyGradeGroupId(this.currentValId);
      if (!status) {
        this.getDeletedItemById(this.currentValId);
      }
    } else {
      this.formGroup.markAllAsTouched();
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
      id: id,
      tempId: this.selectedId
    }
    this._gradingGroupStandingService.getDeletedGradingGroupById(id).subscribe(result => {
      if (result && result != null) {
        let message = "Grade group name was deleted for this number. Do you want to recall the old grade group?";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          const currentData = {
            gradeGroupId: result.GradeGroupId,
            id: result.id
          }
          if (result1 == true) {
            this._gradingGroupStandingService.recoverGradingGroupById(currentData).subscribe(result2 => {
              if (result2) {
                this.dialogRef.close(true);
              }
            });
          }
        });
      } else {
        let message = "Do you want to move grade group " + this.selectedGradeGroupName + " from No. " + this.selectedId + " to No. " + id + "?";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this._gradingGroupStandingService.updateGradingGroupById(verifyData).subscribe(result3 => {
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
     * @method verifyGradeGroupId
     * @description Verify the grade groupId name.
     */
  verifyGradeGroupId(currentId: any) {
    let status = true;
    const data = this.gradeGroupList.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      let message = "Enter a different number as the number is already in use or To combine to lists use the merge option instead";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.formGroup.get("id") ?.setValue('');
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
export class GradingGroupListMoveBoxModel {

  constructor(public title: string, public message: string, public gradeGroupList: any, public selectedGradeGroupId: any, public selectedId: any, public selectedGradeGroupName: any) {
  }
}