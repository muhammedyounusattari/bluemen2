import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { GradeStandingListMoveBoxComponent } from '../../move-box/grade-standing-list-move-box/grade-standing-list-move-box.component';
import { GradeStandingListMergeBoxComponent } from '../../merge-box/grade-standing-list-merge-box/grade-standing-list-merge-box.component';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
    selector: 'app-grade-standing-list',
    templateUrl: './grade-standing-list.component.html',
    styleUrls: ['./grade-standing-list.component.css']
})

export class GradeStandingListComponent implements OnInit {
    formGroup: FormGroup;
    gradeStandingListData: any = [];
    gradeStandingListSearchData: any = [];

    requestData = {
        id: '',
        gradingId: '',
        gradingName: '',
        gradingGroupName: '',
        gradingParticipantStatus: '',
        gradingYearEnbStatus: '',
        gradingFiscalYear: ''
    }

    @ViewChild('gradeStandingListPopup') gradeStandingListPopupRef: TemplateRef<any>;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;

    isLoading: boolean = true;
    ddlGroupList: any = [];
    lastIndexRow = 0;
    updateIndexValue: any;
    validationClass: ValidationClass = new ValidationClass();
    gradingFiscalYearList: any = [];
    participantList: any = [];
    yearEndFYList: any = [];

    gradeModalHeader = 'Customize Grade/Standing';
    gradeListPopupVisiblity = false;
    isGradeLoading = false;
    isConfirmGradeLoading = false;

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
        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
            let domElement = window.document.getElementById('GRADE_STANDING');
            this.hideLoader();
            if (domElement) {
                domElement.style.borderBottom = "thick solid #0000FF";
            }
            if (result) {
                this.selectedRowIndex = null;
                this.gradeStandingListData = result;
                this.gradeStandingListSearchData = result;
            }
        });
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(gradingGroupResult => {
            if (gradingGroupResult) {
                console.log(gradingGroupResult);
                this.ddlGroupList = gradingGroupResult;
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
            'gradingId': [''],
            'gradingName': ['', Validators.required],
            'gradingGroupName': ['', Validators.required],
            'gradingFiscalYear': [''],
            'gradingParticipantStatus': [''],
            'gradingYearEnbStatus': ['']
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
        this.gradeStandingListSearchData.forEach((value: any) => {
            //let keys = Object.keys(value);
            let keys = ['id', 'gradingName', 'gradingGroupName', 'gradingFiscalYear'];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.gradeStandingListData = targetValue;
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
            this.formGroup.get('gradingId')?.setValue(this.selectedRow.gradingId);
            this.formGroup.get('gradingName')?.setValue(this.selectedRow.gradingName);
            this.formGroup.get('gradingGroupName')?.setValue(this.selectedRow.gradingGroupName);
            this.formGroup.get('gradingParticipantStatus')?.setValue(this.selectedRow.gradingParticipantStatus);
            this.formGroup.get('gradingYearEnbStatus')?.setValue(this.selectedRow.gradingYearEnbStatus);
            this.formGroup.get('gradingFiscalYear')?.setValue(this.selectedRow.gradingFiscalYear);
            this.gradeListPopupVisiblity = true;
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
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingStandingMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id')?.setValue(result + 1);
            } else {
                this.formGroup.get('id')?.setValue(1);
            }
            this.gradeListPopupVisiblity = true;
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
        this.updateIndexValue = index + 1;
        this.selectedRow = selectedRowItem;
    }

    /**
  * @method addGradeStanding
  * @description Add the grade standing record
  */
    addGradeStanding() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradingId = this.formGroup?.get('gradingId')?.value;
            this.requestData.gradingName = this.formGroup?.get('gradingName')?.value.trim();
            this.requestData.gradingGroupName = this.formGroup?.get('gradingGroupName')?.value.trim();
            this.requestData.gradingParticipantStatus = this.formGroup?.get('gradingParticipantStatus')?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup?.get('gradingYearEnbStatus')?.value;
            this.requestData.gradingFiscalYear = this.formGroup?.get('gradingFiscalYear')?.value;
            this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.notificationService.createNotificationBasic('info', "Info", 'Grade name should be unique in all grade group name!');
                    this.formGroup.get('gradingName')?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
                        if (result) {
                            this.showLoader();
                            this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                                this.hideLoader();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.isGradeLoading = false;
                                    this.gradeListPopupVisiblity = false;
                                    this.selectedRow = null;
                                    this.gradeStandingListData = result;
                                    this.gradeStandingListSearchData = result;
                                    this.notificationService.createNotificationBasic('info', "Info", 'Saved successfully!');

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
   * @description delete the school record
   */
    deleteSelectedRow(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            const data = {
                gradingId: this.selectedRow.gradingId
            }
            //this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedRow.gradingName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._gradingGroupStandingService.deleteGradingStandingList(data).subscribe(result => {
                        this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.selectedRow = null;
                                this.gradeStandingListData = result;
                                this.gradeStandingListSearchData = result;
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
    * @description update the school record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.isEdit = true;
            this.requestData.id = this.formGroup?.get('id')?.value;
            this.requestData.gradingId = this.formGroup?.get('gradingId')?.value;
            this.requestData.gradingName = this.formGroup?.get('gradingName')?.value.trim();
            this.requestData.gradingGroupName = this.formGroup?.get('gradingGroupName')?.value.trim();
            this.requestData.gradingParticipantStatus = this.formGroup?.get('gradingParticipantStatus')?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup?.get('gradingYearEnbStatus')?.value;
            this.requestData.gradingFiscalYear = this.formGroup?.get('gradingFiscalYear')?.value;
            // let status = this.checkGroupNameAndType(this.requestData.gradeGroupName, this.requestData.gradeGroupGradeType);
            // if(!status){
            this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateGradindList();
                } else {
                    if ((this.selectedRow.gradingName.toLowerCase() == this.formGroup?.get('gradingName')?.value.toLowerCase()) &&
                        (this.selectedRow.gradingGroupName.toLowerCase() == this.formGroup?.get('gradingGroupName')?.value.toLowerCase())
                    ) {
                        this.updateGradindList();
                    } else {
                        this.notificationService.createNotificationBasic('info', "info", 'Grade name should be unique in all grade group name!');
                        this.formGroup.get('gradingName')?.setValue('');
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

    updateGradindList() {
        this.showLoader();
        this._gradingGroupStandingService.updateGradingStandingList(this.requestData).subscribe(response => {
            this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.gradeStandingListData = result;
                    this.gradeStandingListSearchData = result;
                    this.isEdit = false;
                    this.notificationService.createNotificationBasic('success', "success", 'Updated successfully!');
                    this.gradeListPopupVisiblity = false;
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
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(GradeStandingListMoveBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Name',
                    message: '',
                    gradeStandingList: this.gradeStandingListData,
                    selectedGradingId: this.selectedRow.gradingId,
                    selectedId: this.selectedRow.id,
                    selectedGradingName: this.selectedRow.gradingName,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeStandingListData = result;
                            this.gradeStandingListSearchData = result;
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
            //this.showLoader();
            const confirmDialog = this.dialog.open(GradeStandingListMergeBoxComponent, {
                data: {
                    title: 'Customize Grade and Grade Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.gradingName,
                    gradeStandingList: this.gradeStandingListData,
                    selectedGradingId: this.selectedRow.gradingId,
                    selectedId: this.selectedRow.id,
                    selectedGradingName: this.selectedRow.gradingName
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                        this.hideLoader();
                        if (result) {
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeStandingListData = result;
                            this.gradeStandingListSearchData = result;
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


    /**
    * @method print
    * @description show print and download the data.
    */
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

    /**
   * @method sorting
   * @description this method is used for asc sorting
   */
    sorting(attr: string) {
        if (this.gradeStandingListData.length > 0) {
            this.gradeStandingListData = [...this.gradeStandingListData].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
    * @method sorting
    * @description this method is used for desc sorting
    */
    sorting2(attr: string) {
        if (this.gradeStandingListData.length > 0) {
            this.gradeStandingListData = [...this.gradeStandingListData].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }

    /**
   * @method handleCancel
   * @description this method is used for hide popup and loading
   */
    handleCancel() {
        this.isGradeLoading = false;
        this.gradeListPopupVisiblity = false;
    }
}
