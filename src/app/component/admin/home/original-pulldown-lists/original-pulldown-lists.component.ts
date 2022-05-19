import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OriginalPullDownListsService } from '../../../../services/admin/original-pulldown-lists.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from '../../../../shared/utilities/notificationUtilities';
import { SharedService } from '../../../../shared/services/shared.service';
import { ValidationClass } from '../../../../shared/validation/common-validation-class';

@Component({
  selector: 'app-original-pulldown-lists',
  templateUrl: './original-pulldown-lists.component.html',
  styleUrls: ['./original-pulldown-lists.component.css']
})
export class OriginalPulldownListsComponent implements OnInit {
  public dataLoading: boolean = false;
  public originalPullDownForm!: FormGroup;
  public addPullDownListsForm!: FormGroup;
  public originalPullDownData: any;
  public originalPullDownDataList: any;
  public orgId: any;
  public programList: any = [
    {
      id: 1,
      value: 'TS'
    },
    {
      id: 2,
      value: 'EOC'
    },
    {
      id: 3,
      value: 'UB'
    },
    {
      id: 4,
      value: 'VUB'
    },
    {
      id: 5,
      value: 'UBMS'
    },
    {
      id: 6,
      value: 'SSSDEMO'
    },
    {
      id: 7,
      value: 'MCN'
    }
  ]
  public existingPullDownData: any = {
    pulldownNumber: null,
    pulldownName: null,
  }
  public selectedProgram: any = null;
  public selectedPulltype: any = null;
  public pullTypeList: any;
  public validationClass: ValidationClass = new ValidationClass();
  public resetProcess: boolean = false;
  public addModalVisible: boolean = false;
  public addPullDownLoading: boolean = false;
  public pageTitle: string = 'Loading Original Pulldown Lists';
  public isSpinning: boolean = false;
  public addMode: boolean = false;
  public editMode: boolean = false;
  public editPullId: any = null;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private _pullDownListsService: OriginalPullDownListsService,
    private message: NzMessageService,
    private notificationService: NotificationUtilities
  ) {
    this.initForm();
    this.initAddForm();
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Original Pulldown Lists');
    //this.orgId = this.sharedService.getOrgId();
    this.selectedProgram = this.programList[0].id;
  }

  initForm(): void {
    this.originalPullDownForm = this.fb.group({
      formLayout: ['horizontal'],
      programType: [null, [Validators.required]],
      pullType: [null, [Validators.required]]
    });
  }

  programChange(value: number): void {
    this.originalPullDownData = [];
    this.isSpinning = true;
    this.selectedPulltype = null;
    if (!this.validationClass.isNullOrUndefined(value)) {
      this._pullDownListsService.getPullTypeList(value).subscribe((result: any) => {
        if (result) {
          this.pullTypeList = result;
          this.isSpinning = false;
        }
      }, (error: any) => {
        this.notificationService.createNotificationBasic('error', 'Pull Type Information', "System error : " + error.message);
      });
    } else {
      this.pullTypeList = [];
    }
  }

  searchPullDownLists(): void {
    this.searchPullDownListsForm(this.originalPullDownForm.value);
  }

  searchPullDownListsForm(frmValue: any): void {
    for (const i in this.originalPullDownForm.controls) {
      this.originalPullDownForm.controls[i].markAsDirty();
      this.originalPullDownForm.controls[i].updateValueAndValidity();
    }
    if (this.originalPullDownForm.valid) {
      this.dataLoading = true;
      const requestObj = {
        "orgId": 0,
        "projType": frmValue.programType,
        "pullType": frmValue.pullType
      };
      this.isSpinning = true;
      this._pullDownListsService.searchOriginalPullDownLists(requestObj).subscribe((res: any) => {
        if (res) {
          this.originalPullDownData = res;
          this.originalPullDownDataList = res;
          this.dataLoading = false;
          this.notificationService.createNotificationBasic('success', "Original Pulldown Lists", 'Original Pulldown Lists Fetched Successfully!');
          this.isSpinning = false;
        }
      }, (error: any) => {
        this.notificationService.createNotificationBasic('error', 'Original Pulldown Lists', "System error : " + error.message);
        this.isSpinning = false;
      });
    }
  }

  addNewData(): void {
    for (const i in this.originalPullDownForm.controls) {
      this.originalPullDownForm.controls[i].markAsDirty();
      this.originalPullDownForm.controls[i].updateValueAndValidity();
    }
    if (this.originalPullDownForm.valid) {
      this.addModalVisible = true;
      this.existingPullDownData = {
        pulldownNumber: null,
        pulldownName: null,
      }
      this.addMode = true;
      this.editMode = false;
    } else {
      this.notificationService.createNotificationBasic('error', 'Original Pulldown Lists', "Please Select Pulltype");
    }
  }

  editPulldownData(pullId: any): void {
    this.editPullId = pullId;
    this.originalPullDownDataList.forEach((pullDownData: any, i: number) => {
      this.addModalVisible = true;
      if (pullDownData.pullId == pullId) {
        this.existingPullDownData = {
          pulldownNumber: pullDownData.pullId,
          pulldownName: pullDownData.longpullna,
        }
      }
    });
    this.addMode = false;
    this.editMode = true;
  }

  initAddForm(): void {
    this.addPullDownListsForm = this.fb.group({
      formLayout: ['vertical'],
      pulldownNumber: [null, [Validators.required]],
      pulldownName: [null]
    });
  }

  handleAddFormCancel(): void {
    this.addModalVisible = false;
    this.clearAddFormValue();
  }

  clearAddFormValue() {
    for (let control in this.addPullDownListsForm.controls) {
      // this.addPullDownListsForm.controls[control].setErrors(null);
      this.addPullDownListsForm.controls[control].markAsPristine();
      this.addPullDownListsForm.controls[control].markAsUntouched();
      this.addPullDownListsForm.controls[control].updateValueAndValidity();
    }
    this.existingPullDownData = {
      pulldownNumber: null,
      pulldownName: null,
    }
    this.editPullId = null;
  }

  addFormSubmit(): void {
    this.submitAddForm(this.addPullDownListsForm.value)
  }

  submitAddForm(frmValue: any): void {
    for (const i in this.addPullDownListsForm.controls) {
      this.addPullDownListsForm.controls[i].markAsDirty();
      this.addPullDownListsForm.controls[i].updateValueAndValidity();
    }

    if (this.addPullDownListsForm.valid) {
      this.addPullDownLoading = true;
      if (this.addMode) {
        const requestObj = {
          "inoriginal": true,
          "longpullna": frmValue.pulldownName,
          "organizationid": 0,
          "projtype": this.selectedProgram,
          "pulltype": this.selectedPulltype,
          "pullId": frmValue.pulldownNumber,
          "pullname": "",
          "userName":  this.sharedService.getEmail()
        };
        const ids = this.message.loading('Adding Original Pulldown Lists Data...', { nzDuration: 0 }).messageId;
        this._pullDownListsService.saveOriginalPullDownListsData(requestObj).subscribe((result: any) => {
          if (result) {
            this.message.remove(ids);
            this.addModalVisible = false;
            this.addMode = false;
            this.editMode = false;
            this.addPullDownLoading = false;
            this.clearAddFormValue();
            this.notificationService.createNotificationBasic('success', "Original Pulldown Lists", 'Original Pulldown Lists Data Added Successfully!');
            this.searchPullDownLists();
          }
        }, (error: any) => {
          this.message.remove(ids);
          this.addModalVisible = false;
          this.addPullDownLoading = false;
          this.addMode = false;
          this.editMode = false;
          this.clearAddFormValue();
          if(error.status === 500) {
            this.notificationService.createNotificationBasic('error', "Original Pulldown Lists", JSON.parse(error.error).message);
          } else {
            this.notificationService.createNotificationBasic('error', "Original Pulldown Lists", "System error : " + error.message);
          }
        });
      } else {
        let requestObj;
        this.originalPullDownDataList.forEach((pullDownData: any, i: number) => {
          if (pullDownData.pullId == this.editPullId) {
            requestObj = {
              "deleted": pullDownData.deleted,
              "id": pullDownData.id,
              "inoriginal": pullDownData.inoriginal,
              "lastuser":  this.sharedService.getEmail(),
              "longpullna": frmValue.pulldownName,
              "numeric": pullDownData.numeric,
              "organizationid": 0,
              "projtype": pullDownData.projtype,
              "pullId": frmValue.pulldownNumber,
              "pullname": pullDownData.pullname,
              "pulltype": pullDownData.pulltype,
            }
          }
        });
        const ids = this.message.loading('Updating Original Pulldown Lists Data...', { nzDuration: 0 }).messageId;
        this._pullDownListsService.updateOriginalPullDownListsData(requestObj).subscribe((result: any) => {
          if (result) {
            this.message.remove(ids);
            this.addModalVisible = false;
            this.addMode = false;
            this.editMode = false;
            this.addPullDownLoading = false;
            this.clearAddFormValue();
            this.notificationService.createNotificationBasic('success', "Original Pulldown Lists", 'Original Pulldown Lists Data Updated Successfully!');
            this.searchPullDownLists();
          }
        }, (error: any) => {
          this.message.remove(ids);
          this.addModalVisible = false;
          this.addPullDownLoading = false;
          this.addMode = false;
          this.editMode = false;
          this.clearAddFormValue();
          if(error.status === 500) {
            this.notificationService.createNotificationBasic('error', "Original Pulldown Lists", JSON.parse(error.error).message);
          } else {
            this.notificationService.createNotificationBasic('error', "Original Pulldown Lists", "System error : " + error.message);
          }
        });


      }
    }
  }

  deleteGradeData(pullId: any): void {
    let requestObj
    this.originalPullDownDataList.forEach((pullDownData: any, i: number) => {
      if (pullDownData.pullId == pullId) {
        requestObj = {
          "deleted": pullDownData.deleted,
          "id": pullDownData.id,
          "inoriginal": pullDownData.inoriginal,
          "lastmodify": pullDownData.lastmodify,
          "lastuser": pullDownData.lastuser,
          "longpullna": pullDownData.longpullna,
          "numeric": pullDownData.numeric,
          "organizationid": pullDownData.organizationid,
          "projtype": pullDownData.projtype,
          "pullId": pullDownData.pullId,
          "pullname": pullDownData.pullname,
          "pulltype": pullDownData.pulltype,
          "timestamp_column": pullDownData.timestamp_column
        }
      }
    });

    const ids = this.message.loading('Deleting ' + pullId + '...', { nzDuration: 0 }).messageId;
    this._pullDownListsService.deleteOriginalPullDownListsData(requestObj).subscribe((result: any) => {
      if (result) {
        this.message.remove(ids);
        this.notificationService.createNotificationBasic('success', "Original Pulldown Lists", 'Original Pulldown Lists Data Deleted successfully!');
        this.searchPullDownLists();
      }
    }, (error: any) => {
      this.message.remove(ids);
      this.notificationService.createNotificationBasic('error', "Original Pulldown Lists", "System error : " + error.message);
    });
  }

  cancelDelete(): void {

  }


}
