import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GradingGroupStandingService } from '../../../../../services/admin/grading-group-standing.service';
import { GradeGroupStandingList } from '../../../../../constants/enums/grade-group-standing-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GradeStandingGroupListMoveBoxComponent } from '../../move-box/grade-standing-group-list-move-box/grade-standing-group-list-move-box.component';
import { GradeStandingGroupListMergeBoxComponent } from '../../merge-box/grade-standing-group-list-merge-box/grade-standing-group-list-merge-box.component';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';

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
    requestData = {
        id: '',
        gradeGroupId: '',
        gradeGroupName: '',
        gradeGroupGradeType: '',
        gradeGroupAprColumn: ''
    }
    _gradeGroupStandingList: GradeGroupStandingList = new GradeGroupStandingList();

    @ViewChild('gradeGroupListPopup') gradeGroupListPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    columnsToDisplay: string[] = ['id', 'gradeGroupName', 'gradeGroupAprColumn'];;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    gradeGroupGradeTypeList: any = [];
    isLoading: boolean = true;
    validationClass: ValidationClass = new ValidationClass();

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _gradingGroupStandingService: GradingGroupStandingService
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private pullDownService:  PullDownListService) { }

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
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.gradeGroupListData = result;
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
            this.formGroup.get('gradeGroupId') ?.setValue(this.selectedRow.gradeGroupId);
            this.formGroup.get('gradeGroupName') ?.setValue(this.selectedRow.gradeGroupName);
            this.formGroup.get('gradeGroupGradeType') ?.setValue(this.selectedRow.gradeGroupGradeType);
            this.formGroup.get('gradeGroupAprColumn') ?.setValue(this.selectedRow.gradeGroupGradeType);
            this.openModal(this.gradeGroupListPopupRef);
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
        this._gradeGroupStandingList = new GradeGroupStandingList();
        this.selectedRowIndex = null;
        this._gradingGroupStandingService.getGradingGroupMaxId().subscribe(result => {
            if (!this.validationClass.isNullOrUndefined(result)) {
                this.formGroup.get('id') ?.setValue(result + 1);
            } else {
                this.formGroup.get('id') ?.setValue(1);
            }
            this.openModal(this.gradeGroupListPopupRef);
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
        this.selectedRow = selectedRowItem;
    }

    /**
   * @method addGradeGroup
   * @description Add the grade group record
   */
    addGradeGroup() {
        if (this.formGroup.valid) {
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.gradeGroupId = this.formGroup ?.get('gradeGroupId') ?.value;
            this.requestData.gradeGroupName = this.formGroup ?.get('gradeGroupName') ?.value.trim();
            this.requestData.gradeGroupGradeType = this.formGroup ?.get('gradeGroupGradeType') ?.value.trim();
            this.requestData.gradeGroupAprColumn = this.formGroup ?.get('gradeGroupGradeType') ?.value.trim();
            this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(this.requestData).subscribe(result3 => {
                if (result3) {
                    this.toastr.info('Grade group name should be unique!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    this.formGroup.get('gradeGroupName') ?.setValue('');
                    return;
                } else {
                    this.showLoader();
                    this._gradingGroupStandingService.postGradingGroupList(this.requestData).subscribe(result => {
                        if (result) {
                            this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                                this.hideLoader();
                                this.modalRef.hide();
                                this.selectedRowIndex = null;
                                if (result) {
                                    this.dataSource = new MatTableDataSource(result);
                                    this.dataSource.paginator = this.paginator;
                                    this.selectedRow = null;
                                    this.dataSource.sort = this.sort;
                                    this.gradeGroupListData = result;
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
    * @description delete the record
    */
    deleteSelectedRow() {
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
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.gradeGroupListData = result;
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
    * @description update the record
    */
    updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.isEdit = true;
            this.requestData.id = this.formGroup ?.get('id') ?.value;
            this.requestData.gradeGroupId = this.formGroup ?.get('gradeGroupId') ?.value;
            this.requestData.gradeGroupName = this.formGroup ?.get('gradeGroupName') ?.value.trim();
            this.requestData.gradeGroupGradeType = this.formGroup ?.get('gradeGroupGradeType') ?.value.trim();
            this.requestData.gradeGroupAprColumn = this.formGroup ?.get('gradeGroupGradeType') ?.value.trim();
            
            this._gradingGroupStandingService.getGradingGroupByGradingGroupNameAndGradingGroupType(this.requestData).subscribe(result3 => {
                if (!result3) {
                    this.updateGradeStandingGroupList();

                } else {
                    if ((this.selectedRow.gradeGroupName.toLowerCase() == this.formGroup ?.get('gradeGroupName') ?.value.toLowerCase()) &&
                        (this.selectedRow.gradeGroupGradeType.toLowerCase() == this.formGroup ?.get('gradeGroupGradeType') ?.value.toLowerCase())
                    ) {
                        this.updateGradeStandingGroupList();
                    } else {
                        this.toastr.info('Grade group name should be unique!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                        this.formGroup.get('gradeGroupName') ?.setValue('');
                        return;
                    }
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
    }

    updateGradeStandingGroupList() {
        this.showLoader();
        this._gradingGroupStandingService.updateGradingGroupList(this.requestData).subscribe(response => {
            this._gradingGroupStandingService.getGradingGroupList('').subscribe(result => {
                this.hideLoader();
                this.modalRef.hide();
                this.selectedRowIndex = null;
                if (result) {
                    this.dataSource = new MatTableDataSource(result);
                    this.dataSource.paginator = this.paginator;
                    this.selectedRow = null;
                    this.dataSource.sort = this.sort;
                    this.gradeGroupListData = result;
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
    * @method checkGroupNameAndType
    * @description check the group name and type is exist or not
    */
    checkGroupNameAndType(groupName: any, groupType: any) {
        let status = false;
        const data = this.gradeGroupListData.filter((item: any) => ((item.gradeGroupName).toLowerCase().trim() === (groupName).toLowerCase().trim()) && ((item.gradeGroupGradeType).toLowerCase().trim() === (groupType).toLowerCase().trim()));
        if (data && data.length > 0) {
            this.toastr.info('Group name should be unique in all group type!', '', {
                timeOut: 5000,
                closeButton: true
            });
            this.formGroup.get('gradeGroupName') ?.setValue('');
            status = true;
        }
        return status;

    }

    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup() {
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
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeGroupListData = result;
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
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.selectedRowIndex = null;
                            this.selectedRow = null;
                            this.gradeGroupListData = result;
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
        let data: any = ['StandingGroupType_APRColumn'];
        this.pullDownService.getMultiplePulldownListByCode(data).subscribe((result: any) => {
            if (result?.body?.StandingGroupType_APRColumn) {
                this.gradeGroupGradeTypeList = result.body.StandingGroupType_APRColumn;
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

}
