import { Component, OnInit, Inject } from '@angular/core';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivityGroupServicesService } from 'src/app/services/admin/activity-group-services.service';

@Component({
  selector: 'app-service-list-move-box',
  templateUrl: './service-list-move-box.component.html',
  styleUrls: ['./service-list-move-box.component.css']
})
export class ServiceListMoveBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  activityList: any[];
  selectedActivityId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedActivityName: any;

  constructor(public dialogRef: MatDialogRef<ServiceListMoveBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: ServiceListMoveBoxModel, private formBuilder: FormBuilder, private _activityGroupServicesService: ActivityGroupServicesService,
    private dialog: MatDialog, private router: Router) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.activityList = data.activityList;
    this.selectedActivityId = data.selectedActivityId;
    this.selectedId = data.selectedId;
    this.selectedActivityName = data.selectedActivityName;

  }

  ngOnInit() {
    this.createForm();
  }

  onConfirm(): void {
    // Close the dialog, return true
    if (this.formGroup.valid) {
      this.currentValId = this.formGroup ?.get('id') ?.value;
      let status = this.verifyId(this.currentValId);
      if (!status) {
        this.getDeletedItemById(this.currentValId);
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'id': ['', Validators.required]
    });
  }

  getDeletedItemById(id: any) {
    const verifyData = {
      id: id,
      tempId: this.selectedId
    }
    this._activityGroupServicesService.getDeletedActivityById(id).subscribe(result => {
      if (result && result != null) {
        let message = "Activity name was deleted for this number. Do you want to recall the old activity.";
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          const currentData = {
            activityId: result.activityId,
            id: result.id
          }
          if (result1 == true) {
            this._activityGroupServicesService.recoverActivityById(currentData).subscribe(result2 => {
              if (result2) {
                this.dialogRef.close(true);
              }
            });
          } else {
            //this.dialogRef.close(true);
          }
        });
      } else {
        let message = "Do you want to move activity " + this.selectedActivityName + " from No. " + this.selectedId + " to No. " + id;
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this._activityGroupServicesService.updateActivityById(verifyData).subscribe(result3 => {
              if (result3) {
                this.dialogRef.close(true);
              }
            });
          }
        });
      }
    });
  }

  verifyId(currentId: any) {
    let status = true;
    const data = this.activityList.filter((item: any) => ((item.id) === (currentId)));
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
export class ServiceListMoveBoxModel {

  constructor(public title: string, public message: string, public activityList: any, public selectedActivityId: any, public selectedId: any, public selectedActivityName: any) {
  }
}
