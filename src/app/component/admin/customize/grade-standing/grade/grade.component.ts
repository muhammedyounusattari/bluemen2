import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../../shared/services/shared.service';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { NotificationUtilities } from '../../../../../shared/utilities/notificationUtilities';
import { PullDownListService } from '../../../../../services/admin/pulldown-list.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from '../../../../../shared/validation/common-validation-class';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from "ng-zorro-antd/modal";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  public gradeData: any
  public gradeDataList: any;
  public dataLoading: boolean = false;
  public gradeGroupListData: any = [];
  public gradeGroupGradeTypeList: any = [];
  public gradeGroupListSearchData: any = [];
  public gradeForm!: FormGroup;
  public gradeModalVisible: boolean = false;
  public gradeModalHeader: string = 'Customize Grade/Standing Group';
  public isConfirmGradeLoading: boolean = false;
  public existingGradeData: any = {
    "id": null,
    "gradeGroupId": null,
    "gradeGroupName": null,
    "gradeGroupGradeType": []
  }
  public addMode: boolean = false;
  public editMode: boolean = false;
  public validationClass: ValidationClass = new ValidationClass();
  public selectedRow: any = null;
  public gradeMoveModalVisible: boolean = false;
  public moveItemForm!: FormGroup;
  public ismoveItemLoading: boolean = false;

  public gradeMergeModalVisible: boolean = false;
  public ismergeItemLoading: boolean = false;
  public mergeItemForm!: FormGroup;


  public currentValId: any;
  public selectedId: any;
  public selectedGradeGroupName: any;
  public mergeServiceid: any;
  public selectedGradeGroupId: any;

  constructor(
    private sharedService: SharedService,
    private _gradingGroupStandingService: GradingGroupStandingService,
    private notificationService: NotificationUtilities,
    private pullDownService: PullDownListService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initGradeForm();
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Grade/Standing List');
    this.getGradeData();
    this.bindDropDownValues();
  }

  initGradeForm(): void {
    this.gradeForm = this.fb.group({
      formLayout: ['vertical'],
      id: [null],
      gradeGroupId: [''],
      gradeGroupName: [null, [Validators.required, Validators.minLength(3)]],
      gradeGroupGradeType: [null, [Validators.required, Validators.minLength(1)]]
    });
  }

  get isHorizontal(): boolean {
    return this.gradeForm.controls.formLayout?.value === 'vertical';
  }

  getGradeData(): void {
    this.dataLoading = true;
    this._gradingGroupStandingService.getGradingGroupList('').subscribe((result: any) => {
      if (result) {
        this.gradeData = result;
        this.gradeDataList = result;
        this.dataLoading = false;
        this.gradeGroupListData = result;
        this.gradeGroupListSearchData = result;
      }

    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    });
  }

  bindDropDownValues() {
    let data: any = 'STANDINGGROUPTYPE';
    this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
      if (result?.STANDINGGROUPTYPE) {
        this.gradeGroupGradeTypeList = result.STANDINGGROUPTYPE;
      }
    });
  }

  handleCancel(): void {
    this.clearGradeFormValue();
    this.gradeModalVisible = false;
  }

  clearGradeFormValue() {
    for (let control in this.gradeForm.controls) {
      // this.confirmValidateForm.controls[control].setErrors(null);
      this.gradeForm.controls[control].markAsPristine();
      this.gradeForm.controls[control].markAsUntouched();
      this.gradeForm.controls[control].updateValueAndValidity();
    }
    this.existingGradeData = {
      id: null,
      gradeGroupId: null,
      gradeGroupName: null,
      gradeGroupGradeType: []
    }
    this.selectedRow = null;
  }

  addNewData(): void {
    this.gradeModalVisible = true;
    this.addMode = true;
    this.editMode = false;
    this.existingGradeData = {
      id: null,
      gradeGroupName: null,
      gradeGroupId: null,
      gradeGroupGradeType: []
    }
    this._gradingGroupStandingService.getGradingGroupMaxId().subscribe(result => {
      if (!this.validationClass.isNullOrUndefined(result)) {
        this.gradeForm.get('id')?.setValue(result + 1);
      } else {
        this.gradeForm.get('id')?.setValue(1);
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    });
  }

  gradeFormSubmit(): void {
    this.submitGradeForm(this.gradeForm.value)
  }

  editGradeType(id: number): void {
    this.selectedRow = null;
    this.addMode = false;
    this.editMode = true;
    this.gradeDataList.forEach((gradeData: any, i: number) => {
      if (gradeData.id == id) {
        this.selectedRow = gradeData;
        this.existingGradeData = {
          id: gradeData.id,
          gradeGroupId: gradeData.gradeGroupId,
          gradeGroupName: gradeData.gradeGroupName,
          gradeGroupGradeType: [gradeData.gradeGroupGradeType]
        }
      }
    });
    this.gradeModalVisible = true;
  }

  submitGradeForm(frmValue: any): void {
    for (const i in this.gradeForm.controls) {
      this.gradeForm.controls[i].markAsDirty();
      this.gradeForm.controls[i].updateValueAndValidity();
    }
    if (this.gradeForm.valid) {
      this.isConfirmGradeLoading = true;
      const requestObj = {
        "id": frmValue.id,
        "gradeGroupId": this.addMode ? frmValue.gradeGroupId : this.selectedRow.gradeGroupId,
        "gradeGroupName": frmValue.gradeGroupName,
        "gradeGroupGradeType": frmValue.gradeGroupGradeType[0],
        "gradeGroupAprColumn": frmValue.gradeGroupGradeType[0]
      };
      if (this.addMode) {
        const ids = this.message.loading('Adding Grade/Standing List Data...', { nzDuration: 0 }).messageId;
        this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(requestObj).subscribe((res: any) => {
          if (res) {
            this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Grade group name should be unique!');
            this.gradeForm.get('gradeGroupName')?.setValue('');
            this.isConfirmGradeLoading = false;
            this.message.remove(ids);
            return;
          } else {
            this._gradingGroupStandingService.postGradingGroupList(requestObj).subscribe(result => {
              if (result) {
                this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                  this.gradeModalVisible = false;
                  if (result) {
                    this.gradeData = result;
                    this.gradeDataList = result;
                    this.gradeGroupListData = result;
                    this.gradeGroupListSearchData = result;
                    this.notificationService.createNotificationBasic('success', "Grade/Standing List", 'Grade/Standing List Data Added Successfully!');
                    this.clearGradeFormValue();
                    this.message.remove(ids);
                    this.isConfirmGradeLoading = false;
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
        this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(requestObj).subscribe(result3 => {
          if (!result3) {
            this.updateGradeData(requestObj, ids);
          } else {
            if ((this.selectedRow.gradeGroupName.toLowerCase() == frmValue.gradeGroupName.toLowerCase()) &&
              (this.selectedRow.gradeGroupGradeType.toLowerCase() == frmValue.gradeGroupGradeType[0].toLowerCase())
            ) {
              this.updateGradeData(requestObj, ids);
            } else {
              this.notificationService.createNotificationBasic('info', "Grade/Standing List", 'Grade group name should be unique!');
              this.gradeForm.get('gradeGroupName')?.setValue('');
              this.message.remove(ids);
              this.isConfirmGradeLoading = false;
              return;
            }
          }
        }, (error: any) => {
          this.errorBlock(error, ids);
        });
      }

    }
  }

  errorBlock(error: any, ids: any): void {
    this.clearGradeFormValue();
    this.message.remove(ids);
    this.addMode = false;
    this.editMode = false;
    this.gradeModalVisible = false;
    this.notificationService.createNotificationBasic('error', 'Grade/Standing List', "System error : " + error.message);
    this.isConfirmGradeLoading = false;
  }

  updateGradeData(requestObj: any, ids: any): void {
    this._gradingGroupStandingService.updateGradingGroupList(requestObj).subscribe((response: any) => {
      this._gradingGroupStandingService.getGradingGroupList('').subscribe((result: any) => {
        this.gradeModalVisible = false;
        if (result) {
          //new
          this.gradeData = result;
          this.gradeDataList = result;
          this.gradeGroupListData = result;
          this.gradeGroupListSearchData = result;
          this.notificationService.createNotificationBasic('success', "Grade/Standing List", 'Grade/Standing List Data Updated Successfully!');
          this.clearGradeFormValue();
          this.message.remove(ids);
          this.isConfirmGradeLoading = false;
          this.addMode = false;
          this.editMode = false;
          //end
        }
      }, (error: any) => {
        this.errorBlock(error, ids);
      });
    }, (error: any) => {
      this.errorBlock(error, ids);
    });
  }

  deleteGradeData(gradeGroupId: number, groupName: any): void {
    const data = {
      gradeGroupId: gradeGroupId
    }
    const ids = this.message.loading('Deleting ' + groupName + '...', { nzDuration: 0 }).messageId;
    this._gradingGroupStandingService.deleteGradingGroupList(data).subscribe((result: any) => {
      this._gradingGroupStandingService.getGradingGroupList('').subscribe((result: any) => {
        if (result) {
          this.gradeData = result;
          this.gradeDataList = result;
          this.dataLoading = false;
          this.gradeGroupListData = result;
          this.gradeGroupListSearchData = result;
          this.message.remove(ids);
          this.selectedRow = null;
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

  //Move Function Start
  showMoveItemPopup(data: any): void {
    this.selectedRow = null;
    this.selectedRow = data;
    this.gradeMoveModalVisible = true;
    this.initMoveItemForm();
    this.selectedId = data.id;
    this.selectedGradeGroupName = data.gradeGroupName;
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
    this.gradeMoveModalVisible = false;
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
      let status = this.verifyGradeGroupId(this.currentValId);
      if (!status) {
        this.getDeletedItemById(this.currentValId);
      }
    }
  }

  verifyGradeGroupId(currentId: any) {
    let status = true;
    const data = this.gradeGroupListData.filter((item: any) => ((item.id) === (currentId)));
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
          this.gradeMoveModalVisible = false;
          this.getGradeData();
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
    this._gradingGroupStandingService.getDeletedGradingGroupById(id).subscribe(result => {
      if (result && result != null) {
        this.modal.confirm({
          nzTitle: 'Grade group name was deleted for this number. Do you want to recall the old grade group?',
          nzContent: '',
          nzOnOk: () => {
            const currentData = {
              gradeGroupId: result.GradeGroupId,
              id: result.id
            }
            this._gradingGroupStandingService.recoverGradingGroupById(currentData).subscribe(result2 => {
              if (result2) {
                this.gradeMoveModalVisible = false;
                this.getGradeData();
              }
            });
          }
        });
      } else {
        this.modal.confirm({
          nzTitle: "Do you want to move grade group " + this.selectedGradeGroupName + " from No. " + this.selectedId + " to No. " + id + "?",
          nzContent: '',
          nzOnOk: () => {
            this._gradingGroupStandingService.updateGradingGroupById(verifyData).subscribe(result3 => {
              if (result3) {
                this.gradeMoveModalVisible = false;
                this.getGradeData();
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
    this.selectedId = data.id;
    this.selectedGradeGroupName = data.gradeGroupName;
    this.selectedGradeGroupId = data.gradeGroupId;
    this.mergeServiceid = this.gradeGroupListData.filter((item: any) => item.id !== this.selectedId);
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
        nzTitle: "Do you want to merge grade group " + this.selectedGradeGroupName + " from No. " + this.selectedId + " to No. " + id + "?",
        nzContent: '',
        nzOnOk: () => {
          this._gradingGroupStandingService.mergeGradingGroupById(verifyData).subscribe(result3 => {
            if (result3) {
              this.gradeMergeModalVisible = false;
              this.getGradeData();
            }
          });
        }
      });
    }
  }

  verifyMergeGradeGroupId(currentId: any) {
    currentId = Number(currentId);
    let status = false;
    const data = this.gradeGroupListData.filter((item: any) => ((item.id) === (currentId)));
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
    const head = [['Standing Group ID', 'Standing Group Name', 'Standing Group APR']]
    let data: any = [];
    this.gradeGroupListData.forEach((e: any) => {
      var tempObj = [];
      tempObj.push(e.id);
      tempObj.push(e.gradeGroupName);
      tempObj.push(e.gradeGroupAprColumn);
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
        doc.text("Compansol TRIO Standing Group Listing", 140, 15, {
          align: 'center'
        });

      },
      didDrawCell: (data) => { },
    });
    doc.setProperties({
      title: "Standing Group"
    });
    window.open(doc.output('bloburl').toString(), '_blank');
    //doc.output('dataurlnewwindow', { filename: 'standingGroup.pdf' });
    //doc.save('college.pdf');  
  }
  //Print Function End

  /**
    * @method applyFilter
    * @description search the text from list
    */
   applyFilter(search: any) {
    const targetValue: any[] = [];
   this.gradeGroupListSearchData.forEach((value: any) => {
     //let keys = Object.keys(value);
     let keys = ["id","gradeGroupName","gradeGroupGradeType"];
     for (let i = 0; i < keys.length; i++) {
       if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
         targetValue.push(value);
         break;
       }
     }
   });
   this.gradeData = targetValue;
}

}
