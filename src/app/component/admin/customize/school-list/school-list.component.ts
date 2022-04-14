import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CollegeAndSchoolService } from '../../../../services/admin/college-school.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { CollegeSchoolListMergeBoxComponent } from '../merge-box/college-school-list-merge-box/college-school-list-merge-box.component';
import { CollegeSchoolListMoveBoxComponent } from '../move-box/college-school-list-move-box/college-school-list-move-box.component';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class SchoolListComponent implements OnInit {

    schoolDataList: any = [];
    @ViewChild('schoolNamePopup') schoolNamePopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isDisabled: boolean = false;
    isEdit: boolean = false;
    requestData: any = {
        id: '',
        orgName: '',
        orgType: '',
        name: '',
        codes: '',
        address: '',
        city: '',
        country: '',
        email: '',
        fax: '',
        notes: '',
        phone1: '',
        phone2: '',
        phone3: '',
        states: '',
        title: '',
        website: '',
        zipcode: '',
        fafsaId: null,
        fiscalYear: '',
        ncesId: '',
        inPullDown: false
    };
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    formGroup: FormGroup;
    columnsToDisplay: string[] = ['name', 'inPullDown', 'ncesId', 'country', 'phone1', 'phone2', 'phone3', 'fax'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    countryList: any = [];
    cityList: any = [];
    stateList: any = [];
    validationClass: ValidationClass = new ValidationClass();
    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _collegeAndSchoolService: CollegeAndSchoolService
        , private toastr: ToastrService
        , private _pullDownListService: PullDownListService
        , private sharedService: SharedService
        , private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.sharedService.setPageTitle('College/School List');
        this.createForm();
        this.navigateToComponent('school-list');
        this.myElement = window.document.getElementById('loading');
        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('SCHOOL_LIST');
            if (domElement) {
                domElement.style.borderBottom = "2px solid #1672B7";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.schoolDataList = result;
            }
        });
        this.bindDropDownValues();
    }

    /**
    * @method navigateToComponent
    * @description navigate the college and school list companant
    */
    navigateToComponent(componentName: string) {
        if (componentName === 'college-list') {
            this.router.navigate(['admin/customize/college-list']);
        } else if (componentName === 'school-list') {
            this.router.navigate(['admin/customize/school-list']);
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
    * @method createForm
    * @description declare the form fileds
    */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'collegeSchoolId': [''],
            'name': ['', Validators.required],
            'inPullDown': [''],
            'codes': [''],
            'title': [''],
            'country': [''],
            'address': [''],
            'ncesId': [''],
            'city': [''],
            'states': [''],
            'zipcode': [''],
            'fiscalYear': [''],
            'phone1': [''],
            'phone2': [''],
            'phone3': [''],
            'fax': [''],
            'website': [''],
            'email': ['', [Validators.pattern(this.emailPattern)]],
            'notes': ['']
        });
    }

    /**
    * @method setValuesToUpdate
    * @description Set the select row values in formgroup
    */
    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.isDisabled = true;
            this.formGroup.get('collegeSchoolId') ?.setValue(this.selectedRow.collegeSchoolId);
            this.formGroup.get('orgName') ?.setValue(this.selectedRow.name);
            this.formGroup.get('inPullDown') ?.setValue(this.selectedRow.inPullDown);
            this.formGroup.get('name') ?.setValue(this.selectedRow.name);
            this.formGroup.get('codes') ?.setValue(this.selectedRow.codes);
            this.formGroup.get('title') ?.setValue(this.selectedRow.title);
            this.formGroup.get('country') ?.setValue(this.selectedRow.country);
            this.formGroup.get('address') ?.setValue(this.selectedRow.address);
            this.formGroup.get('ncesId') ?.setValue(this.selectedRow.ncesId);
            this.formGroup.get('city') ?.setValue(this.selectedRow.city);
            this.formGroup.get('states') ?.setValue(this.selectedRow.states);
            this.formGroup.get('zipcode') ?.setValue(this.selectedRow.zipcode);
            this.formGroup.get('fiscalYear') ?.setValue(this.selectedRow.fiscalYear);
            this.formGroup.get('phone1') ?.setValue(this.selectedRow.phone1);
            this.formGroup.get('phone2') ?.setValue(this.selectedRow.phone2);
            this.formGroup.get('phone3') ?.setValue(this.selectedRow.phone3);
            this.formGroup.get('fax') ?.setValue(this.selectedRow.fax);
            this.formGroup.get('website') ?.setValue(this.selectedRow.website);
            this.formGroup.get('email') ?.setValue(this.selectedRow.email);
            this.formGroup.get('notes') ?.setValue(this.selectedRow.notes);
            this.openModal(this.schoolNamePopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
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
        this.isDisabled = false;
        this.selectedRowIndex = null;
        this.openModal(this.schoolNamePopupRef);
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
    * @method addNewCollegeName
    * @description Add the college record
    */
    addNewSchoolName() {
        if (this.formGroup.valid) {
            let val = this.formGroup.get('name') ?.value;
            this.requestData.name = val.toLowerCase().trim();
            this.requestData.orgName = 'School';
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                if (result && result != null) {
                    this.toastr.info('School name is already exist', '', {
                        timeOut: 3000,
                        closeButton: true
                    });
                    let val = this.formGroup.get('name') ?.setValue('');
                    return;
                } else {
                    let val = this.formGroup.get('ncesId') ?.value;
                    this.requestData.codes = val;
                    this.requestData.orgName = 'School';
                    this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
                        if (result && result != null) {
                            this.toastr.info('Entered NCESID is alreay exist, to add this organization name please change entered NCESID.', '', {
                                timeOut: 3000,
                                closeButton: true
                            });
                            let val = this.formGroup.get('ncesId') ?.setValue('');
                            return;
                        } else {
                            this.requestData.collegeSchoolId = this.formGroup ?.get('collegeSchoolId') ?.value;
                            this.requestData.orgName = this.formGroup ?.get('name') ?.value.trim();
                            this.requestData.inPullDown = this.formGroup ?.get('inPullDown') ?.value;
                            this.requestData.name = this.formGroup ?.get('name') ?.value.trim();
                            this.requestData.codes = this.formGroup ?.get('codes') ?.value;
                            this.requestData.title = this.formGroup ?.get('title') ?.value;
                            this.requestData.country = this.formGroup ?.get('country') ?.value;
                            this.requestData.address = this.formGroup ?.get('address') ?.value;
                            this.requestData.ncesId = this.formGroup ?.get('ncesId') ?.value;
                            this.requestData.city = this.formGroup ?.get('city') ?.value;
                            this.requestData.states = this.formGroup ?.get('states') ?.value;
                            this.requestData.zipcode = this.formGroup ?.get('zipcode') ?.value;
                            this.requestData.fiscalYear = this.formGroup ?.get('ifiscalYeard') ?.value.trim();
                            this.requestData.phone1 = this.formGroup ?.get('phone1') ?.value;
                            this.requestData.phone2 = this.formGroup ?.get('phone2') ?.value;
                            this.requestData.phone3 = this.formGroup ?.get('phone3') ?.value;
                            this.requestData.fax = this.formGroup ?.get('fax') ?.value;
                            this.requestData.website = this.formGroup ?.get('website') ?.value;
                            this.requestData.email = this.formGroup ?.get('email') ?.value;
                            this.requestData.notes = this.formGroup ?.get('notes') ?.value;
                            this.requestData.fafsaId = null;
                            this.showLoader();
                            this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
                                if (result) {
                                    this.modalRef.hide();
                                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                                        this.hideLoader();
                                        this.selectedRowIndex = null;
                                        if (result) {
                                            this.dataSource = new MatTableDataSource(result);
                                            this.dataSource.paginator = this.paginator;
                                            this.selectedRowIndex = null;
                                            this.dataSource.sort = this.sort;
                                            document.getElementById('closePopup') ?.click();
                                            this.schoolDataList = result;

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
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
            if (this.formGroup ?.get('email') ?.value) {
                if (!this.formGroup ?.get('email') ?.valid) {
                    this.toastr.info('Please enter the correct email, this email is not valid!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    return;
                }
            }
        }
    }

    /**
    * @method deleteSelectedRow
    * @description delete the school record
    */
    deleteSelectedRow() {
        if (this.selectedRow) {
            const data = {
                collegeSchoolId: this.selectedRow.collegeSchoolId
            }
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this School: ' + this.selectedRow.orgName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._collegeAndSchoolService.deleteCollegeSchoolName(data).subscribe(result => {
                        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.schoolDataList = result;

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
            this.toastr.info('Please select a row to delete.', '', {
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
        if (this.formGroup.valid) {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.collegeSchoolId = this.formGroup ?.get('collegeSchoolId') ?.value;
            this.requestData.orgName = this.formGroup ?.get('name') ?.value.trim();
            this.requestData.inPullDown = this.formGroup ?.get('inPullDown') ?.value;
            this.requestData.name = this.formGroup ?.get('name') ?.value.trim();
            this.requestData.codes = this.formGroup ?.get('codes') ?.value;
            this.requestData.title = this.formGroup ?.get('title') ?.value;
            this.requestData.country = this.formGroup ?.get('country') ?.value;
            this.requestData.address = this.formGroup ?.get('address') ?.value;
            this.requestData.ncesId = this.formGroup ?.get('ncesId') ?.value.trim();
            this.requestData.city = this.formGroup ?.get('city') ?.value;
            this.requestData.states = this.formGroup ?.get('states') ?.value;
            this.requestData.zipcode = this.formGroup ?.get('zipcode') ?.value;
            this.requestData.fiscalYear = this.formGroup ?.get('ifiscalYeard') ?.value;
            this.requestData.phone1 = this.formGroup ?.get('phone1') ?.value;
            this.requestData.phone2 = this.formGroup ?.get('phone2') ?.value;
            this.requestData.phone3 = this.formGroup ?.get('phone3') ?.value;
            this.requestData.fax = this.formGroup ?.get('fax') ?.value;
            this.requestData.website = this.formGroup ?.get('website') ?.value;
            this.requestData.email = this.formGroup ?.get('email') ?.value;
            this.requestData.notes = this.formGroup ?.get('notes') ?.value;
            this.requestData.fafsaId = null;
            this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                this.modalRef.hide();
                this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
                        document.getElementById('closePopup') ?.click();
                        this.schoolDataList = result;
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        }
    }else{
        this.formGroup.markAllAsTouched();
        if (this.formGroup ?.get('email') ?.value) {
            if (!this.formGroup ?.get('email') ?.valid) {
                this.toastr.info('Please enter the correct email, this email is not valid!', '', {
                    timeOut: 5000,
                    closeButton: true
                });
                return;
            }
        }
    }
    }

   /**
    * @method bindDropDownValues
    * @description Get the all pull down item list
    */
    bindDropDownValues() {
        // this._collegeAndSchoolService.getPullDownList().subscribe((result: any) => {
        //     console.log(result)
        // });
        let data: any = ['City', 'State_PostalAddress', 'Codes'];
        this._pullDownListService.getMultiplePulldownListByCode(data).subscribe((result: any) => {
            if (result?.body?.City) {
                this.cityList = result.body.City;
            }
            if (result?.body?.State_PostalAddress) {
                this.stateList = result.body.State_PostalAddress;
            }
            if (result?.body?.Codes) {
                this.countryList = result.body.Codes;
            }
        });
    }


    /**
     * @method checkName
     * @description Check school Name is exist or not
     */
    checkName() {
        let status = true;
        // if (!this.validationClass.isNullOrUndefined(event)) {
        const data = this.schoolDataList.filter((item: any) => (item.name).toLowerCase().trim() === (this.formGroup.get('name') ?.value).toLowerCase().trim());
        if (data && data.length > 0) {
            this.toastr.info('School Name is already exist', '', {
                timeOut: 5000,
                closeButton: true
            });
            this.formGroup.get('name') ?.setValue('');
            status = false;
            return status;
        }
        return status;
        // }
    }

    /**
    * @method schoolCodeVerification
    * @description NcesId code is exist or not
    */
    schoolCodeVerification() {
        let val = this.formGroup.get('ncesId') ?.value;
         this.requestData.codes = val;
         this.requestData.orgName = 'School';
        this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
            if (result && result != null) {
                this.toastr.info('Entered NCESID is alreay exist, to add this organization name please change entered NCESID.', '', {
                    timeOut: 3000,
                    closeButton: true
                });
                return;
            }
        });
    }

    /**
    * @method schoolNameVerification
    * @description School name is exist or not
    */
    schoolNameVerification() {
        let val = this.formGroup.get('name') ?.value;
        this.requestData.name = val.toLowerCase().trim();
        this.requestData.orgName = 'School';
        this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
            if (result && result != null) {
                this.toastr.info('School name is already exist', '', {
                    timeOut: 3000,
                    closeButton: true
                });
                return;
            }
        });
    }

    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup() {
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(CollegeSchoolListMoveBoxComponent, {
                data: {
                    title: 'School Name',
                    message: 'School',
                    schoolCollegeDataList: this.schoolDataList,
                    selectedCollegeSchoolId: this.selectedRow.collegeSchoolId,
                    selectedCollegeSchoolName: this.selectedRow.name,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRow = null;
                            this.dataSource.sort = this.sort;
                            this.schoolDataList = result;
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
            const confirmDialog = this.dialog.open(CollegeSchoolListMergeBoxComponent, {
                data: {
                    title: 'School Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.collegeSchoolName,
                    collegeSchoolIdList: this.schoolDataList,
                    selectedCollegeSchoolId: this.selectedRow.collegeSchoolId,
                    selectedCollegeSchoolName: this.selectedRow.name
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRow = null;
                            this.dataSource.sort = this.sort;
                            this.schoolDataList = result;
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
     * Show the email message
     */
    getEmailMessage() {
        this.toastr.info('Please enter the correct email, this email is not valid!', '', {
            timeOut: 5000,
            closeButton: true
        });
        return;
    }

    /**
   * @method print
   * @description show print and download the data.
   */
    print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['School Name', 'NCESID', 'County Name', 'In Pulldown List', 'Phone1', 'Phone2', 'Phone3', 'Fax']]
        let data: any = [];
        this.schoolDataList.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.name);
            tempObj.push(e.ncesId);
            tempObj.push(e.country);
            if (e.inPullDown == true) {
                tempObj.push("Yes");
            } else {
                tempObj.push("No");
            }
            if (e.phone1) {
                tempObj.push(e.phone1.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if (e.phone2) {
                tempObj.push(e.phone2.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if (e.phone3) {
                tempObj.push(e.phone3.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if (e.fax) {
                tempObj.push(e.fax.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
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
                doc.text("Compansol TRIO School Listing", 140, 15, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "School List"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'school.pdf' });
        //doc.save('college.pdf');  
    }

}
