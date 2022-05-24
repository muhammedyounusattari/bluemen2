import { Component, OnInit } from '@angular/core';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html',
    styleUrls: ['./service-group-list.component.css']
})
/**
 * ServiceGroupList Component 
 */
export class ServiceGroupListComponent implements OnInit {
    activityGroupData: any = [];
    activityGroupSearchData: any = [];
    activityGroupDataMergeDropDownList: any = [];
    requestData: any = {
        id: '',
        activityGroupId: '',
        activityGroupName: '',
        activityCalculateHoursforActivityGroup: true,
        activityReportActivityGroup: true,
        activityGroupTypeName: '',
        activityGroupType: '',
        activityAdd: '',
        activityBoltService: ''

    };
    selectedRow: any = '';
    selectedRowIndex: any = '';
    isEdit: boolean = false;
    activityGroupTypes: any = [];
    formGroup: FormGroup;

    activityGroupListPopupVisiblity: boolean = false;
    isConfirmActivityGroupLoading: boolean = false;
    currentMoveValId: any;
    currentMergeValId: any;
    selectedMoveId: any;
    selectedActivityGroupMoveId: any;
    selectedActivityGroupMoveName: any;
    selectedMergeId: any;
    selectedActivityGroupMergeId: any;
    selectedActivityGroupMergeName: any;
    message: any;
    moveModalVisible: boolean = false;
    ismoveItemLoading: boolean = false;
    moveItemForm: FormGroup;
    mergeFormGroup: FormGroup;
    mergeModalVisible: boolean = false;
    ismergeItemLoading: boolean = false;
    isLoading: boolean = false;

    validationClass: ValidationClass = new ValidationClass();
    constructor(private dialog: MatDialog
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService: PullDownListService
        , private notificationService: NotificationUtilities
        , private modal: NzModalService) { }

    ngOnInit() {
        this.createForm();
        this.sharedService.setPageTitle('Activity/Service List');
        this.getActivityGroup();
        this.bindDropDownValues();
    }

    /**
    * @method getActivityGroup
    * @description Get the activity groups
    */
    getActivityGroup() {
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.activityGroupData = result;
                this.activityGroupSearchData = result;
                this.activityGroupDataMergeDropDownList = result;
            }
        });
    }

    /**
    * @method createForm
    * @description declare the form fileds
    */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [''],
            'activityGroupId': [''],
            'activityGroupName': ['', Validators.required],
            'activityGroupType': ['', Validators.required],
            'activityCalculateHoursforActivityGroup': [true],
            'activityReportActivityGroup': [true],
            'activityGroupTypeName': ['']
        });
    }

    /**
    * @method applyFilter
    * @description search the text from list
    */
    applyFilter(search: any) {
        console.log(search);
        const targetValue: any[] = [];
        this.activityGroupSearchData.forEach((value: any) => {
            let keys = ["id", "activityGroupName", "activityReportActivityGroup", "activityCalculateHoursforActivityGroup"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.activityGroupData = targetValue;
    }

    /**
   * @method setValuesToUpdate
   * @description Set the select row values in formgroup
   */
    setValuesToUpdate(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            this.isEdit = true;
            this.formGroup.get('id')?.setValue(this.selectedRow.id);
            this.formGroup.get('activityGroupId')?.setValue(this.selectedRow.activityGroupId);
            this.formGroup.get('activityGroupName')?.setValue(this.selectedRow.activityGroupName);
            this.formGroup.get('activityCalculateHoursforActivityGroup')?.setValue(this.selectedRow.activityCalculateHoursforActivityGroup);
            this.formGroup.get('activityReportActivityGroup')?.setValue(this.selectedRow.activityReportActivityGroup);
            this.formGroup.get('activityGroupTypeName')?.setValue(this.selectedRow.activityGroupTypeName);
            this.formGroup.get('activityGroupType')?.setValue(this.selectedRow.activityGroupType);
            this.openModal();
        }
    }

    /**
    * @method openModal
    * @description open model
    */
    openModal() {
        this.activityGroupListPopupVisiblity = true;
    }

    /**
   * @method hideModal
   * @description hide model
   */
    hideModal() {
        this.activityGroupListPopupVisiblity = false;
    }

    /**
    * @method resetFields
    * @description Reset the all form group fields
    */
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        this._activityGroupServicesService.getActivityGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
            } else {
                this.formGroup.get('id')?.setValue(1);
            }
            this.openModal();
        });
    }

    /**
   * @method hideLoader
   * @description Hide loader
   */
    hideLoader() {
        this.isLoading = false;
    }

    /**
     * @method showLoader
     * @description Show loader
     */
    showLoader() {
        this.isLoading = true;
    }

    /**
     * @method setSelectedRow
     * @description Set the selected row
     */
    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    /**
   * @method addNewGroupName
   * @description Add the group record
   */
    addNewGroupName() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.activityGroupId = this.formGroup?.get('activityGroupId')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup?.get('activityCalculateHoursforActivityGroup')?.value;
            this.requestData.activityReportActivityGroup = this.formGroup?.get('activityReportActivityGroup')?.value;
            this.requestData.activityGroupTypeName = this.formGroup?.get('activityGroupTypeName')?.value;
            this.requestData.activityGroupType = this.formGroup?.get('activityGroupType')?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.getActivityGroupByActivityGroupNameAndActivityGroupType(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "info", 'Activity group name should be unique in all activity group type!');
                    this.formGroup.get('activityGroupName')?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._activityGroupServicesService.postActivityGroupList(this.requestData).subscribe(result => {
                        if (result) {
                            this.hideModal();
                            this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                                this.hideLoader();
                                if (result) {
                                    this.selectedRowIndex = null;
                                    this.activityGroupData = result;
                                    this.activityGroupSearchData = result;
                                    this.activityGroupDataMergeDropDownList = result;
                                    this.notificationService.createNotificationBasic('success', "success", 'Saved successfully!');
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    /**
    * @method deleteSelectedRow
    * @description delete the record
    */
    deleteSelectedRow(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            const data = {
                activityGroupId: this.selectedRow.activityGroupId
            }
            this.showLoader();
            this._activityGroupServicesService.deleteActivityGroupList(data).subscribe(result1 => {
                this._activityGroupServicesService.getActivityGroupList('').subscribe(result2 => {
                    this.hideLoader();
                    if (result2) {
                        this.selectedRowIndex = null;
                        this.selectedRow = null;
                        this.activityGroupData = result2;
                        this.activityGroupSearchData = result2;
                        this.activityGroupDataMergeDropDownList = result2;
                        this.notificationService.createNotificationBasic('success', "success", 'Deleted successfully!');
                    }
                });
            });
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to delete!');

        }
    }

    /**
    * @method updateSelectedRow
    * @description update the record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.activityGroupId = this.formGroup?.get('activityGroupId')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.activityCalculateHoursforActivityGroup = this.formGroup?.get('activityCalculateHoursforActivityGroup')?.value;
            this.requestData.activityReportActivityGroup = this.formGroup?.get('activityReportActivityGroup')?.value;
            this.requestData.activityGroupTypeName = this.formGroup?.get('activityGroupTypeName')?.value;
            this.requestData.activityGroupType = this.formGroup?.get('activityGroupType')?.value;
            this.requestData.activityAdd = '';
            this.requestData.activityBoltService = '';
            this._activityGroupServicesService.getActivityGroupByActivityGroupNameAndActivityGroupType(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateActivityGroupList();
                } else {
                    if ((this.selectedRow.activityGroupName.toLowerCase() == this.formGroup?.get('activityGroupName')?.value.toLowerCase()) &&
                        (this.selectedRow.activityGroupType.toLowerCase() == this.formGroup?.get('activityGroupType')?.value.toLowerCase())
                    ) {
                        this.updateActivityGroupList();
                    } else {
                        this.notificationService.createNotificationBasic('info', "info", 'Activity group name should be unique in all activity group type!');
                        this.formGroup.get('activityGroupName')?.setValue('');
                        return;
                    }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    updateActivityGroupList() {
        this.showLoader();
        this._activityGroupServicesService.updateActivityGroupList(this.requestData).subscribe(response => {
            this.hideModal();
            this.selectedRow = null;
            this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                this.hideLoader();
                if (result) {
                    this.selectedRowIndex = null;
                    this.isEdit = false;
                    this.activityGroupData = result;
                    this.activityGroupSearchData = result;
                    this.activityGroupDataMergeDropDownList = result;
                    this.notificationService.createNotificationBasic('success', "success", 'Updated successfully!');
                }
            });
        });
    }

    /**
 * @method showMoveItemPopup
 * @description Open the popup for move the record
 */
    showMoveItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        this.createMoveForm();
        this.selectedActivityGroupMoveId = this.selectedRow.activityGroupId;
        this.selectedMoveId = this.selectedRow.id;
        this.selectedActivityGroupMoveName = this.selectedRow.activityGroupName;
        this.moveModalVisible = true;
    }

    /**
     * @method showMergeItemPopup
     * @description Open the popup for merge the record
     */
    showMergeItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        this.selectedActivityGroupMergeId = this.selectedRow.activityGroupId;
        this.selectedMergeId = this.selectedRow.id;
        this.selectedActivityGroupMergeName = this.selectedRow.activityGroupName;
        if (this.selectedActivityGroupMergeName) {
            const data = this.activityGroupSearchData.filter((item: any) => (Number(item.id) != Number(this.selectedMergeId)));
            this.activityGroupDataMergeDropDownList = data;
        }
        this.createMergeForm();
        this.mergeModalVisible = true;
    }

    //start move
    createMoveForm() {
        this.moveItemForm = this.formBuilder.group({
            'id': ['', Validators.required]
        });
    }
    onMoveConfirm(): void {
        // Close the dialog, return true
        if (this.moveItemForm.valid) {
            this.currentMoveValId = this.moveItemForm?.get('id')?.value;
            let status = this.verifyMoveId(this.currentMoveValId);
            if (!status) {
                this.getDeletedItemMoveById(this.currentMoveValId);
            }
        } else {
            this.moveItemForm.markAllAsTouched();
            Object.values(this.moveItemForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    getDeletedItemMoveById(id: any) {
        const verifyData = {
            id: id,
            tempId: this.selectedMoveId
        }
        this._activityGroupServicesService.getDeletedGroupById(id).subscribe(result => {
            if (result && result != null) {
                let message = "Activity group name was deleted for this number. Do you want to recall the old activity group?";
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        const currentData = {
                            activityGroupId: result.activityGroupId,
                            id: result.id
                        }
                        this._activityGroupServicesService.recoverActivityGroupById(currentData).subscribe(result2 => {
                            if (result2) {
                                this.moveModalVisible = false;
                                this.getActivityGroup();
                            }
                        });
                    }
                });
            } else {
                let message = "Do you want to move activity group " + this.selectedActivityGroupMoveName + " from No. " + this.selectedMoveId + " to No. " + id + "?";
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        this._activityGroupServicesService.updateActivityGroupById(verifyData).subscribe(result3 => {
                            if (result3) {
                                this.moveModalVisible = false;
                                this.getActivityGroup();
                            }
                        });
                    }
                });
            }
        });
    }

    verifyMoveId(currentId: any) {
        let status = true;
        const data = this.activityGroupData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            let message = "Enter a different number as the number is already in use or To combine to lists use the merge option instead!";
            this.notificationService.createNotificationBasic('info', "info", message);
            this.moveItemForm.get("id")?.setValue('');
            status = true;
        } else {
            status = false;
        }
        return status;

    }

    /**
  * @method moveHandleCancel
  * @description cancel the popup
  */
    moveHandleCancel(): void {
        this.clearMoveFormValue();
        this.moveModalVisible = false;
    }

    /**
     * @method clearMoveFormValue
     * @description validate the all fields
     */
    clearMoveFormValue() {
        for (let control in this.moveItemForm.controls) {
            // this.moveItemForm.controls[control].setErrors(null);
            this.moveItemForm.controls[control].markAsPristine();
            this.moveItemForm.controls[control].markAsUntouched();
            this.moveItemForm.controls[control].updateValueAndValidity();
        }
    }

    //end move

    //start merge
    /**
    * @method onConfirm
    * @description this method is used for move the records.
    */
    onMergeConfirm(): void {
        // Close the dialog, return true
        if (this.mergeFormGroup.valid) {
            let val = this.mergeFormGroup?.get('id')?.value.split('|')[1];
            if (val) {
                if (Number(this.selectedMergeId) == Number(val.trim())) {
                    this.notificationService.createNotificationBasic('info', "info", "Same activity group can not be merge!");
                    this.mergeFormGroup.get("id")?.setValue('');
                    return;
                } else {
                    this.currentMergeValId = val.trim();
                }
            } else {
                this.notificationService.createNotificationBasic('info', "info", "Please select correct value!");
                this.mergeFormGroup.get("id")?.setValue('');
                return;
            }
            this.getDeletedItemMergeById(this.currentMergeValId);
        } else {
            this.mergeFormGroup.markAllAsTouched();
            Object.values(this.mergeFormGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    /**
  * @method createForm
  * @description Form group create
  */
    createMergeForm() {
        this.mergeFormGroup = this.formBuilder.group({
            'id': ['', Validators.required]
        });
    }

    /**
     * @method getDeletedItemById
     * @description This method is used for recover record and get deleted recodes.
     */
    getDeletedItemMergeById(id: any) {
        const verifyData = {
            id: this.selectedMergeId
        }
        let status = this.verifyServiceMergeId(this.currentMergeValId);
        if (!status) {
            let message = "Do you want to merge activity " + this.selectedActivityGroupMergeName + " from No. " + this.selectedMergeId + " to No. " + id;
            this.modal.confirm({
                nzTitle: message,
                nzContent: '',
                nzOnOk: () => {
                    this._activityGroupServicesService.mergeActivityGroupById(verifyData).subscribe(result3 => {
                        if (result3) {
                            this.mergeModalVisible = false;
                            this.getActivityGroup();
                        }
                    });
                }
            });
        }
    }

    /**
     * @method verifyServiceId
     * @description Verify the serviceId name.
     */
    verifyServiceMergeId(currentId: any) {
        currentId = Number(currentId);
        let status = false;
        const data = this.activityGroupData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            status = false;
        } else {
            this.notificationService.createNotificationBasic('info', "info", "This record does not exist!");
            this.mergeFormGroup.get("id")?.setValue('');
            status = true;
        }
        return status;

    }

    /**
      * @method mergeHandleCancel
      * @description reset the fileds.
      */
    mergeHandleCancel(): void {
        this.clearMergeFormValue();
        this.mergeModalVisible = false;
    }

    /**
    * @method clearMergeFormValue
    * @description validate the fields.
    */
    clearMergeFormValue() {
        for (let control in this.mergeFormGroup.controls) {
            // this.moveItemForm.controls[control].setErrors(null);
            this.mergeFormGroup.controls[control].markAsPristine();
            this.mergeFormGroup.controls[control].markAsUntouched();
            this.mergeFormGroup.controls[control].updateValueAndValidity();
        }
    }


    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
    bindDropDownValues() {
        let data: any = ['ACTIVITYGROUPTYPE'];
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            console.log(data);
            if (result?.ACTIVITYGROUPTYPE) {
                this.activityGroupTypes = result.ACTIVITYGROUPTYPE;
            }
        });
    }

    /**
   * @method handleCancel
   * @description this method is used for reset the form
   */
    handleCancel(): void {
        this.createForm();
        this.activityGroupListPopupVisiblity = false;
    }

    /**
    * @method cancelDelete
    * @description this method is used for cancel Delete popup
    */
    cancelDelete(): void {

    }


    /**
    * @method print
    * @description show print and download the data.
    */
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['Id', 'Service or Activity Group Name', 'Report Activity', 'Calculate Hours']]
        let data: any = [];
        this.activityGroupData.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.id);
            tempObj.push(e.activityGroupName);
            if (e.activityReportActivityGroup == true) {
                tempObj.push("YES");
            } else {
                tempObj.push("NO");
            }

            if (e.activityCalculateHoursforActivityGroup == true) {
                tempObj.push("YES");
            } else {
                tempObj.push("NO");
            }
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
                doc.text("Compansol TRIO Service Group Listing", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "Service Group List"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'serviceGroup.pdf' });
        //doc.save('college.pdf');  
    }

    refreshStatus(data: any) {
        this.activityGroupData.map((item: any) => {
            if (item.id != data.id) {
                item.checked = false;
            }
        });
        if (data.checked) {
            this.selectedRow = data;
        } else {
            this.selectedRow = null;
        }
    }

    /**
* @method sorting
* @description this method is used for asc sorting
*/
    sorting(attr: string) {
        if (this.activityGroupData.length > 0) {
            this.activityGroupData = [...this.activityGroupData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
   * @method sorting
   * @description this method is used for desc sorting
   */
    sorting2(attr: string) {
        if (this.activityGroupData.length > 0) {
            this.activityGroupData = [...this.activityGroupData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
}