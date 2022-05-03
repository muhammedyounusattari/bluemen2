import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivityGroupServicesService } from "src/app/services/admin/activity-group-services.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { NotificationUtilities } from "src/app/shared/utilities/notificationUtilities";
import { ValidationClass } from "src/app/shared/validation/common-validation-class";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.css']
})

export class ServicesListComponent implements OnInit {

    public activityServiceData: any = [];
    public activityGroup: any;
    public mergeFormGroup: FormGroup;
    public moveFormGroup: FormGroup;
    public formGroup: FormGroup;
    public validationClass: ValidationClass = new ValidationClass();

    public isActivityServiceListMergeLoading: boolean = false;
    public isLoading: boolean = false;
    public isActivityServiceListMoveLoading: boolean = false;
    public activityServiceListMovePopupVisiblity: boolean = false;
    public activityServiceListMergePopupVisiblity: boolean = false;
    public isConfirmActivityLoading: boolean = false;
    public isEdit: boolean = false;
    public activityServiceListPopupVisiblity: boolean = false;

    public activityMovePopupTitle: string = 'Customize Service and Activity Name';
    public activityMergePopupTitle: string = 'Customize Service and Activity Name';
    public activityServiceModalHeader: string = 'Customize Activity/Service';

    public selectedRow: any = {};
    public currentValId: any = null;
    public existingAccountData: any = {
        "lapService": null,
        "activityGroupName": null,
        "activityId": null,
        "activityName": null,
        "id": null,
    };
    public moveExistingAccountData: any = {
        "id": null,
    };
    public mergeExistingAccountData: any = {
        "id": null,
    };
    selectedRowIndex: any;

    constructor(private router: Router
        , private modal: NzModalService
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private notificationService: NotificationUtilities
        , private sharedService: SharedService, private formBuilder: FormBuilder) { }
    ngOnInit() {
        this.sharedService.setPageTitle('Activity/Service List');
        this.createForm();
        this.loadInitialTableData();
    }
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [''],
            'activityId': [''],
            'activityGroupName': ['', Validators.required],
            'activityName': ['', Validators.required],
            'lapService': ['']
        });
        this.mergeFormGroup = this.formBuilder.group({
            'id': ['', Validators.required]
        });
        this.moveFormGroup = this.formBuilder.group({
            'id': ['', Validators.required]
        });
    }

    /**
    * @method loadInitialTableData
    * @description load initial table data
    */
    loadInitialTableData() {
        this.showLoader();
        this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
            if (result) {
                this.hideLoader();
                this.activityServiceData = result;
            }
            this._activityGroupServicesService.getActivityGroupList('').subscribe(groupResult => {

                if (groupResult) {
                    this.activityGroup = groupResult;
                }
            });
        });
    }

    /**
    * @method showLoader
    * @description displaying the loader
    */
    showLoader() {
        this.isLoading = true;
    }

    /**
    * @method hideLoader
    * @description hiding the loader
    */
    hideLoader() {
        this.isLoading = false;
        this.isConfirmActivityLoading = false;
        this.isActivityServiceListMergeLoading = false;
        this.isActivityServiceListMoveLoading = false;
    }

    /**
    * @method deleteSelectedRow
    * @description delete the record
    */
    deleteSelectedRow(data: any) {
        const item = {
            activityId: data.activityId
        }
        const message = 'Are you sure, you want to remove this record:';
        this.modal.confirm({
            nzTitle: 'Confirm Remove Record?',
            nzContent: message + ' ' + this.existingAccountData.activityName,
            nzOkText: 'Yes',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.deleteRecord(item),
            nzCancelText: 'No',
            nzOnCancel: () => this.hideLoader()
        });
    }
    deleteRecord(data: any) {
        this.showLoader();
        this._activityGroupServicesService.deleteActivityServiceList(data).subscribe(result => {
            this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.activityServiceData = result;
                    this.notificationService.createNotificationBasic('success', "Success", 'Deleted Successfully!');
                }
            });
        });
    }

    setValuesToUpdate(data: any) {
        // console.log('selectedRow:', data);
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityServiceListPopupVisiblity = true;
            this.isEdit = true;
            this.existingAccountData = this.selectedRow;
        }
    }
    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup(data: any) {

        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityServiceListMovePopupVisiblity = true;
            Object.keys(this.moveExistingAccountData).forEach((i) => this.moveExistingAccountData[i] = null);
            this.moveFormGroup.reset();
        }
    }

    showMergeItemPopup(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityServiceListMergePopupVisiblity = true;
            this.mergeFormGroup.reset();
        }
    }

    /**
 * @method getDeletedItemByIdMerge
 * @description This method is used for recover record and get deleted recodes.
 */
    getDeletedItemByIdMerge(id: any) {
        const verifyData = {
            id: this.selectedRow.id
        }
        const status = this.verifyServiceIdForMerge(this.currentValId);
        if (!status) {
            const message = "Do you want to merge activity " + this.selectedRow.activityName + " from No. " + this.selectedRow.id + " to No. " + id;
            this.modal.confirm({
                nzTitle: 'Confirm Merge Activity?',
                nzContent: message,
                nzOkText: 'Yes',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.isActivityServiceListMergeLoading = true;
                    this._activityGroupServicesService.mergeActivityById(verifyData).subscribe(result3 => {
                        if (result3) {
                            this.loadInitialTableData();
                            this.isActivityServiceListMergeLoading = false;
                            this.activityServiceListMergePopupVisiblity = false;
                            this.notificationService.createNotificationBasic('success', "Success", 'Merge Successfully Done!');
                        }
                    });
                },
                nzCancelText: 'No',
                nzOnCancel: () => this.hideLoader()
            });
        }
    }
    /**
     * @method verifyServiceId
     * @description Verify the serviceId name.
     */
    verifyServiceIdForMerge(currentId: any) {
        currentId = Number(currentId);
        let status = false;
        const data = this.activityServiceData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            status = false;
        } else {
            this.notificationService.createNotificationBasic('info', 'Info', 'This record does not exist!')
            this.formGroup.get("id")?.setValue('');
            status = true;
        }
        return status;
    }
    /**
      * @method onConfirmMove
      * @description this method is used for moving the record.
      */
    onConfirmMove(): void {
        if (this.moveFormGroup.valid) {
            this.isActivityServiceListMoveLoading = true;
            this.currentValId = this.moveFormGroup?.get('id')?.value;
            let status = this.verifyIdForMove(this.currentValId);
            if (!status) {
                this.getDeletedItemByIdForMove(this.currentValId);
            }
        } else {
            this.moveFormGroup.markAllAsTouched();
        }
    }
    getDeletedItemByIdForMove(id: any) {
        const verifyData = {
            id: id,
            tempId: this.selectedRow.id
        }
        this._activityGroupServicesService.getDeletedActivityById(id).subscribe(result => {
            if (result && result != null) {
                let message = "Activity name was deleted for this number. Do you want to recall the old activity.";
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'Ok',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        const currentData = {
                            activityId: result.activityId,
                            id: result.id
                        }
                        this._activityGroupServicesService.recoverActivityById(currentData).subscribe(result2 => {
                            this.loadInitialTableData();
                            this.isActivityServiceListMoveLoading = false;
                            this.activityServiceListMovePopupVisiblity = false;
                            this.notificationService.createNotificationBasic('success', "Success", 'Activity Recovered Successfully!');
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { }
                });
            } else {
                const message = "Do you want to move activity " + this.selectedRow.activityName + " from No. " + this.selectedRow.id + " to No. " + id;
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'Ok',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this._activityGroupServicesService.updateActivityById(verifyData).subscribe(result3 => {
                            this.loadInitialTableData();
                            this.isActivityServiceListMoveLoading = false;
                            this.activityServiceListMovePopupVisiblity = false;
                            this.notificationService.createNotificationBasic('success', "Success", 'Moved Successfully Done!');
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.isActivityServiceListMoveLoading = false; }
                });
            }
        });
    }

    verifyIdForMove(currentId: any) {
        let status = true;
        const data = this.activityServiceData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            const modal = this.modal.warning({
                nzTitle: 'Enter a different number as the number is already in use or To combine to lists use the merge option instead',
                nzContent: '',
                nzOnOk: () => { this.moveFormGroup.get("id")?.setValue(''); status = true; this.isActivityServiceListMoveLoading = false; }
            });

            setTimeout(() => { modal.destroy(); this.moveFormGroup.get("id")?.setValue(''); status = true; this.isActivityServiceListMoveLoading = false; }, 5000);
        } else {
            status = false;
        }
        return status;
    }
    handleCancel() {
        this.activityServiceListPopupVisiblity = false;
        this.activityServiceListMergePopupVisiblity = false;
        this.activityServiceListMovePopupVisiblity = false;
        this.hideLoader();
    }

    onConfirmmerge() {
        if (this.mergeFormGroup.valid) {
            let val = this.mergeFormGroup?.get('id')?.value.split('|')[1];
            if (val) {
                if (Number(this.selectedRow.id) == Number(val.trim())) {
                    this.notificationService.createNotificationBasic('info', "Info", 'Same Activity Can Not Be Merged!');
                    this.mergeFormGroup.get("id")?.setValue('');
                    return;
                } else {
                    this.currentValId = val.trim();
                }
            } else {
                this.notificationService.createNotificationBasic('info', "Info", 'Please Enter Correct Value!');
                this.mergeFormGroup.get("id")?.setValue('');
                return;
            }
            this.getDeletedItemByIdMerge(this.currentValId);
        } else {
            this.mergeFormGroup.markAllAsTouched();
        }
    }
    /**
* @method addNewServicName
* @description Add the service record
*/
    addNewServiceName() {
        if (this.formGroup.valid) {
            this.isConfirmActivityLoading = true;
            this._activityGroupServicesService.getActivityByActivityNameAndActivityGroupName(this.existingAccountData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "Info", 'Activity name should be unique in all activity group type!');
                    this.existingAccountData.activityName = null;
                    this.hideLoader();
                    return;
                } else {
                    this.showLoader();
                    this._activityGroupServicesService.postActivityServiceList(this.existingAccountData).subscribe(result => {
                        if (result) {
                            this._activityGroupServicesService.getActivityServiceList('').subscribe(result => {
                                this.hideLoader();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.activityServiceListPopupVisiblity = false;
                                    this.activityServiceData = result;
                                    this.notificationService.createNotificationBasic('success', "Success", 'Saved Successfully!');
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }
    sorting(attr: string) {
        if (this.activityServiceData.length > 0) {
            this.activityServiceData = [...this.activityServiceData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    sorting2(attr: string) {
        if (this.activityServiceData.length > 0) {
            this.activityServiceData = [...this.activityServiceData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }

    }
    /**
  * @method resetFields
  * @description Reset the all form group fields
  */
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.selectedRowIndex = null;
        Object.keys(this.existingAccountData).forEach((i) => this.existingAccountData[i] = null);
        this._activityGroupServicesService.getActivityServiceMaxId().subscribe(result => {
            this.activityServiceListPopupVisiblity = true;
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.existingAccountData['id'] = result + 1;
            } else {
                this.existingAccountData['id'] = 1;
            }
        });
    }
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
    * @method applyFilter
    * @description search the text from list
    */
    applyFilter(filterValue: any) {

    }

     /**
    * @method navigateToComponent
    * @description navigate the service group list companant
    */
      navigateToComponent(componentName: string) {
          debugger;
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/customize/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/customize/services-list']);
        }
    }
}