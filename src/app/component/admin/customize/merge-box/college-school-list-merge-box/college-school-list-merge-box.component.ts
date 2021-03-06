import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { CollegeAndSchoolService } from 'src/app/services/admin/college-school.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
/**
 * CollegeSchoolListMergeBox component
 */
@Component({
  selector: 'app-college-school-list-merge-box',
  templateUrl: './college-school-list-merge-box.component.html',
  styleUrls: ['./college-school-list-merge-box.component.css']
})
export class CollegeSchoolListMergeBoxComponent implements OnInit {
  title: string;
  message: string;
  formGroup: FormGroup;
  collegeSchoolIdList: any[];
  selectedCollegeSchoolId: any;
  moveElement = true;
  currentValId: any;
  selectedCollegeSchoolName: any;

  constructor(public dialogRef: MatDialogRef<CollegeSchoolListMergeBoxComponent>,
    private notificationService: NotificationUtilities,
    @Inject(MAT_DIALOG_DATA) public data: CollegeSchoolListMergeBoxModel,
    private formBuilder: FormBuilder,
    private _collegeAndSchoolService: CollegeAndSchoolService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.collegeSchoolIdList = data.collegeSchoolIdList;
    this.selectedCollegeSchoolId = data.selectedCollegeSchoolId;
    this.selectedCollegeSchoolName = data.selectedCollegeSchoolName;

  }

  /**
  * @method ngOnInit
  * @description Verify the college and school name.
  */
  ngOnInit() {
    this.createForm();
  }

  /**
   * @method ngOnInit
   * @description call all methods
   */
  onConfirm(): void {
    // Close the dialog, return true
    if (this.formGroup.valid) {
      let val = this.formGroup?.get('collegeSchoolName')?.value;
      if (this.selectedCollegeSchoolName.trim() == val.trim()) {
        this.notificationService.createNotificationBasic('info', "info", 'Same Name can not be merge!');
        this.formGroup.get("collegeSchoolName")?.setValue('');
        return;
      } else {
        this.currentValId = val.trim();
      }
      this.getDeletedItemById(this.currentValId);
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
      'collegeSchoolName': ['', Validators.required]
    });
  }

  /**
   * @method getDeletedItemById
   * @description This method is used for merge the college school by name.
   */
  getDeletedItemById(currentName: any) {
    const verifyData = {
      collegeSchoolId: this.selectedCollegeSchoolId
    }
    let status = this.verifyCollegeSchoolName(this.currentValId);
    if (!status) {
      let message = "Do you want to merge from name " + this.selectedCollegeSchoolName + " to name " + currentName + " ?";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this._collegeAndSchoolService.mergeCollegeSchoolByName(verifyData).subscribe(result3 => {
            if (result3) {
              this.dialogRef.close(true);
            }
          });
        }
      });
    }
  }

  /**
  * @method verifyCollegeSchoolName
  * @description This method is used for verify the college school name.
  */
  verifyCollegeSchoolName(currentName: any) {
    let status = false;
    const data = this.collegeSchoolIdList.filter((item: any) => ((item.name.trim()) === (currentName.trim())));
    if (data && data.length > 0) {
      status = false;
    } else {
      this.notificationService.createNotificationBasic('info', "info", 'This record does not exist!');
      this.formGroup.get("collegeSchoolName")?.setValue('');
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
export class CollegeSchoolListMergeBoxModel {

  constructor(public title: string, public message: string, public collegeSchoolIdList: any, public selectedCollegeSchoolId: any, public selectedCollegeSchoolName: any) {
  }
}