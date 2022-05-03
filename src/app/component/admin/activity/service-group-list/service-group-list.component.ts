import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivityGroupServicesService } from "src/app/services/admin/activity-group-services.service";
import { PullDownListService } from "src/app/services/admin/pulldown-list.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { NotificationUtilities } from "src/app/shared/utilities/notificationUtilities";
import { ValidationClass } from "src/app/shared/validation/common-validation-class";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';


@Component({
    selector: 'app-service-group-list',
    templateUrl: './service-group-list.component.html',
    styleUrls: ['./service-group-list.component.css']
})
/**
 * ServiceGroupList Component 
 */
export class ServiceGroupListComponent implements OnInit, AfterViewInit {

    public formGroup: FormGroup;
    public moveFormGroup: FormGroup;
    public mergeFormGroup:FormGroup;
    public selectedRow: any = '';
    public selectedRowIndex: any;
    public currentValId: any;
    public activityGroupData: any = [];
    public isEdit: boolean = false;
    public isLoading: boolean = false;
    public activityServiceGroupListPopupVisiblity: boolean = false;
    public isConfirmActivityGroupLoading: boolean = false;
    public isActivityGroupServiceListMoveLoading: boolean = false;
    public validationClass: ValidationClass = new ValidationClass();
    public existingAccountData: any = {
        id: null,
        activityGroupId: null,
        activityGroupName: null,
        activityCalculateHoursforActivityGroup: null,
        activityReportActivityGroup: null,
        activityGroupTypeName: null,
        activityGroupType: null,
        activityAdd: null,
        activityBoltService: null

    };
    public moveExistingAccountData: any = {
        "id": null,
    };
    public mergeExistingAccountData: any = {
        "id": null,
    };
    public activityGroupMovePopupTitle:string = 'Customize Service and Activity Group Name';
    public activityServiceGroupModalHeader:string = 'Customize Activity/Service Group';
    public activityGroupMergePopupTitle:string = 'Customize Activity/Service Group';
    public activityGroupServiceListMergePopupVisiblity:boolean = false;
    public isActivityGroupServiceListMergeLoading:boolean = false;
    public activityGroupTypes: any = [];
    public activityGroupServiceListMovePopupVisiblity: boolean = false;

    constructor(
        private router: Router
        , private modal: NzModalService
        , private notificationService: NotificationUtilities
        , private _activityGroupServicesService: ActivityGroupServicesService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService: PullDownListService) { }

    ngOnInit() {
        this.createForm();
        this.sharedService.setPageTitle('Activity/Service List');
        this.navigateToComponent('service-group-list');
        this.loadTableData();
    }

    loadTableData() {
        this.showLoader();
        this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.selectedRowIndex = null;
                if (result.length > 0) {
                    result.map((item: any) => {
                        item['checked'] = false;
                    });
                }
                this.activityGroupData = result;
            }
        });
        this.bindDropDownValues();
    }


    ngAfterViewInit(): void {
        const element = window.document.getElementById('main-section');
        if (element !== null) {
            const height = (window.innerHeight) - 194;
            element.style.minHeight = height + 'px !important';
        }
    }
    /**
     * @method createForm
     * @description declare the form fileds
     */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [null],
            'activityGroupId': [null],
            'activityGroupName': [null, Validators.required],
            'activityGroupType': [null, Validators.required],
            'activityCalculateHoursforActivityGroup': [null],
            'activityReportActivityGroup': [null],
            'activityGroupTypeName': [null]
        });
        this.moveFormGroup = this.formBuilder.group({
            'id': ['', Validators.required]
        });
        this.mergeFormGroup = this.formBuilder.group({
            'id': ['', Validators.required] 
        });
    }


    /**
* @method setValuesToUpdate
* @description Set the select row values in formgroup
*/
    setValuesToUpdate(data: any) {
        console.log('selectedRow:', data);
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityServiceGroupListPopupVisiblity = true;
            this.isEdit = true;
            this.existingAccountData = this.selectedRow;
        }
    }

    showMoveItemPopup(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityGroupServiceListMovePopupVisiblity = true;
            Object.keys(this.moveExistingAccountData).forEach((i) => this.moveExistingAccountData[i] = null);
            this.moveFormGroup.reset();
        }
    }

    showMergeItemPopup(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.activityGroupServiceListMergePopupVisiblity = true;
            Object.keys(this.mergeExistingAccountData).forEach((i) => this.mergeExistingAccountData[i] = null);
            this.mergeFormGroup.reset();
        }
    }

    deleteSelectedRow(data: any) {
        this.selectedRow = data;
        if (this.selectedRow) {
            const data = {
                activityGroupId: this.selectedRow.activityGroupId
            }
            const message = 'Are you sure, you want to remove this record:';
            this.modal.confirm({
                nzTitle: 'Confirm Remove Record?',
                nzContent: message + ' ' + this.selectedRow.activityGroupName,
                nzOkText: 'Yes',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => this.deleteRecord(data),
                nzCancelText: 'No',
                nzOnCancel: () => this.hideLoader()
            });
        }
    }

    deleteRecord(data: any) {
        this.showLoader();
        this._activityGroupServicesService.deleteActivityGroupList(data).subscribe(result1 => {
            this._activityGroupServicesService.getActivityGroupList('').subscribe(result2 => {
                this.hideLoader();
                if (result2) {
                    this.selectedRowIndex = null;
                    this.selectedRow = null;
                    this.unCheckAll();
                    this.activityGroupData = result2;
                    this.notificationService.createNotificationBasic('success', "Success", 'Deleted successfully!');
                }
            });
        });
    }
    showLoader() {
        this.isLoading = true;
        this.isConfirmActivityGroupLoading = true;
    }

    hideLoader() {
        this.isLoading = false;
        this.isConfirmActivityGroupLoading = false;
        this.isActivityGroupServiceListMergeLoading = false;
        this.isActivityGroupServiceListMoveLoading = false;
    }

    sorting(attr: string) {
        if (this.activityGroupData.length > 0) {
            this.activityGroupData = [...this.activityGroupData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    sorting2(attr: string) {
        if (this.activityGroupData.length > 0) {
            this.activityGroupData = [...this.activityGroupData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
    /**
     * @method navigateToComponent
     * @description navigate the service group list companant
     */
    navigateToComponent(componentName: string) {
        if (componentName === 'service-group-list') {
            this.router.navigate(['admin/customize/service-group-list']);
        } else if (componentName === 'services-list') {
            this.router.navigate(['admin/customize/services-list']);
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
        this._activityGroupServicesService.getActivityGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                Object.keys(this.existingAccountData).forEach((i) => this.existingAccountData[i] = null);
                this.existingAccountData.id = result + 1;
            } else {
                this.existingAccountData.id = 1;
            }
            this.activityServiceGroupListPopupVisiblity = true;
        });
    }
    applyFilter(event: any) {

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
    }
    handleCancel() {
        this.activityServiceGroupListPopupVisiblity = false;
        this.activityGroupServiceListMovePopupVisiblity = false;
        this.activityGroupServiceListMergePopupVisiblity = false;
    }
    unCheckAll() {
        this.activityGroupData.map((item: any) => {
            item.checked = false;
         });
    }
    /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
    bindDropDownValues() {
        let data: any = ['ACTIVITYGROUPTYPE'];
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            if (result?.ACTIVITYGROUPTYPE) {
                this.activityGroupTypes = result.ACTIVITYGROUPTYPE;
            }
        });
    }
    /**
    * @method addNewGroupName
    * @description Add the group record
    */
    addNewGroupName() {
        if (this.formGroup.valid) {
            this.existingAccountData['activityAdd'] = '';
            this.existingAccountData['activityBoltService'] = '';
            this.isConfirmActivityGroupLoading = true;
            this._activityGroupServicesService.getActivityGroupByActivityGroupNameAndActivityGroupType(this.existingAccountData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "Info", 'Activity group name should be unique in all activity group type!');
                    this.formGroup.get('activityGroupName')?.setValue('');
                    this.isConfirmActivityGroupLoading = false;
                    return;
                } else {
                    this.showLoader();
                    this._activityGroupServicesService.postActivityGroupList(this.existingAccountData).subscribe(result => {
                        if (result) {
                            this._activityGroupServicesService.getActivityGroupList('').subscribe(result => {
                                this.hideLoader();
                                if (result) {
                                    this.isConfirmActivityGroupLoading = false;
                                    this.activityServiceGroupListPopupVisiblity = false;
                                    this.selectedRowIndex = null;
                                    this.activityGroupData = result;
                                    this.notificationService.createNotificationBasic('success', "Success", 'Saved successfully!');
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
    onConfirmMove(): void {
        if (this.moveFormGroup.valid) {
            this.isActivityGroupServiceListMoveLoading = true;
            this.currentValId = this.moveFormGroup?.get('id')?.value;
            let status = this.verifyStandingIdForMove(this.currentValId);
            if (!status) {
                this.getDeletedItemByIdForMove(this.currentValId);
            }
        } else {
            this.moveFormGroup.markAllAsTouched();
        }
    }
    verifyStandingIdForMove(currentId: any) {
        let status = true;
        const data = this.activityGroupData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            let message = "Enter a different number as the number is already in use or To combine to lists use the merge option instead!";
            const modal = this.modal.warning({
                nzTitle: message,
                nzContent: '',
                nzOnOk: () => {
                    this.moveFormGroup.get("id")?.setValue('');
                    status = true;
                    this.isActivityGroupServiceListMoveLoading = false;
                }
            });

            setTimeout(() => {
                modal.destroy();
                this.moveFormGroup.get("id")?.setValue('');
                status = true;
                this.isActivityGroupServiceListMoveLoading = false;
            }, 5000);
        } else {
            status = false;
        }
        return status;
    }
    getDeletedItemByIdForMove(currentValId: any) {
        const verifyData = {
            id: currentValId,
            tempId: this.selectedRow.id
        }
        this._activityGroupServicesService.getDeletedGroupById(currentValId).subscribe(result => {
            if (result && result != null) {
                let message = "Activity group name was deleted for this number. Do you want to recall the old activity group?";
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'Ok',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this.isActivityGroupServiceListMoveLoading = true;
                        const currentData = {
                            activityGroupId: result.activityGroupId,
                            id: result.id
                        }
                        this._activityGroupServicesService.recoverActivityGroupById(currentData).subscribe(result2 => {
                            if (result2) {
                                this.isActivityGroupServiceListMoveLoading = false;
                                this.activityGroupServiceListMovePopupVisiblity = false;
                                this.loadTableData();
                            }
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.isActivityGroupServiceListMoveLoading = false; }
                });
            } else {
                let message = "Do you want to move activity group " + this.selectedRow.activityGroupName + " from No. " + this.selectedRow.id + " to No. " + currentValId + "?";
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'Ok',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this.isActivityGroupServiceListMoveLoading = true;
                        this._activityGroupServicesService.updateActivityGroupById(verifyData).subscribe(result3 => {
                            this.isActivityGroupServiceListMoveLoading = false;
                            this.activityGroupServiceListMovePopupVisiblity = false;
                            this.loadTableData();
                            this.notificationService.createNotificationBasic('success', "Success", 'Moved successfully!');
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.isActivityGroupServiceListMoveLoading = false; }
                });
            }
        });
    }

    onConfirmMerge() {
        if (this.mergeFormGroup.valid) {
            let val = this.mergeFormGroup?.get('id')?.value.split('|')[1];
            if (val) {
                if (Number(this.selectedRow.id) == Number(val.trim())) {
                    this.notificationService.createNotificationBasic('info','Info','Same activity group can not be merge!');
                    this.mergeFormGroup.get("id")?.setValue('');
                    return;
                } else {
                    this.currentValId = val.trim();
                }
            } else {
                this.notificationService.createNotificationBasic('info','Info','Please select correct value!');
                this.mergeFormGroup.get("id")?.setValue('');
                return;
            }
            this.getDeletedItemByIdMerge(this.currentValId);
        } else {
            this.mergeFormGroup.markAllAsTouched();
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
        let status = this.verifyServiceGroupIdMerge(this.currentValId);
        if (!status) {
            let message = "Do you want to merge activity group. " + this.selectedRow.activityGroupName + " from No. " + this.selectedRow.id + " to No. " + id + "?";
            this.modal.confirm({
                nzTitle: 'Confirm Remove Record?',
                nzContent: message,
                nzOkText: 'Yes',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.isActivityGroupServiceListMergeLoading =true;
                    this._activityGroupServicesService.mergeActivityGroupById(verifyData).subscribe(result3 => {
                        if (result3) {
                            this.isActivityGroupServiceListMergeLoading = false;
                            this.activityGroupServiceListMergePopupVisiblity = false;
                            this.notificationService.createNotificationBasic('success','Success','Merge Successfully Done');
                            this.loadTableData();
                        }
                    });
                },
                nzCancelText: 'No',
                nzOnCancel: () => this.hideLoader()
            });
        }
    }

    /**
  * @method verifyServiceGroupIdMerge
  * @description Verify the service groupId name.
  */
    verifyServiceGroupIdMerge(currentId: any) {
        currentId = Number(currentId);
        let status = false;
        const data = this.activityGroupData.filter((item: any) => ((item.id) === (currentId)));
        if (data && data.length > 0) {
            status = false;
        } else {
            this.notificationService.createNotificationBasic('info','Info','This record does not exist!');
            this.mergeFormGroup.get("id")?.setValue('');
            status = true;
        }
        return status;
    }

}