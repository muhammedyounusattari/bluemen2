import {Component, TemplateRef, ViewChild, OnInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {TeacherService} from "../../../../services/teacher/teacher.service";
import {TutorService} from "../../../../services/tutors/tutor.service";

@Component({
  selector: 'app-tutors',
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.css']
})

export class TutorsComponent implements OnInit {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  tutorsList: any = [];
  selectedRow: any = '';
  selectedRowIndex: number;
  isEdit: boolean = false;
  name: string;

  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }

  constructor(private modalService: BsModalService, private tutorService: TutorService) {
  }

  ngOnInit() {
    this.tutorService.getTutorsList().subscribe(result => {
      if (result) {
        this.tutorsList = result;
      }
    })
  }

  addNewDropdown() {
    this.openModal(this.addDropDownValueRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  saveTutor() {

    if (!this.name) {
      alert("please enter tutor name");
      return;
    }
    let payload = {
      "staffTeacher": this.name
    }
    this.tutorService.saveTutorRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }

  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.tutorsList.filter((item: any) => item.staffId === selectedRowItem.staffId);
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
    this.tutorService.saveTutorRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }

  deleteSelectedRow() {
    let payload = {
      "id": this.selectedRow.id
    }
    this.tutorService.deleteTutorRecord(payload).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    });
  }
}
