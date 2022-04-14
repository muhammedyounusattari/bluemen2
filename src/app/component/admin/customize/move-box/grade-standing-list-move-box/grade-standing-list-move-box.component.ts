import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GradingGroupStandingService } from 'src/app/services/admin/grading-group-standing.service';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';

@Component({
  selector: 'app-grade-standing-list-move-box',
  templateUrl: './grade-standing-list-move-box.component.html',
  styleUrls: ['./grade-standing-list-move-box.component.css']
})
export class GradeStandingListMoveBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  gradeStandingList: any[];
  selectedGradingId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedGradingName: any;

  constructor(public dialogRef: MatDialogRef<GradeStandingListMoveBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: GradingListMoveBoxModel, private formBuilder: FormBuilder, private _gradingGroupStandingService: GradingGroupStandingService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.gradeStandingList = data.gradeStandingList;
    this.selectedGradingId = data.selectedGradingId;
    this.selectedId = data.selectedId;
    this.selectedGradingName = data.selectedGradingName;

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
      let status = this.verifyGradeStandingId(this.currentValId);
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
    this._gradingGroupStandingService.getDeletedGradingStandingById(id).subscribe(result => {
      if (result && result != null) {
        let message = "Grading name was deleted for this number. Do you want to recall the old activity.";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          const currentData = {
            gradingId: result.gradingId,
            id: result.id
          }
          if (result1 == true) {
            this._gradingGroupStandingService.recoverGradingStandingById(currentData).subscribe(result2 => {
              if (result2) {
                this.dialogRef.close(true);
              }
            });
          } else {
            //this.dialogRef.close(true);
          }
        });
      } else {
        let message = "Do you want to move grading " + this.selectedGradingName + " from No. " + this.selectedId + " to No. " + id;
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this._gradingGroupStandingService.updateGradingStandingById(verifyData).subscribe(result3 => {
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
    * @method verifyGradeStandingId
    * @description Verify the Grade standing name.
    */
  verifyGradeStandingId(currentId: any) {
    let status = true;
    const data = this.gradeStandingList.filter((item: any) => ((item.id) === (currentId)));
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
export class GradingListMoveBoxModel {

  constructor(public title: string, public message: string, public gradeStandingList: any, public selectedGradingId: any, public selectedId: any, public selectedGradingName: any) {
  }
}