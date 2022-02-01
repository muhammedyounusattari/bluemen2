import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GraduatedListService } from 'src/app/services/utilities/graduated-list.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';

@Component({
    selector: 'app-graduated-list',
    templateUrl: './graduated-list.component.html',
    styleUrls: ['./graduated-list.component.css']
})
export class GraduatedListComponent implements OnInit {
  @Output() navigateToStudentPage: EventEmitter<any> = new EventEmitter();
  @Input() studentList: any[] = [];
  @Input() selectedGraduatedYear: any = '';
  public studentGraduatedEditModalForm: FormGroup;
  public studentAddressNotesForm: FormGroup;
  public studentSSNOs: any[] = []
  public counselorsList: any = [];
  public cityList: any = [];
  public stateList: any = [];
  public graduatedYear = new FormControl();
  @ViewChild('graduatedStudentEditPopup')
  graduatedStudentEditPopupRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl',
  };

  constructor(private router: Router, private service: GraduatedListService, private modalService: BsModalService,
    private toastr: ToastrService, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.studentList) {
      this.studentList?.forEach((element: any) => {
        console.log(element);

        if (element && element.ssno) {
          this.studentSSNOs.push(element.ssno);
        }
      });
    }
    this.graduatedYear.setValue(this.selectedGraduatedYear);
    this.initializeGraduatedForm();
    this.initializeAddressForm();
  }

  /**
   * @method openModal
   */
   public openModal() {
    this.patchValuesToForm();
    this.getStateList();
    this.getCityList();
    this.modalRef = this.modalService.show(
      this.graduatedStudentEditPopupRef,
      this.modalConfigSM
    );
  }

  /**
   * @method initializeGraduatedForm
   */
   public initializeGraduatedForm() {
    this.studentGraduatedEditModalForm = this.fb.group({
      counselor: [''],
      degreeIn: [''],
      employer: [''],
      titleOrPosition: [''],
      militaryType: [''],
      graduatedYear: [new Date().getFullYear()],
      militaryRank: [''],
      track: [false],
      major: [''],
      graduatedEducationStatus: [''],
      employmentType: ['']
    });
  }

  /**
   * @method initializeAddressForm
   */
   public initializeAddressForm() {
    this.studentAddressNotesForm = this.fb.group({
      address: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      phone1: [''],
      phone2: [''],
      website: [''],
      email: [''],
      notes: ['']
    });
  }

  /**
   * @method getStaffList
   */
   public getStaffList() {
    this.service.getStaffList().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element.staffCounselor && element.staffName) {
            this.counselorsList.push(element.staffName);
          }
        });
      }
    });
  }

  /**
   * @method getStateList
   */
   public getStateList() {
    this.service.getStateList().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element && element.name && element.code) {
            this.stateList.push({ name: element.name, code: element.code });
          }
        });
      }
    });
  }

  /**
   * @method getCityList
   */
  public getCityList() {
    this.service.getCityList().subscribe((result: any) => {
      if (result && result.length > 0) {
        result.forEach((element: any) => {
          if (element && element.name && element.code) {
            this.cityList.push({ name: element.name, code: element.code });
          }
        });
      }
    });
  }

  /**
   * @method deleteStudentRecord
   */
  public deleteStudentRecord() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm remove record',
        message: `Are you sure, you want to delete ${this.studentList[0]?.firstName}
        ${this.studentList[0]?.lastName} information?`,
      },
    });
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.service.deleteStudent({ ssno: this.studentList[0]?.ssno })
          .subscribe((result: any) => {});
      }
    });
  }

  /**
   * @method updateGraduatedYearForStudents
   */
  public updateGraduatedYearForStudents() {
    this.service.updateGraduatedYear(this.requestPayload()).subscribe(resp => {
      if (resp) {
        this.toastr.success(
          `${this.studentList.length} Student added to the graduated year ${this.graduatedYear.value}`,
          '', {
            timeOut: 1000,
            closeButton: true,
          }
        );
        setTimeout(() => {
          this.openModal();
        }, 1000);
      }
    })
  }

  /**
   * @method navigateToHome
   */
  public navigateToHome() {
    this.router.navigate(['/']);
  }

  /**
   * @method updateStudentGraduatedInformation
   */
  public updateStudentGraduatedInformation() {
    this.service.updateGraduatedInformation(this.updatePayload()).subscribe(resp => {
      if (resp) {
        this.toastr.success(`Student graduated information updated successfully`,
          '', {
            timeOut: 100,
            closeButton: true,
          }
        );
        setTimeout(() => {
          this.navigateToHome();
        }, 100);
      }
    })
  }

  /**
   * @method requestPayload
   */
  public requestPayload() {
    return {
      fiscalYear: this.graduatedYear.value,
      ssnoList: this.studentSSNOs
    }
  }

  /**
   * @method patchValuesToForm
   */
   public patchValuesToForm() {
    this.studentGraduatedEditModalForm.patchValue({
      counselor: this.studentList[0]?.graduatedInformation?.counselor,
      degreeIn: this.studentList[0]?.graduatedInformation?.degreeIn,
      employer: this.studentList[0]?.graduatedInformation?.employer,
      titleOrPosition:
        this.studentList[0]?.graduatedInformation?.titleOrPosition,
      militaryType: this.studentList[0]?.graduatedInformation?.militaryType,
      graduatedYear: this.studentList[0]?.graduatedInformation?.graduatedYear,
      militaryRank: this.studentList[0]?.graduatedInformation?.militaryRank,
      track: this.studentList[0]?.graduatedInformation?.track
        ? JSON.parse(this.studentList[0]?.graduatedInformation?.track)
        : false,
      major: this.studentList[0]?.graduatedInformation?.major,
      graduatedEducationStatus:
        this.studentList[0]?.graduatedInformation?.graduatedEducationStatus,
      employmentType:
        this.studentList[0]?.graduatedInformation?.employmentType,
    });

    this.studentAddressNotesForm.patchValue({
      address:
        this.studentList[0]?.graduatedInformation?.addressNotes?.address,
      city: this.studentList[0]?.graduatedInformation?.addressNotes?.city,
      state: this.studentList[0]?.graduatedInformation?.addressNotes?.state,
      zipcode:
        this.studentList[0]?.graduatedInformation?.addressNotes?.zipcode,
      phone1: this.studentList[0]?.graduatedInformation?.addressNotes?.phone1,
      phone2: this.studentList[0]?.graduatedInformation?.addressNotes?.phone2,
      website:
        this.studentList[0]?.graduatedInformation?.addressNotes?.website,
      email: this.studentList[0]?.graduatedInformation?.addressNotes?.email,
      notes: this.studentList[0]?.graduatedInformation?.addressNotes?.notes,
    });
  }

  /**
   * @method updatePayload
   * @description create the request payload for API's
   */
   public updatePayload() {
    let formValue = this.studentGraduatedEditModalForm.value;
    formValue = {
      ...formValue,
      ...{ addressNotes: this.studentAddressNotesForm.value },
    };
    return {
      ...this.studentList[0],
      ...{ graduatedInformation: formValue },
    };
  }
}
