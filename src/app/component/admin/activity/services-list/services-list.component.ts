import { Component, OnInit } from '@angular/core';
import { ActivityGroupServicesService } from '../../../../services/admin/activity-group-services.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.css']
})

/**
 * ServicesList Component 
 */
export class ServicesListComponent implements OnInit {

    activityServiceData: any = [];
    activityServiceSearchData: any = [];
    activityDataMergeDropDownList: any = [];
    requestData: any = {
        id: '',
        activityId: '',
        activityName: '',
        activityGroupName: '',
        lapService: true,
        activityBoltService: ''
    };
    selectedRow: any = '';
    isEdit: boolean = false;

    activityGroup: any;
    formGroup: FormGroup;
    validationClass: ValidationClass = new ValidationClass();
    selectedRowIndex: any;
    activityServiceListPopupVisiblity: boolean = false;
    isConfirmActivityLoading: boolean = false;
    currentMoveValId: any;
    currentMergeValId: any;
    selectedMoveId: any;
    selectedActivityMoveId: any;
    selectedActivityMoveName: any;
    selectedMergeId: any;
    selectedActivityMergeId: any;
    selectedActivityMergeName: any;
    message: any;
    moveModalVisible: boolean = false;
    ismoveItemLoading: boolean = false;
    moveItemForm: FormGroup;
    mergeFormGroup: FormGroup;
    mergeModalVisible: boolean = false;
    ismergeItemLoading: boolean = false;
    isLoading: boolean = false;

    constructor(private _activityGroupServicesService: ActivityGroupServicesService
        , private sharedService: SharedService, private formBuilder: FormBuilder
        , private notificationService: NotificationUtilities
        , private modal: NzModalService) { }

    ngOnInit() {
        this.sharedService.setPageTitle('Activity/Service List');
        this.getActivityGroupList();
        this.createForm();
        this.getActivityList();
    }

    /**
    * @method getActivityList
    * @description get the activity list
    */
    getActivityList() {
        this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.selectedRowIndex = null;
                this.activityServiceData = result;
                this.activityServiceSearchData = result;
                this.activityDataMergeDropDownList = result;
            }
        });
    }

    /**
    * @method getActivityGroupList
    * @description get the activity group list
    */
    getActivityGroupList() {
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            if (result) {
                this.activityGroup = result;            }
        });
    }

    /**
   * @method applyFilter
   * @description search the text from list
   */
    applyFilter(search: any) {
        const targetValue: any[] = [];
        this.activityServiceSearchData.forEach((value: any) => {
            let keys = ["id", "activityName", "activityGroupName", "lapService"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.activityServiceData = targetValue;
    }

    /**
   * @method createForm
   * @description declare the form fields
   */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [''],
            'activityId': [''],
            'activityGroupName': ['', Validators.required],
            'activityName': ['', Validators.required],
            'lapService': [true]
        });
    }

    /**
   * @method setValuesToUpdate
   * @description Set the select row values in formgroup
   */
    setValuesToUpdate(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        this.isEdit = true;
        this.formGroup.get('id')?.setValue(this.selectedRow.id);
        this.formGroup.get('activityId')?.setValue(this.selectedRow.activityId);
        this.formGroup.get('activityGroupName')?.setValue(this.selectedRow.activityGroupName);
        this.formGroup.get('activityName')?.setValue(this.selectedRow.activityName);
        this.formGroup.get('lapService')?.setValue(this.selectedRow.lapService);
        this.openModal();
    }

    /**
   * @method openModal
   * @description open model
   */
    openModal() {
        this.activityServiceListPopupVisiblity = true;
    }

    /**
   * @method hideModal
   * @description hide model
   */
    hideModal() {
        this.activityServiceListPopupVisiblity = false;
    }

    /**
     * @method setSelectedRow
     * @description Set the selected row
     */
    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    /**
    * @method resetFields
    * @description Reset the all form group fields
    */
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        this._activityGroupServicesService.getActivityServiceMaxId().subscribe(result => {
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
   * @method addNewServicName
   * @description Add the service record
   */
    addNewServiceName() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.activityId = this.formGroup?.get('activityId')?.value;
            this.requestData.activityName = this.formGroup?.get('activityName')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.lapService = this.formGroup?.get('lapService')?.value;
            this._activityGroupServicesService.getActivityByActivityNameAndActivityGroupName(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "info", 'Activity name should be unique in all activity group type!');
                    this.formGroup.get('activityName')?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._activityGroupServicesService.postActivityServiceList(this.requestData).subscribe(result => {
                        this.hideModal();
                        if (result) {
                            this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                                this.hideLoader();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.activityServiceData = result;
                                    this.activityServiceSearchData = result;
                                    this.activityDataMergeDropDownList = result;
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
        const data = {
            activityId: this.selectedRow.activityId
        }
        this.showLoader();
        this._activityGroupServicesService.deleteActivityServiceList(data).subscribe(result => {
            this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.activityServiceData = result;
                    this.activityServiceSearchData = result;
                    this.activityDataMergeDropDownList = result;
                    this.notificationService.createNotificationBasic('success', "success", 'Deleted successfully!');
                }
            });
        });
    }

    /**
   * @method updateSelectedRow
   * @description update the record
   */
    updateSelectedRow() {
        if (this.selectedRow) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.activityId = this.formGroup?.get('activityId')?.value;
            this.requestData.activityName = this.formGroup?.get('activityName')?.value;
            this.requestData.activityGroupName = this.formGroup?.get('activityGroupName')?.value;
            this.requestData.lapService = this.formGroup?.get('lapService')?.value;
            this._activityGroupServicesService.getActivityByActivityNameAndActivityGroupName(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateActivityRow();
                } else {
                    if ((this.selectedRow.activityName.toLowerCase() == this.formGroup?.get('activityName')?.value.toLowerCase()) &&
                        (this.selectedRow.activityGroupName.toLowerCase() == this.formGroup?.get('activityGroupName')?.value.toLowerCase())
                    ) {
                        this.updateActivityRow();
                    } else {
                        this.notificationService.createNotificationBasic('info', "info", 'Activity name should be unique in all activity group type!');
                        this.formGroup.get('activityName')?.setValue('');
                        return;
                    }
                }
            });
        }
    }

    /**
     * @method updateActivityRow
     * @description update the record
     */
    updateActivityRow() {
        this.showLoader();
        this._activityGroupServicesService.updateActivityServiceList(this.requestData).subscribe(result => {
            this.hideModal();
            this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.isEdit = false;
                    this.selectedRow = null;
                    this.activityServiceData = result;
                    this.activityServiceSearchData = result;
                    this.activityDataMergeDropDownList = result;
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
        this.selectedActivityMoveId = this.selectedRow.activityId;
            this.selectedMoveId = this.selectedRow.id;
            this.selectedActivityMoveName = this.selectedRow.activityName;
            this.moveModalVisible = true;
    }

    /**
     * @method showMergeItemPopup
     * @description Open the popup for merge the record
     */
    showMergeItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        this.selectedActivityMergeId = this.selectedRow.activityId;
        this.selectedMergeId = this.selectedRow.id;
        this.selectedActivityMergeName = this.selectedRow.activityName;
        if (this.selectedActivityMergeName) {
            const data = this.activityServiceSearchData.filter((item: any) => (Number(item.id) != Number(this.selectedMergeId)));
            this.activityDataMergeDropDownList = data;
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
        this._activityGroupServicesService.getDeletedActivityById(id).subscribe(result => {
            if (result && result != null) {
                let message = "Activity name was deleted for this number. Do you want to recall the old activity.";
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        const currentData = {
                            activityId: result.activityId,
                            id: result.id
                        }
                        this._activityGroupServicesService.recoverActivityById(currentData).subscribe(result2 => {
                            if (result2) {
                                this.moveModalVisible = false;
                                this.getActivityList();
                            }
                        });
                    }
                });
            } else {
                let message = "Do you want to move activity " + this.selectedActivityMoveName + " from No. " + this.selectedMoveId + " to No. " + id;
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        this._activityGroupServicesService.updateActivityById(verifyData).subscribe(result3 => {
                            if (result3) {
                                this.moveModalVisible = false;
                                this.getActivityList();
                            }
                        });
                    }
                });
            }
        });
    }

    verifyMoveId(currentId: any) {
        let status = true;
        const data = this.activityServiceData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            let message = "Enter a different number as the number is already in use or To combine to lists use the merge option instead";
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
                    this.notificationService.createNotificationBasic('info', "info", "Same activity can not be merge!");
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
            let message = "Do you want to merge activity " + this.selectedActivityMergeName + " from No. " + this.selectedMergeId + " to No. " + id;
            this.modal.confirm({
                nzTitle: message,
                nzContent: '',
                nzOnOk: () => {
                    this._activityGroupServicesService.mergeActivityById(verifyData).subscribe(result3 => {
                        if (result3) {
                            this.mergeModalVisible = false;
                            this.getActivityList();
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
        const data = this.activityServiceData.filter((item: any) => ((item.id) === (currentId)));
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
    * @method handleCancel
    * @description this method is used for reset the form
    */
    handleCancel(): void {
        this.createForm();
        this.activityServiceListPopupVisiblity = false;
    }

    /**
    * @method cancelDelete
    * @description this method is used for cancel Delete popup
    */
    cancelDelete(): void {

    }

    //end move

    /**
   * @method print
   * @description show print and download the data.
   */
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['Id', 'Activity Name', 'Activity Group Name', 'Lap Service']]
        let data: any = [];
        this.activityServiceData.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.id);
            tempObj.push(e.activityName);
            tempObj.push(e.activityGroupName);
            if (e.lapService == true) {
                tempObj.push('YES');
            } else {
                tempObj.push('NO');
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
                doc.text("Compansol TRIO Activity Listing", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "Activity"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'activity.pdf' });
        //doc.save('college.pdf');  
    }


    /**
  * @method sorting
  * @description this method is used for asc sorting
  */
    sorting(attr: string) {
        if (this.activityServiceData.length > 0) {
            this.activityServiceData = [...this.activityServiceData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
   * @method sorting
   * @description this method is used for desc sorting
   */
    sorting2(attr: string) {
        if (this.activityServiceData.length > 0) {
            this.activityServiceData = [...this.activityServiceData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
}