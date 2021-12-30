import {Component, TemplateRef, ViewChild, OnInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {TeacherService} from "../../../../services/teacher/teacher.service";

@Component({
  selector: 'app-teachers',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})

export class TeacherComponent implements OnInit {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  teachersList: any = [];
  selectedRow: any = '';
  selectedRowIndex: number;
  isEdit: boolean = false;
  name: string;

  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }

  constructor(private modalService: BsModalService, private teacherService: TeacherService) {
  }

  ngOnInit() {
    this.teacherService.getTeachersList().subscribe(result => {
      if (result) {
        this.teachersList = result;
      }
    })
  }

  addNewDropdown() {
    this.openModal(this.addDropDownValueRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  saveTeacher() {

    if (!this.name) {
      alert("please enter teacher name");
      return;
    }
    let payload = {
      "staffTeacher": this.name
    }
    this.teacherService.saveTeacherRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }

  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.teachersList.filter((item: any) => item.staffId === selectedRowItem.staffId);
    if (data && data.length > 0) {
      this.selectedRow = selectedRowItem;
    }
  }

  setSelectedRowToUpdate() {
    this.isEdit = true;
    this.name = this.selectedRow.staffTeacher;
    alert(this.selectedRow.staffTeacher);
  }

  updateSelectedRow() {
    let payload = {
      "id": this.selectedRow.id,
      "staffTeacher": this.name
    }
    this.teacherService.saveTeacherRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }

  deleteSelectedRow() {
    let payload = {
      "id": this.selectedRow.id
    }
    this.teacherService.deleteTeacherRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }
}
