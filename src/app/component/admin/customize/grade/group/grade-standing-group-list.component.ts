import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GradeStandingGroupListMoveBoxComponent } from '../../move-box/grade-standing-group-list-move-box/grade-standing-group-list-move-box.component';
import { GradeStandingGroupListMergeBoxComponent } from '../../merge-box/grade-standing-group-list-merge-box/grade-standing-group-list-merge-box.component';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
    selector: 'app-grade-standing-group-list',
    templateUrl: './grade-standing-group-list.component.html',
    styleUrls: ['./grade-standing-group.component.css']
})
/**
 * GradeStandingGroupList Component 
 */
export class GradeStandingGroupListComponent implements OnInit {
    formGroup: FormGroup;
    gradeGroupListData: any = [];
    gradeGroupListSearchData: any = [];
    requestData = {
        id: '',
        gradeGroupId: '',
        gradeGroupName: '',
        gradeGroupGradeType: '',
        gradeGroupAprColumn: ''
    }
    _gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

    @ViewChild('gradeGroupListPopup') gradeGroupListPopupRef: TemplateRef<any>;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    selectedRowIndex: any;
    gradeGroupGradeTypeList: any = [];
    isLoading: boolean = true;
    gradeGroupModalHeader = 'Customize Grade/Standing Group';
    gradeGroupListPopupVisiblity = false;
    isGradeGrpLoading = false;
    isConfirmGradeGroupLoading = false;
    validationClass: ValidationClass = new ValidationClass();
    
    constructor(private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService: PullDownListService
        , private notificationService: NotificationUtilities) { }

    ngOnInit() {
        this.sharedService.setPageTitle('Grade/Standing List');
        this.createForm();
        this.myElement = window.document.getElementById('loading');
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('GRADE_GROUP');
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.gradeGroupListData = result;
                this.gradeGroupListSearchData = result;
            }

        });
        this.bindDropDownValues();
    }

    /**
   * @method createForm
   * @description declare the form fileds
   */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'id': [''],
            'gradeGroupId': [''],
            'gradeGroupName': ['', Validators.required],
            'gradeGroupGradeType': ['', Validators.required],
        });
    }

    /**
    * @method navigateToComponent
    * @description navigate the grade group list companant
    */
    navigateToComponent(componentName: string) {
        if (componentName === 'grade-group-list') {
            this.router.navigate(['admin/customize/grade-group-list']);
        } else if (componentName === 'grade-standing-list') {
            this.router.navigate(['admin/customize/grade-standing-list']);
        }
    }

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
       this.gradeGroupListData = targetValue;
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
            this.formGroup.get('gradeGroupId')?.setValue(this.selectedRow.gradeGroupId);
            this.formGroup.get('gradeGroupName')?.setValue(this.selectedRow.gradeGroupName);
            this.formGroup.get('gradeGroupGradeType')?.setValue(this.selectedRow.gradeGroupGradeType);
            this.formGroup.get('gradeGroupAprColumn')?.setValue(this.selectedRow.gradeGroupGradeType);
            this.gradeGroupListPopupVisiblity = true;
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a record to update');
        }
    }

    /**
    * @method resetFields
    * @description Reset the all form group fields
    */
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this._gradeGroupStandingList = new GradeGroupStandingList();
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
            } else {
                this.formGroup.get('id')?.setValue(1);
            }
            this.gradeGroupListPopupVisiblity = true;
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
    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    /**
   * @method addGradeGroup
   * @description Add the grade group record
   */
    addGradeGroup() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradeGroupId = this.formGroup?.get('gradeGroupId')?.value;
            this.requestData.gradeGroupName = this.formGroup?.get('gradeGroupName')?.value.trim();
            this.requestData.gradeGroupGradeType = this.formGroup?.get('gradeGroupGradeType')?.value.trim();
            this.requestData.gradeGroupAprColumn = this.formGroup?.get('gradeGroupGradeType')?.value.trim();
            this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "Info", 'Grade group name should be unique!');
                    this.formGroup.get('gradeGroupName')?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._gradingGroupStandingService.postGradingGroupList(this.requestData).subscribe(result => {
                        if (result) {
                            this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                                this.hideLoader();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.isGradeGrpLoading = false;
                                    this.gradeGroupListPopupVisiblity = false;
                                    this.selectedRow = null;
                                    this.gradeGroupListData = result;
                                    this.gradeGroupListSearchData = result;
                                    this.notificationService.createNotificationBasic('success', "Success", 'Saved successfully!');
                                }
                            });
                        }
                    });
                }
            });
        } else {
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
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
                gradeGroupId: this.selectedRow.gradeGroupId
            }
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._gradingGroupStandingService.deleteGradingGroupList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.selectedRow = null;
                                this.gradeGroupListData = result;
                                this.gradeGroupListSearchData = result;
                                this.notificationService.createNotificationBasic('success', "success", 'Deleted successfully!');
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to delete');
        }
    }

    /**
    * @method updateSelectedRow
    * @description update the record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.isEdit = true;
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradeGroupId = this.formGroup?.get('gradeGroupId')?.value;
            this.requestData.gradeGroupName = this.formGroup?.get('gradeGroupName')?.value.trim();
            this.requestData.gradeGroupGradeType = this.formGroup?.get('gradeGroupGradeType')?.value.trim();
            this.requestData.gradeGroupAprColumn = this.formGroup?.get('gradeGroupGradeType')?.value.trim();

            this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateGradeStandingGroupList();

                } else {
                    if ((this.selectedRow.gradeGroupName.toLowerCase() == this.formGroup?.get('gradeGroupName')?.value.toLowerCase()) &&
                        (this.selectedRow.gradeGroupGradeType.toLowerCase() == this.formGroup?.get('gradeGroupGradeType')?.value.toLowerCase())
                    ) {
                        this.updateGradeStandingGroupList();
                    } else {
                        this.notificationService.createNotificationBasic('info', "info", 'Grade group name should be unique!');
                        this.formGroup.get('gradeGroupName')?.setValue('');
                        return;
                    }
                }
            });
        } else {
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }
    }

    /**
    * @method updateGradeStandingGroupList
    * @description this method is common for all update records
    */
    updateGradeStandingGroupList() {
        this.showLoader();
        this._gradingGroupStandingService.updateGradingGroupList(this.requestData).subscribe(response => {
            this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.gradeGroupListData = result;
                    this.gradeGroupListSearchData = result;
                    this.isEdit = false;
                    this.notificationService.createNotificationBasic('success', "success", 'Updated successfully!');
                    this.gradeGroupListPopupVisiblity = false;

                }
            });
        });
    }

    /**
    * @method checkGroupNameAndType
    * @description check the group name and type is exist or not
    */
    checkGroupNameAndType(groupName: any, groupType: any) {
        let status = false;
        const data = this.gradeGroupListData.filter((item: any) => ((item.gradeGroupName).toLowerCase().trim() === (groupName).toLowerCase().trim()) && ((item.gradeGroupGradeType).toLowerCase().trim() === (groupType).toLowerCase().trim()));
        if (data && data.length > 0) {
            this.notificationService.createNotificationBasic('info', "info", 'Group name should be unique in all group type!');
            this.formGroup.get('gradeGroupName')?.setValue('');
            status = true;
        }
        return status;

    }

    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(GradeStandingGroupListMoveBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Group Name',
                    message: '',
                    gradeGroupList: this.gradeGroupListData,
                    selectedGradeGroupId: this.selectedRow.gradeGroupId,
                    selectedId: this.selectedRow.id,
                    selectedGradeGroupName: this.selectedRow.gradeGroupName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeGroupListData = result;
                            this.gradeGroupListSearchData = result;
                        }
                    });
                }
            });
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to move!');
        }
    }

    /**
     * @method showMergeItemPopup
     * @description Open the popup for merge the record
     */
    showMergeItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            const confirmDialog = this.dialog.open(GradeStandingGroupListMergeBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Group Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.GradeGroupName + "?",
                    gradeGroupList: this.gradeGroupListData,
                    selectedGradeGroupId: this.selectedRow.gradeGroupId,
                    selectedId: this.selectedRow.id,
                    selectedGradeGroupName: this.selectedRow.gradeGroupName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeGroupListData = result;
                            this.gradeGroupListSearchData = result;
                        }
                    });
                }
            });
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to merge!');
        }
    }

    /**
   * @method bindDropDownValues
   * @description Get the all pull down item list
   */
    bindDropDownValues() {
        let data: any = 'STANDINGGROUPTYPE';
        this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
            console.log(result);
            if (result?.STANDINGGROUPTYPE) {
                this.gradeGroupGradeTypeList = result.STANDINGGROUPTYPE;
            }
        });
    }


    /**
     * @method print
     * @description show print and download the data.
     */
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

    /**
    * @method sorting
    * @description this method is used for asc sorting
    */
    sorting(attr: string) {
        if (this.gradeGroupListData.length > 0) {
            this.gradeGroupListData = [...this.gradeGroupListData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
    * @method sorting
    * @description this method is used for desc sorting
    */
    sorting2(attr: string) {
        if (this.gradeGroupListData.length > 0) {
            this.gradeGroupListData = [...this.gradeGroupListData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }

    /**
   * @method handleCancel
   * @description this method is used for hide popup and loading
   */
    handleCancel() {
        this.isGradeGrpLoading = false;
        this.gradeGroupListPopupVisiblity = false;
    }

}
