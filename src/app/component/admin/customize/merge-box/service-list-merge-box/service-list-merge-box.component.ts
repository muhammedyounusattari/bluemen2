import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivityGroupServicesService } from 'src/app/services/admin/activity-group-services.service';
import { MoveMergeDialogBoxComponent } from 'src/app/shared/components/move-merge-dialog-box/move-merge-dialog-box.component';

@Component({
  selector: 'app-service-list-merge-box',
  templateUrl: './service-list-merge-box.component.html',
  styleUrls: ['./service-list-merge-box.component.css']
})
export class ServiceListMergeBoxComponent implements OnInit {

  title: string;
  message: string;
  formGroup: FormGroup;
  activityList: any[];
  selectedActivityId: any;
  selectedId: any;
  moveElement = true;
  currentValId: any;
  selectedActivityName: any;

  constructor(public dialogRef: MatDialogRef<ServiceListMergeBoxComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: ServiceListMergeBoxModel, private formBuilder: FormBuilder, private _activityGroupServicesService: ActivityGroupServicesService,
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
      let val = this.formGroup ?.get('id') ?.value.split('|')[1];
      if(val){ 
        if(Number(this.selectedId) == Number(val.trim())){
          this.toastr.info('Same activity can not be merge!', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.formGroup.get("id")?.setValue('');
          return;
        }else{
          this.currentValId =  val.trim();
        }
      }else{
        this.toastr.info('Please select correct value!', '', {
          timeOut: 5000,
          closeButton: true
        });
        this.formGroup.get("id")?.setValue('');
        return;
      }
      this.getDeletedItemById(this.currentValId);
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
      id: this.selectedId
    }
  let status = this.verifyId(this.currentValId);
   if (!status) {
      let message = "Do you want to merge activity " + this.selectedActivityName + " from No. " + this.selectedId + " to No. " + id;
        const confirmDialog = this.dialog.open(MoveMergeDialogBoxComponent, {
          data: {
            title: message,
            message: ''
          }
        });
        confirmDialog.afterClosed().subscribe(result1 => {
          if (result1 == true) {
            this._activityGroupServicesService.mergeActivityId(verifyData).subscribe(result3 => {
              if (result3) {
                this.dialogRef.close(true);
              }
            });
          }
        });
     }
  }

  verifyId(currentId: any) {
    currentId =  Number(currentId);
    let status = false;
    const data = this.activityList.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      status = false;
    }else{
      this.toastr.info('This record does not exist!', '', {
        timeOut: 5000,
        closeButton: true
      });
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
export class ServiceListMergeBoxModel {

  constructor(public title: string, public message: string, public activityList: any, public selectedActivityId: any, public selectedId: any, public selectedActivityName: any) {
  }
}