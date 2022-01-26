import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TeacherService } from "../../../../services/teacher/teacher.service";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})

export class TeacherComponent implements OnInit {
  @ViewChild('teacherPopup') teacherPopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  teachersList: any = [];
  selectedRow: any = '';
  selectedRowIndex: any;
  isEdit: boolean = false;
  name: string;
  formGroup: FormGroup;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  }

  constructor(private modalService: BsModalService
    , private teacherService: TeacherService
    , private dialog: MatDialog
    , private toastr: ToastrService
    , private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.getTeacherList();
  }

  getTeacherList() {
    this.teacherService.getTeachersList().subscribe(result => {
      if (result) {
        this.teachersList = result;
      }
    });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required]
    });
  }

  openTeacherPopup() {
    this.createForm();
    this.openModal(this.teacherPopupRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  saveTeacher() {
    if (this.formGroup.valid) {
      let payload = {
        "staffTeacher": this.formGroup.get('name')?.value
      }
      this.teacherService.saveTeacherRecord(payload).subscribe(response => {
        if (response) {
          this.toastr.info('Saved successfully !', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.getTeacherList();
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.teachersList.filter((item: any) => item.staffId === selectedRowItem.staffId);
    if (data && data.length > 0) {
      this.selectedRow = selectedRowItem;
    }
  }

  setSelectedRowToUpdate() {
    if (this.selectedRow) {
      this.isEdit = true;
      this.formGroup.get('name')?.setValue(this.selectedRow.staffTeacher);
      this.openModal(this.teacherPopupRef);
    } else {
      this.toastr.info('Please select a row to update', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }

  updateSelectedRow() {
    if (this.formGroup.valid && this.selectedRow) {
      let payload = {
        "id": this.selectedRow.id,
        "staffTeacher": this.formGroup.get('name')?.value
      }
      this.teacherService.saveTeacherRecord(payload).subscribe(response => {
        if (response) {
          this.toastr.info('Updated Successfully !', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.getTeacherList();
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  deleteSelectedRow() {
    if (this.selectedRow) {
      let payload = {
        "id": this.selectedRow.id
      }
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm remove record',
          message: 'Are you sure, you want to remove this record: ' + this.selectedRow.activityGroupName
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.teacherService.deleteTeacherRecord(payload).subscribe(response => {
            if (response) {
              this.toastr.info('Deleted Successfully !', '', {
                timeOut: 5000,
                closeButton: true
              });
              this.getTeacherList();
            }
          });
        }
      });
    } else {
      this.toastr.info('Please select a row to delete', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }
}