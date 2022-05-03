import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { CollegeAndSchoolService } from 'src/app/services/admin/college-school.service';

/**
 * CollegeSchoolListMoveBox companent 
 */
@Component({
  selector: 'app-college-school-list-move-box',
  templateUrl: './college-school-list-move-box.component.html',
  styleUrls: ['./college-school-list-move-box.component.css']
})
export class CollegeSchoolListMoveBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  schoolCollegeDataList: any[];
  selectedCollegeSchoolId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedCollegeSchoolName: any;
  requestData: any = {
    collegeSchoolId: '',
    orgName: '',
    orgType: '',
    name: '',
    codes: '',
    address: '',
    city: '',
    country: '',
    email: '',
    fax: '',
    notes: '',
    phone1: '',
    phone2: '',
    phone3: '',
    states: '',
    title: '',
    website: '',
    zipcode: '',
    fafsaId: null,
    fiscalYear: '',
    ncesId: '',
    inPullDown: false
  };

  constructor(public dialogRef: MatDialogRef<CollegeSchoolListMoveBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: GradingListMoveBoxModel, private formBuilder: FormBuilder, private _collegeAndSchoolService: CollegeAndSchoolService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.schoolCollegeDataList = data.schoolCollegeDataList;
    this.selectedCollegeSchoolId = data.selectedCollegeSchoolId;
    this.selectedCollegeSchoolName = data.selectedCollegeSchoolName;

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
      this.currentValId = this.formGroup?.get('collegeSchoolName')?.value;
      let status = this.verifyCollegeSchoolName(this.currentValId);
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
      'collegeSchoolName': ['', Validators.required]
    });
  }

  /**
   * @method getDeletedItemById
   * @description This method is used for recover record and get deleted recodes.
   */
  getDeletedItemById(name: any) {
    const verifyData = {
      collegeSchoolId: this.selectedCollegeSchoolId,
      name: name
    }
    this.requestData.orgName = this.message.trim();
    this.requestData.name = name.toLowerCase().trim();
    this._collegeAndSchoolService.getDeletedCollegeAndSchoolByNameAndOrgId(this.requestData).subscribe(result => {
      if (result && result != null && result > 0) {
        let message = this.message + " name was deleted. Do you want to recall the old name?";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          this.requestData.collegeSchoolId = result;
          if (result1 == true) {
            this._collegeAndSchoolService.recoverCollegeAndSchoolList(this.requestData).subscribe(result2 => {
              if (result2) {
                this.dialogRef.close(true);
              }
            });
          }
        });
      } else {
        let message = "Do you want to Rename College Name from : " + this.selectedCollegeSchoolName + " to:  " + name + "?";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this._collegeAndSchoolService.updateCollegeAndSchoolNameById(verifyData).subscribe(result3 => {
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
   * @method verifyCollegeSchoolName
   * @description Verify the college and school name.
   */
  verifyCollegeSchoolName(currentName: any) {
    let status = true;
    const data = this.schoolCollegeDataList.filter((item: any) => ((item.name.toLowerCase().trim()) === (currentName.toLowerCase().trim())));
    if (data && data.length > 0) {
      let message = "Enter a different name as the name is already in use or To combine to lists use the merge option instead";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this.formGroup.get("collegeSchoolName")?.setValue('');
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

  constructor(public title: string, public message: string, public schoolCollegeDataList: any, public selectedCollegeSchoolId: any, public selectedCollegeSchoolName: any) {
  }
}
