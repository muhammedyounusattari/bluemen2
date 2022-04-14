import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-move-merge-dialog-box',
  templateUrl: './move-merge-dialog-box.component.html',
  styleUrls: ['./move-merge-dialog-box.component.css']
})
export class MoveMergeDialogBoxComponent implements OnInit {

  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<MoveMergeDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MoveMergeDialogBoxModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return false
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class MoveMergeDialogBoxModel {

  constructor(public title: string, public message: string) {
  }
}