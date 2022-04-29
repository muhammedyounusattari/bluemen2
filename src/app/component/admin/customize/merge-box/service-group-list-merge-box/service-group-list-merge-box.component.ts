import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivityGroupServicesService } from 'src/app/services/admin/activity-group-services.service';
import { Router } from '@angular/router';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-service-group-list-merge-box',
  templateUrl: './service-group-list-merge-box.component.html',
  styleUrls: ['./service-group-list-merge-box.component.css']
})
export class ServiceGroupListMergeBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  activityGroupList: any[];
  selectedActivityGroupId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedActivityGroupName: any;

  constructor(public dialogRef: MatDialogRef<ServiceGroupListMergeBoxComponent>, 
    private toastr: ToastrService,
    private notificationService: NotificationUtilities,
    @Inject(MAT_DIALOG_DATA) public data: ServiceGroupListMergeBoxModel, private formBuilder: FormBuilder, private _activityGroupServicesService: ActivityGroupServicesService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.activityGroupList = data.activityGroupList;
    this.selectedActivityGroupId = data.selectedActivityGroupId;
    this.selectedId = data.selectedId;
    this.selectedActivityGroupName = data.selectedActivityGroupName;

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
      let val = this.formGroup ?.get('id') ?.value.split('|')[1];
      if (val) {
        if (Number(this.selectedId) == Number(val.trim())) {
          this.toastr.info('Same activity group can not be merge!', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.formGroup.get("id") ?.setValue('');
          return;
        } else {
          this.currentValId = val.trim();
        }
      } else {
        this.toastr.info('Please select correct value!', '', {
          timeOut: 5000,
          closeButton: true
        });
        this.formGroup.get("id") ?.setValue('');
        return;
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
    let status = this.verifyServiceGroupId(this.currentValId);
    if (!status) {
      let message = "Do you want to merge activity group " + this.selectedActivityGroupName + " from No. " + this.selectedId + " to No. " + id + "?";
      const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
        data: {
          title: message,
          message: ''
        }
      });
      confirmDialog.afterClosed().subscribe(result1 => {
        if (result1 == true) {
          this._activityGroupServicesService.mergeActivityGroupById(verifyData).subscribe(result3 => {
            if (result3) {
              this.dialogRef.close(true);
            }
          });
        }
      });
    }
  }

  /**
    * @method verifyServiceGroupId
    * @description Verify the service groupId name.
    */
  verifyServiceGroupId(currentId: any) {
    currentId = Number(currentId);
    let status = false;
    const data = this.activityGroupList.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      status = false;
    } else {
      this.toastr.info('This record does not exist!', '', {
        timeOut: 5000,
        closeButton: true
      });
      this.formGroup.get("id") ?.setValue('');
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
export class ServiceGroupListMergeBoxModel {

  constructor(public title: string, public message: string, public activityGroupList: any, public selectedActivityGroupId: any, public selectedId: any, public selectedActivityGroupName: any) {
  }
}