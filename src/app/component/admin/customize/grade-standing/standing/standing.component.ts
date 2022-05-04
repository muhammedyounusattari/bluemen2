import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../../shared/services/shared.service';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { NotificationUtilities } from '../../../../../shared/utilities/notificationUtilities';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from "ng-zorro-antd/modal";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PullDownListService } from '../../../../../services/admin/pulldown-list.service';
import { ValidationClass } from '../../../../../shared/validation/common-validation-class';

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css']
})
export class StandingComponent implements OnInit {
  public dataLoading: boolean = false;
  public standingData: any;
  public standingDataList: any;
  public gradeStandingListData: any;
  public standingForm!: FormGroup;
  public standingModalVisible: boolean = false;
  public standingModalHeader: string = 'Customize Grade/Standing';
  public isConfirmStandingLoading: boolean = false;
  public gradingFiscalYearList: any = [];
  public participantList: any = [];
  public yearEndFYList: any = [];
  public ddlGroupList: any = [];
  public existingStandingData: any = {
    "id": null,
    "gradingId": null,
    "gradingName": null,
    "gradingGroupName": [],
    "gradingParticipantStatus": [],
    "gradingYearEnbStatus": [],
    "gradingFiscalYear": []
  }
  public addMode: boolean = false;
  public editMode: boolean = false;
  public selectedRow: any = null;
  public validationClass: ValidationClass = new ValidationClass();
  public standingMoveModalVisible: boolean = false;
  public ismoveItemLoading: boolean = false;
  public moveItemForm!: FormGroup;
  public selectedGradingId: any;
  public selectedId: any;
  public selectedGradingName: any;
  public currentValId: any;
  public gradeMergeModalVisible: boolean = false;
  public ismergeItemLoading: boolean = false;
  public mergeItemForm!: FormGroup;
  public gradingName: any;
  public mergeServiceid: any;

  constructor(
    private sharedService: SharedService,
    private notificationService: NotificationUtilities,
    private _gradingGroupStandingService: GradingGroupStandingService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private pullDownService: PullDownListService
  ) {
    this.initStandingForm();
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Grade/Standing List');
    this.getStandingData();
    this.bindDropDownValues();
    this._gradingGroupStandingService.getGradingGroupList('').subscribe(gradingGroupResult => {
      if (gradingGroupResult) {
        this.ddlGroupList = gradingGroupResult;
      }
    });
  }

  // applyFilter(filterValue: any) {
  //   if (filterValue.target.value.trim().toLowerCase() == 'no') {
  //     this.dataSource.filter = 'false';
  //   } else if (filterValue.target.value.trim().toLowerCase() == 'yes') {
  //     this.dataSource.filter = 'true';
  //   } else {
  //     this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  //   }
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  initStandingForm(): void {
    this.standingForm = this.fb.group({
      formLayout: ['vertical'],
      id: [null],
      gradingId: [''],
      gradingName: [null, Validators.required],
      gradingGroupName: [null, Validators.required],
      gradingFiscalYear: [null],
      gradingParticipantStatus: [null],
      gradingYearEnbStatus: [null]
    });
  }

  getStandingData(): void {
    this.dataLoading = true;
    this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
      if (result) {
        this.standingData = result;
        this.standingDataList = result;
        this.gradeStandingListData = result;
        this.dataLoading = false;
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    });
  }

  bindDropDownValues() {
    let data: any = 'FISCALYEAR,PARTICIPANT,YEAREND';
    this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
      if (result?.FISCALYEAR) {
        this.gradingFiscalYearList = result.FISCALYEAR;
      }
      if (result?.PARTICIPANT) {
        this.participantList = result.PARTICIPANT;
      }
      if (result?.YEAREND) {
        this.yearEndFYList = result.YEAREND;
      }
    });
  }

  handleStandingCancel(): void {
    this.clearStandingFormValue();
    this.standingModalVisible = false;
  }

  clearStandingFormValue() {
    for (let control in this.standingForm.controls) {
      // this.standingForm.controls[control].setErrors(null);
      this.standingForm.controls[control].markAsPristine();
      this.standingForm.controls[control].markAsUntouched();
      this.standingForm.controls[control].updateValueAndValidity();
    }
    this.existingStandingData = {
      id: null,
      gradingId: null,
      gradingName: null,
      gradingGroupName: [],
      gradingParticipantStatus: [],
      gradingYearEnbStatus: [],
      gradingFiscalYear: []
    }
    this.selectedRow = null;
  }

  addNewData(): void {
    this.standingModalVisible = true;
    this.addMode = true;
    this.editMode = false;
    this.existingStandingData = {
      id: null,
      gradingId: null,
      gradingName: null,
      gradingGroupName: [],
      gradingParticipantStatus: [],
      gradingYearEnbStatus: [],
      gradingFiscalYear: []
    }
    this._gradingGroupStandingService.getGradingStandingMaxId().subscribe(result => {
      if (!this.validationClass.isNullOrUndefined(result)) {
        this.standingForm.get('id')?.setValue(result + 1);
      } else {
        this.standingForm.get('id')?.setValue(1);
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    });
  }

  standingFormSubmit(): void {
    this.submitStandingForm(this.standingForm.value)
  }

  editStandingType(id: number): void {
    this.selectedRow = null;
    this.addMode = false;
    this.editMode = true;
    this.standingDataList.forEach((standingData: any, i: number) => {
      if (standingData.id == id) {
        this.selectedRow = standingData;
        this.existingStandingData = {
          id: standingData.id,
          gradingId: standingData.gradingId,
          gradingName: standingData.gradingName,
          gradingGroupName: [standingData.gradingGroupName],
          gradingParticipantStatus: [standingData.gradingParticipantStatus],
          gradingYearEnbStatus: [standingData.gradingYearEnbStatus],
          gradingFiscalYear: [standingData.gradingFiscalYear],
        }
      }
    });
    this.standingModalVisible = true;
  }

  submitStandingForm(frmValue: any): void {
    for (const i in this.standingForm.controls) {
      this.standingForm.controls[i].markAsDirty();
      this.standingForm.controls[i].updateValueAndValidity();
    }

    if (this.standingForm.valid) {
      this.isConfirmStandingLoading = true;
      const requestObj = {
        "id": frmValue.id,
        "gradingId": this.addMode ? frmValue.gradingId : this.selectedRow.gradingId,
        "gradingName": frmValue.gradingName.trim(),
        "gradingGroupName": frmValue.gradingGroupName[0].trim(),
        "gradingParticipantStatus": frmValue.gradingParticipantStatus[0].trim(),
        "gradingYearEnbStatus": frmValue.gradingYearEnbStatus[0].trim(),
        "gradingFiscalYear": frmValue.gradingFiscalYear[0].trim(),
      };
      if (this.addMode) {
        const ids = this.message.loading('Adding Grade/Standing List Data...', { nzDuration: 0 }).messageId;
        this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(requestObj).subscribe((result3: any) => {
          if (result3) {
            this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Grade name should be unique in all grade group name!');
            this.standingForm.get('gradingName')?.setValue('');
            this.isConfirmStandingLoading = false;
            this.message.remove(ids);
            return;
          } else {
            this._gradingGroupStandingService.postGradingStandingList(requestObj).subscribe(result => {
              if (result) {
                this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                  this.standingModalVisible = false;
                  if (result) {
                    this.standingData = result;
                    this.standingDataList = result;
                    this.gradeStandingListData = result;
                    this.notificationService.createNotificationBasic('success', "Grade/Standing List", 'Grade/Standing List Data Added Successfully!');
                    this.clearStandingFormValue();
                    this.message.remove(ids);
                    this.isConfirmStandingLoading = false;
                    this.addMode = false;
                    this.editMode = false;
                  }
                }, (error: any) => {
                  this.errorBlock(error, ids);
                });
              }
            }, (error: any) => {
              this.errorBlock(error, ids);
            });
          }
        }, (error: any) => {
          this.errorBlock(error, ids);
        });
      } else if (this.editMode) {
        const ids = this.message.loading('Updating Grade/Standing List Data...', { nzDuration: 0 }).messageId;
        this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(requestObj).subscribe(result3 => {
          if (!result3) {
            this.updateStandingData(requestObj, ids);
          } else {
            if ((this.selectedRow.gradingName.toLowerCase() == frmValue.gradingName.toLowerCase()) &&
              (this.selectedRow.gradingGroupName.toLowerCase() == frmValue.gradingGroupName[0].toLowerCase())
            ) {
              this.updateStandingData(requestObj, ids);
            } else {
              this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Grade name should be unique in all grade group name!');
              this.standingForm.get('gradingName')?.setValue('');
              this.message.remove(ids);
              this.isConfirmStandingLoading = false;
              return;
            }
          }
        }, (error: any) => {
          this.errorBlock(error, ids);
        });
      }

    }
  }

  updateStandingData(requestObj: any, ids: any): void {
    this._gradingGroupStandingService.updateGradingStandingList(requestObj).subscribe((response: any) => {
      this._gradingGroupStandingService.getGradingStandingList('').subscribe((result: any) => {
        this.standingModalVisible = false;
        if (result) {
          this.standingData = result;
          this.standingDataList = result;
          this.gradeStandingListData = result;
          this.notificationService.createNotificationBasic('success', "Grade/Standing List", 'Grade/Standing List Data Updated Successfully!');
          this.clearStandingFormValue();
          this.message.remove(ids);
          this.isConfirmStandingLoading = false;
          this.addMode = false;
          this.editMode = false;
        }
      }, (error: any) => {
        this.errorBlock(error, ids);
      });
    }, (error: any) => {
      this.errorBlock(error, ids);
    });
  }

  errorBlock(error: any, ids: any): void {
    this.clearStandingFormValue();
    this.message.remove(ids);
    this.addMode = false;
    this.editMode = false;
    this.standingModalVisible = false;
    this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    this.isConfirmStandingLoading = false;
  }

  //Delete Functionality Start
  deleteStandingData(gradingId: number, gradingName: any): void {
    const data = {
      gradingId: gradingId
    }
    const ids = this.message.loading('Deleting ' + gradingName + '...', { nzDuration: 0 }).messageId;
    this._gradingGroupStandingService.deleteGradingStandingList(data).subscribe((result: any) => {
      this._gradingGroupStandingService.getGradingStandingList('').subscribe((result: any) => {
        if (result) {
          this.standingData = result;
          this.standingDataList = result;
          this.gradeStandingListData = result;
          this.dataLoading = false;
          this.selectedRow = null;
          this.message.remove(ids);
          this.notificationService.createNotificationBasic('success', "Grade/Standing List", 'Deleted successfully!');
        }
      }, (error: any) => {
        this.message.remove(ids);
        this.notificationService.createNotificationBasic('error', "Grade/Standing List", "System error : " + error.message);
      });
    }, (error: any) => {
      this.message.remove(ids);
      this.notificationService.createNotificationBasic('error', "Grade/Standing List", "System error : " + error.message);
    });
  }

  cancelDelete(): void {

  }
  //Delete Functionality End


  //Move Function Start
  showMoveItemPopup(data: any): void {
    this.selectedRow = null;
    this.selectedRow = data;
    this.standingMoveModalVisible = true;
    this.initMoveItemForm();
    this.selectedGradingId = data.gradingId;
    this.selectedId = data.id;
    this.selectedGradingName = data.gradingName;
  }

  initMoveItemForm() {
    this.moveItemForm = this.fb.group({
      formLayout: ['vertical'],
      id: ['', Validators.required]
    });
  }

  moveFormSubmit(): void {
    this.submitMoveItemForm(this.moveItemForm.value)
  }

  moveHandleCancel(): void {
    this.clearMoveFormValue();
    this.standingMoveModalVisible = false;
  }

  clearMoveFormValue() {
    for (let control in this.moveItemForm.controls) {
      // this.moveItemForm.controls[control].setErrors(null);
      this.moveItemForm.controls[control].markAsPristine();
      this.moveItemForm.controls[control].markAsUntouched();
      this.moveItemForm.controls[control].updateValueAndValidity();
    }
  }

  submitMoveItemForm(frmValue: any): void {
    for (const i in this.moveItemForm.controls) {
      this.moveItemForm.controls[i].markAsDirty();
      this.moveItemForm.controls[i].updateValueAndValidity();
    }

    if (this.moveItemForm.valid) {
      this.currentValId = frmValue.id;
      let status = this.verifyGradeStandingId(this.currentValId);
      if (!status) {
        this.getDeletedItemById(this.currentValId);
      }
    }
  }

  verifyGradeStandingId(currentId: any) {
    let status = true;
    const data = this.gradeStandingListData.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      this.modal.confirm({
        nzTitle: 'Enter a different number as the number is already in use or To combine to lists use the merge option instead',
        nzContent: '',
        nzOnOk: () => {
          this.moveItemForm.get("id")?.setValue('');
          status = true;
        },
        nzOnCancel: () => {
          status = true;
          this.standingMoveModalVisible = false;
          this.getStandingData();
        }
      });
    } else {
      status = false;
    }
    return status;

  }

  getDeletedItemById(id: any) {
    const verifyData = {
      id: id,
      tempId: this.selectedId
    }
    this._gradingGroupStandingService.getDeletedGradingStandingById(id).subscribe(result => {
      if (result && result != null) {
        this.modal.confirm({
          nzTitle: 'Grading name was deleted for this number. Do you want to recall the old activity.',
          nzContent: '',
          nzOnOk: () => {
            const currentData = {
              gradingId: result.gradingId,
              id: result.id
            }
            this._gradingGroupStandingService.recoverGradingStandingById(currentData).subscribe(result2 => {
              if (result2) {
                this.standingMoveModalVisible = false;
                this.getStandingData();
              }
            });
          }
        });
      } else {
        this.modal.confirm({
          nzTitle: "Do you want to move grading " + this.selectedGradingName + " from No. " + this.selectedId + " to No. " + id,
          nzContent: '',
          nzOnOk: () => {
            this._gradingGroupStandingService.updateGradingStandingById(verifyData).subscribe(result3 => {
              if (result3) {
                this.standingMoveModalVisible = false;
                this.getStandingData();
              }
            });
          }
        });
      }
    });
  }

  //Move Function End

  //Merge Function Start
  showMergeItemPopup(data: any): void {
    this.selectedRow = null;
    this.selectedRow = data;
    this.gradeMergeModalVisible = true;
    this.selectedGradingId = data.gradingId;
    this.selectedId = data.id;
    this.selectedGradingName = data.gradingName;

    this.mergeServiceid = this.gradeStandingListData.filter((item: any) => item.id !== this.selectedId);
    this.initMergeItemForm();
  }

  initMergeItemForm() {
    this.mergeItemForm = this.fb.group({
      formLayout: ['vertical'],
      id: ['', Validators.required]
    });
  }

  mergeFormSubmit(): void {
    this.submitMergeItemForm(this.mergeItemForm.value)
  }

  mergeHandleCancel(): void {
    this.clearMergeFormValue();
    this.gradeMergeModalVisible = false;
  }

  clearMergeFormValue() {
    for (let control in this.mergeItemForm.controls) {
      // this.mergeItemForm.controls[control].setErrors(null);
      this.mergeItemForm.controls[control].markAsPristine();
      this.mergeItemForm.controls[control].markAsUntouched();
      this.mergeItemForm.controls[control].updateValueAndValidity();
    }
  }

  submitMergeItemForm(frmValue: any): void {
    for (const i in this.mergeItemForm.controls) {
      this.mergeItemForm.controls[i].markAsDirty();
      this.mergeItemForm.controls[i].updateValueAndValidity();
    }

    if (this.mergeItemForm.valid) {
      let val = frmValue.id;
      if (val) {
        if (Number(this.selectedId) == Number(val)) {
          this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Same grading group can not be merge!');
          this.mergeItemForm.get("id")?.setValue('');
          return;
        } else {
          this.currentValId = val;
        }
      } else {
        this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Please select correct value!');
        this.mergeItemForm.get("id")?.setValue('');
        return;
      }
      this.getMergeDeletedItemById(this.currentValId);
    }

  }

  getMergeDeletedItemById(id: any) {
    const verifyData = {
      id: this.selectedId
    }
    let status = this.verifyMergeGradeGroupId(this.currentValId);
    if (!status) {
      this.modal.confirm({
        nzTitle: "Do you want to merge grading " + this.selectedGradingName + " from No. " + this.selectedId + " to No. " + id,
        nzContent: '',
        nzOnOk: () => {
          this._gradingGroupStandingService.mergeGradingStandingById(verifyData).subscribe(result3 => {
            if (result3) {
              this.gradeMergeModalVisible = false;
              this.getStandingData();
            }
          });
        }
      });
    }
  }

  verifyMergeGradeGroupId(currentId: any) {
    currentId = Number(currentId);
    let status = false;
    const data = this.gradeStandingListData.filter((item: any) => ((item.id) === (currentId)));
    if (data && data.length > 0) {
      status = false;
    } else {
      this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'This record does not exist!');
      this.mergeItemForm.get("id")?.setValue('');
      status = true;
    }
    return status;
  }

  //Merge Function End

  //Print Function Start
  print() {
    var doc = new jsPDF('l', 'mm', 'a4');
    const head = [['Standing ID', 'Standing Name', 'Standing Group Name', 'New Grade/Standing for next Fiscal Year', 'Participant Status for next Fiscal', 'End Status for current Fiscal Year']]
    let data: any = [];
    this.gradeStandingListData.forEach((e: any) => {
      var tempObj = [];
      tempObj.push(e.id);
      tempObj.push(e.gradingName);
      tempObj.push(e.gradingGroupName);
      tempObj.push(e.gradingFiscalYear);
      tempObj.push(e.gradingParticipantStatus);
      tempObj.push(e.gradingYearEnbStatus);
      data.push(tempObj);
    });
    autoTable(doc, {
      head: head,
      body: data,
      theme: "grid",
      showHead: "everyPage",
      margin: { left: 20, right: 20, top: 30, bottom: 40 },
      startY: 25,
      headStyles: {
        fillColor: [0, 57, 107]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      tableLineColor: [208, 208, 208],
      tableLineWidth: 0.1,
      //styles : { halign : 'center'},
      bodyStyles: {
        fontSize: 12
      },
      styles: {
        cellPadding: 3
      },
      didDrawPage: function (data) {

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        //doc.text("Compansol TRIO College Listing", data.settings.margin.left, 10);
        doc.text("Compansol TRIO Grade / Standing Listing", 140, 15, {
          align: 'center'
        });

      },
      didDrawCell: (data) => { },
    });
    doc.setProperties({
      title: "Standing"
    });
    window.open(doc.output('bloburl').toString(), '_blank');
    //doc.output('dataurlnewwindow', { filename: 'standing.pdf' });
    //doc.save('college.pdf');  
  }
  //Print Function End

}


