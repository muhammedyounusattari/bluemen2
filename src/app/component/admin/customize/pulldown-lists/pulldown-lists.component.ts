import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PullDownListsService } from '../../../../services/admin/pulldown-lists.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationUtilities } from '../../../../shared/utilities/notificationUtilities';
import { SharedService } from '../../../../shared/services/shared.service';
import { ValidationClass } from '../../../../shared/validation/common-validation-class';

@Component({
    selector: 'app-pulldown-lists',
    templateUrl: './pulldown-lists.component.html',
    styleUrls: ['./pulldown-lists.component.css']
})
export class PulldownListsComponent implements OnInit {
    public dataLoading: boolean = false;
    public pullDownListForm!: FormGroup;
    public addPullDownListsForm!: FormGroup;
    public originalPullDownData: any;
    public originalPullDownDataList: any;
    public orgId: any;
    public existingPullDownData: any = {
        pulldownNumber: null,
        pulldownName: null,
    }
    public selectedOrganization: any = null;
    public selectedPulltype: any = null;
    public pullTypeList: any;
    public validationClass: ValidationClass = new ValidationClass();
    public resetProcess: boolean = false;
    public addModalVisible: boolean = false;
    public addPullDownLoading: boolean = false;
    public pageTitle: string = 'Loading Pulldown Lists';
    public isSpinning: boolean = false;
    public addMode: boolean = false;
    public editMode: boolean = false;
    public editPullId: any = null;
    public organizationList: any;

    constructor(
        private sharedService: SharedService,
        private fb: FormBuilder,
        private _pullDownListsService: PullDownListsService,
        private message: NzMessageService,
        private notificationService: NotificationUtilities
    ) {
        this.initForm();
        this.initAddForm();
    }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Pulldown Lists');
        this.orgId = this.sharedService.getOrgId();
        this.getOrganization();
    }

    initForm(): void {
        this.pullDownListForm = this.fb.group({
            formLayout: ['horizontal'],
            organizationType: [null, [Validators.required]],
            pullType: [null, [Validators.required]]
        });
    }

    getOrganization(): void {
        this.isSpinning = true;
        this._pullDownListsService.getOrganizationList().subscribe((result: any) => {
            if (result) {
                this.organizationList = result;
                this.selectedOrganization = this.organizationList[0].orgId;
                this.isSpinning = false;
            }
        }, (error: any) => {
            this.isSpinning = false;
            this.notificationService.createNotificationBasic('error', 'Pulldown Lists', "System error : " + error.message);
        });
    }

    organizationChange(value: number): void {
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
                this.notificationService.createNotificationBasic('error', 'Pulldown Lists', "System error : " + error.message);
            });
        } else {
            this.pullTypeList = [];
        }
    }

    searchPullDownLists(): void {
        this.searchPullDownListsForm(this.pullDownListForm.value);
    }

    searchPullDownListsForm(frmValue: any): void {
        for (const i in this.pullDownListForm.controls) {
            this.pullDownListForm.controls[i].markAsDirty();
            this.pullDownListForm.controls[i].updateValueAndValidity();
        }
        if (this.pullDownListForm.valid) {
            this.dataLoading = true;
            const requestObj = {
                "orgId": frmValue.organizationType,
                "pullType": frmValue.pullType
            };
            this.isSpinning = true;
            this._pullDownListsService.searchOriginalPullDownLists(requestObj).subscribe((res: any) => {
                if (res) {
                    this.originalPullDownData = res;
                    this.originalPullDownDataList = res;
                    this.dataLoading = false;
                    this.notificationService.createNotificationBasic('success', "Pulldown Lists", 'Pulldown Lists Fetched Successfully!');
                    this.isSpinning = false;
                }
            }, (error: any) => {
                this.notificationService.createNotificationBasic('error', 'Pulldown Lists', "System error : " + error.message);
                this.isSpinning = false;
            });
        }
    }

    addNewData(): void {
        for (const i in this.pullDownListForm.controls) {
            this.pullDownListForm.controls[i].markAsDirty();
            this.pullDownListForm.controls[i].updateValueAndValidity();
        }
        if (this.pullDownListForm.valid) {
            this.addModalVisible = true;
            this.existingPullDownData = {
                pulldownNumber: null,
                pulldownName: null,
            }
            this.addMode = true;
            this.editMode = false;
        } else {
            this.notificationService.createNotificationBasic('error', 'Pulldown Lists', "Please Select Pulltype");
        }
    }

    editPulldownData(pullId: any): void {
        this.editPullId = pullId;
        this.originalPullDownDataList.forEach((pullDownData: any, i: number) => {
            if (pullDownData.pullId == pullId) {
                this.existingPullDownData = {
                    pulldownNumber: pullDownData.pullId,
                    pulldownName: pullDownData.longpullna,
                }
            }
        });
        this.addMode = false;
        this.editMode = true;
        this.addModalVisible = true;
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
                this._pullDownListsService.getProjType(this.selectedOrganization).subscribe((result: any) => {
                    if (result) {
                        console.log('result', result);
                        const requestObj = {
                            "inoriginal": true,
                            "longpullna": frmValue.pulldownName,
                            "organizationid": this.selectedOrganization,
                            "projtype": result.id,
                            "pulltype": this.selectedPulltype,
                            "pullId": frmValue.pulldownNumber,
                            "pullname": "",
                            "userName": this.sharedService.getEmail()
                        };
                        const ids = this.message.loading('Adding Pulldown Lists Data...', { nzDuration: 0 }).messageId;
                        this._pullDownListsService.saveOriginalPullDownListsData(requestObj).subscribe((result: any) => {
                            if (result) {
                                this.message.remove(ids);
                                this.addModalVisible = false;
                                this.addMode = false;
                                this.editMode = false;
                                this.addPullDownLoading = false;
                                this.clearAddFormValue();
                                this.notificationService.createNotificationBasic('success', "Pulldown Lists", 'Pulldown Lists Data Added Successfully!');
                                this.searchPullDownLists();
                            }
                        }, (error: any) => {
                            this.message.remove(ids);
                            this.addModalVisible = false;
                            this.addPullDownLoading = false;
                            this.addMode = false;
                            this.editMode = false;
                            this.clearAddFormValue();
                            if (error.status === 500) {
                                this.notificationService.createNotificationBasic('error', "Pulldown Lists", JSON.parse(error.error).message);
                            } else {
                                this.notificationService.createNotificationBasic('error', "Pulldown Lists", "System error : " + error.message);
                            }
                        });
                    }
                }, (error: any) => {
                    this.notificationService.createNotificationBasic('error', 'Pulldown Lists', "System error : " + error.message);
                });
            } else {
                let requestObj;
                this.originalPullDownDataList.forEach((pullDownData: any, i: number) => {
                    if (pullDownData.pullId == this.editPullId) {
                        requestObj = {
                            "deleted": pullDownData.deleted,
                            "id": pullDownData.id,
                            "inoriginal": pullDownData.inoriginal,
                            "lastuser": this.sharedService.getEmail(),
                            "longpullna": frmValue.pulldownName,
                            "numeric": pullDownData.numeric,
                            "organizationid": pullDownData.organizationid,
                            "projtype": pullDownData.projtype,
                            "pullId": pullDownData.pullId,
                            "pullname": pullDownData.pullname,
                            "pulltype": pullDownData.pulltype,
                        }
                    }
                });
                const ids = this.message.loading('Updating Pulldown Lists Data...', { nzDuration: 0 }).messageId;
                this._pullDownListsService.updateOriginalPullDownListsData(requestObj).subscribe((result: any) => {
                    if (result) {
                        this.message.remove(ids);
                        this.addModalVisible = false;
                        this.addMode = false;
                        this.editMode = false;
                        this.addPullDownLoading = false;
                        this.clearAddFormValue();
                        this.notificationService.createNotificationBasic('success', "Pulldown Lists", 'Pulldown Lists Data Updated Successfully!');
                        this.searchPullDownLists();
                    }
                }, (error: any) => {
                    this.message.remove(ids);
                    this.addModalVisible = false;
                    this.addPullDownLoading = false;
                    this.addMode = false;
                    this.editMode = false;
                    this.clearAddFormValue();
                    if (error.status === 500) {
                        this.notificationService.createNotificationBasic('error', "Pulldown Lists", JSON.parse(error.error).message);
                    } else {
                        this.notificationService.createNotificationBasic('error', "Pulldown Lists", "System error : " + error.message);
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
                this.notificationService.createNotificationBasic('success', "Pulldown Lists", 'Pulldown Lists Data Deleted successfully!');
                this.searchPullDownLists();
            }
        }, (error: any) => {
            this.message.remove(ids);
            this.notificationService.createNotificationBasic('error', "Pulldown Lists", "System error : " + error.message);
        });
    }

    cancelDelete(): void {

    }


}
