import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { GradeStandingListMoveBoxComponent } from '../../move-box/grade-standing-list-move-box/grade-standing-list-move-box.component';
import { GradeStandingListMergeBoxComponent } from '../../merge-box/grade-standing-list-merge-box/grade-standing-list-merge-box.component';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';

@Component({
    selector: 'app-grade-standing-list',
    templateUrl: './grade-standing-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class GradeStandingListComponent implements OnInit {
    formGroup: FormGroup;
    gradeStandingListData: any = [];
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
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    isMoved: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    columnsToDisplay: string[] = ['gradingId', 'gradingName', 'gradingGroupName', 'gradingFiscalYear'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    ddlGroupList: any = [];
    lastIndexRow = 0;
    updateIndexValue: any;
    validationClass: ValidationClass = new ValidationClass();
    gradingFiscalYearList: any = [];
    participantList: any = [];
    yearEndFYList: any = [];

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService: PullDownListService) { }

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
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.gradeStandingListData = result;
            }
        });
        this._gradingGroupStandingService.getGradingGroupList('').subscribe(gradingGroupResult => {
            if (gradingGroupResult) {
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
    applyFilter(filterValue: any) {
        if(filterValue.target.value.trim().toLowerCase() == 'no'){
            this.dataSource.filter = 'false';
        }else if(filterValue.target.value.trim().toLowerCase() == 'yes'){
            this.dataSource.filter = 'true';
        }else{
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        }
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
  * @method setValuesToUpdate
  * @description Set the select row values in formgroup
  */
    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.formGroup.get('id') ?.setValue(this.selectedRow.id);
            this.formGroup.get('gradingId') ?.setValue(this.selectedRow.gradingId);
            this.formGroup.get('gradingName') ?.setValue(this.selectedRow.gradingName);
            this.formGroup.get('gradingGroupName') ?.setValue(this.selectedRow.gradingGroupName);
            this.formGroup.get('gradingParticipantStatus') ?.setValue(this.selectedRow.gradingParticipantStatus);
            this.formGroup.get('gradingYearEnbStatus') ?.setValue(this.selectedRow.gradingYearEnbStatus);
            this.formGroup.get('gradingFiscalYear') ?.setValue(this.selectedRow.gradingFiscalYear);
            this.openModal(this.gradeStandingListPopupRef);
        } else {
            this.toastr.info('Please select a record to update', '', {
                timeOut: 5000,
                closeButton: true
            });

        }
    }


    /**
   * @method openModal
   * @description open model
   */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
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
                this.formGroup.get('id') ?.setValue(result + 1);
                // this._gradeGroupStandingList.gradeGroupId = result + 1;
            } else {
                this.formGroup.get('id') ?.setValue(1);
            }
            this.openModal(this.gradeStandingListPopupRef);
        });
    }

    /**
 * @method hideLoader
 * @description Hide loader
 */
    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    /**
   * @method showLoader
   * @description Show loader
   */
    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
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
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.gradingId = this.formGroup ?.get('gradingId') ?.value;
            this.requestData.gradingName = this.formGroup ?.get('gradingName') ?.value.trim();
            this.requestData.gradingGroupName = this.formGroup ?.get('gradingGroupName') ?.value.trim();
            this.requestData.gradingParticipantStatus = this.formGroup ?.get('gradingParticipantStatus') ?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup ?.get('gradingYearEnbStatus') ?.value;
            this.requestData.gradingFiscalYear = this.formGroup ?.get('gradingFiscalYear') ?.value;
            // let status = this.checkGroupNameAndType(this.requestData.gradingName, this.requestData.gradeGroupGradeType);
            // if(!status){
            this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.toastr.info('Grade name should be unique in all grade group name!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.formGroup.get('gradingName') ?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._gradingGroupStandingService.postGradingStandingList(this.requestData).subscribe(result => {
                        if (result) {
                            this.showLoader();
                            this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                                this.hideLoader();
                                this.modalRef.hide();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.dataSource = new MatTableDataSource(result);
                                    this.dataSource.paginator = this.paginator;
                                    this.selectedRow = null;
                                    this.dataSource.sort = this.sort;
                                    this.gradeStandingListData = result;
                                    this.toastr.success('Saved successfully!', '', {
                                        timeOut: 5000,
                                        closeButton: true
                                    });

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

    /**
   * @method deleteSelectedRow
   * @description delete the school record
   */
    deleteSelectedRow() {
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
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.gradeStandingListData = result;
                                this.toastr.success('Deleted successfully!', '', {
                                    timeOut: 5000,
                                    closeButton: true
                                });
                            }
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    /**
    * @method updateSelectedRow
    * @description update the school record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.isEdit = true;
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.gradingId = this.formGroup ?.get('gradingId') ?.value;
            this.requestData.gradingName = this.formGroup ?.get('gradingName') ?.value.trim();
            this.requestData.gradingGroupName = this.formGroup ?.get('gradingGroupName') ?.value.trim();
            this.requestData.gradingParticipantStatus = this.formGroup ?.get('gradingParticipantStatus') ?.value;
            this.requestData.gradingYearEnbStatus = this.formGroup ?.get('gradingYearEnbStatus') ?.value;
            this.requestData.gradingFiscalYear = this.formGroup ?.get('gradingFiscalYear') ?.value;
            // let status = this.checkGroupNameAndType(this.requestData.gradeGroupName, this.requestData.gradeGroupGradeType);
            // if(!status){
            this._gradingGroupStandingService.getGradingByGradingNameAndGradingGroupName(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateGradindList();
                } else {
                    if ((this.selectedRow.gradingName.toLowerCase() == this.formGroup ?.get('gradingName') ?.value.toLowerCase()) &&
                        (this.selectedRow.gradingGroupName.toLowerCase() == this.formGroup ?.get('gradingGroupName') ?.value.toLowerCase())
                    ) {
                        this.updateGradindList();
                    } else {
                        this.toastr.info('Grade name should be unique in all grade group name!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                        this.formGroup.get('gradingName') ?.setValue('');
                        return;
                    }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    updateGradindList(){
        this.showLoader();
        this._gradingGroupStandingService.updateGradingStandingList(this.requestData).subscribe(response => {
            this._gradingGroupStandingService.getGradingStandingList('').subscribe(result => {
                this.hideLoader();
                this.modalRef.hide();
                this.selectedRowIndex = null;
                if (result) {
                    this.dataSource = new MatTableDataSource(result);
                    this.dataSource.paginator = this.paginator;
                    this.selectedRow = null;
                    this.dataSource.sort = this.sort;
                    this.gradeStandingListData = result;
                    this.isEdit = false;
                    this.toastr.success('Updated successfully!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                }
            });
        });
    }

    /**
   * @method showMoveItemPopup
   * @description Open the popup for move the record
   */
    showMoveItemPopup() {
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
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeStandingListData = result;
                        }
                    });
                }
            });
        } else {
            this.toastr.info('Please select a row to move', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    /**
    * @method showMergeItemPopup
    * @description Open the popup for merge the record
    */
    showMergeItemPopup() {
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
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeStandingListData = result;
                        }
                    });
                }
            });
        } else {
            this.toastr.info('Please select a row to merge', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

     /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
      bindDropDownValues() {
        let data: any = ['gradingFiscalYearList','participantList','yearEndFYList'];
        this.pullDownService.getMultiplePulldownListByCode(data).subscribe((result: any) => {
            if (result?.body?.gradingFiscalYearList) {
                this.gradingFiscalYearList = result.body.gradingFiscalYearList;
            }
            if (result?.body?.participantList) {
                this.participantList = result.body.participantList;
            }
            if (result?.body?.yearEndFYList) {
                this.yearEndFYList = result.body.yearEndFYList;
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
}
