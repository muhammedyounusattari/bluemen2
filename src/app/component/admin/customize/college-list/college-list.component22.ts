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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { CollegeSchoolListMoveBoxComponent } from '../move-box/college-school-list-move-box/college-school-list-move-box.component';
import { CollegeSchoolListMergeBoxComponent } from '../merge-box/college-school-list-merge-box/college-school-list-merge-box.component';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-college-list',
    templateUrl: './college-list.component.html',
    styleUrls: ['./college-list.component.css']
})

export class CollegeListComponent implements OnInit {
    collegeDataList: any = [];
    @ViewChild('collegeNamePopup') collegeNamePopupRef: TemplateRef<any>;
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
        collegeSchoolId: '',
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
        fafsaId: '',
        fiscalYear: '',
        ncesId: null,
        inPullDown: false
    };

    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    formGroup: FormGroup;
    columnsToDisplay: string[] = ['name', 'inPullDown', 'fafsaId', 'country', 'phone1', 'phone2', 'phone3', 'fax'];
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
        // this.CollegeForm = this._formBuilder.group({
        //     CollegeRows: this._formBuilder.array([])
        // });
        this.navigateToComponent('college-list');
        this.myElement = window.document.getElementById('loading');
        this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('COLLEGE_LIST');
            if (domElement) {
                domElement.style.borderBottom = "2px solid #1672B7";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.collegeDataList = result;
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
            'fafsaId': [''],
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
    setValuesToUpdate(data: any) {
        this.selectedRow = data;
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
            this.formGroup.get('fafsaId') ?.setValue(this.selectedRow.fafsaId);
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
            this.openModal(this.collegeNamePopupRef);
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
        this.openModal(this.collegeNamePopupRef);
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
    addNewCollegeName() {
        if (this.formGroup.valid) {
            let val = this.formGroup.get('name') ?.value;
            this.requestData.orgName =  'College';
            this.requestData.name =  val.toLowerCase().trim();
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                if (result && result != null) {
                    this.toastr.info('College name is already exist', '', {
                        timeOut: 3000,
                        closeButton: true
                    });
                    let val = this.formGroup.get('name') ?.setValue('');
                    return;
                } else {
                    let val = this.formGroup.get('fafsaId') ?.value;
                    this.requestData.orgName =  'College';
                    this.requestData.codes =  val.toLowerCase().trim();
                    this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
                        if (result && result != null) {
                            this.toastr.info('Entered FAFSAID is alreay exist, to add this organization name please change entered FAFSAID.', '', {
                                timeOut: 3000,
                                closeButton: true
                            });
                            let val = this.formGroup.get('fafsaId') ?.setValue('');
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
                            this.requestData.fafsaId = this.formGroup ?.get('fafsaId') ?.value;
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
                            this.requestData.ncesId = null;
                            this.showLoader();
                            this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
                                if (result) {
                                    this.modalRef.hide();
                                    this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                                        this.hideLoader();
                                        this.selectedRowIndex = null;
                                        if (result) {
                                            this.dataSource = new MatTableDataSource(result);
                                            this.dataSource.paginator = this.paginator;
                                            this.selectedRowIndex = null;
                                            this.dataSource.sort = this.sort;
                                            document.getElementById('closePopup') ?.click();
                                            this.collegeDataList = result;

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
    * @description delete the college record
    */
    deleteSelectedRow(data: any) {
        this.selectedRow = data;
        if (this.selectedRow) {
            const data = {
                collegeSchoolId: this.selectedRow.collegeSchoolId
            }
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this College: ' + this.selectedRow.orgName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this.showLoader();
                    this._collegeAndSchoolService.deleteCollegeSchoolName(data).subscribe(result => {
                        this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.collegeDataList = result;

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
    * @description update the college record
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
            this.requestData.fafsaId = this.formGroup ?.get('fafsaId') ?.value.trim();
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
            this.requestData.ncesId = null;
            this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                this.modalRef.hide();
                this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result);
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
                        document.getElementById('closePopup') ?.click();
                        this.collegeDataList = result;
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
        let data: any = 'CITY,STATE,COUNTRY';
        this._pullDownListService.getMultiPullDownMaster(data).subscribe((result: any) => {
            if (result?.CITY) {
                this.cityList = result.CITY;
            }
            if (result?.STATE) {
                this.stateList = result.STATE;
            }
            if (result?.COUNTRY) {
                this.countryList = result.COUNTRY;
            }
        });
    }


    /**
     * @method checkName
     * @description Check college Name is exist or not
     */
     checkName(event: any) {
        if(!this.isDisabled){
        if (!this.validationClass.isNullOrUndefined(event)) {
            let val = this.formGroup.get('name') ?.value;
            this.requestData.orgName =  'College';
            this.requestData.name =  val.toLowerCase().trim();
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
              if (result) {
                this.toastr.info('College Name is already exist!', '', {
                  timeOut: 5000,
                  closeButton: true
                });
                this.formGroup.get('name')?.setValue('');
                return;
              }else {
                this.formGroup.get('name')?.setValue(event.target.value);
              }
            });
          }
        }
    }

    /**
    * @method collegeCodeVerification
    * @description FafsaId code is exist or not
    */
    collegeCodeVerification() {
        let val = this.formGroup.get('fafsaId') ?.value;
        this.requestData.orgName =  'College';
        this.requestData.codes =  val.toLowerCase().trim();
        this._collegeAndSchoolService.getCollegeSchoolByCode( this.requestData).subscribe(result => {
            if (result && result != null) {
                this.toastr.info('Entered FAFSAID is alreay exist, to add this organization name please change entered FAFSAID.', '', {
                    timeOut: 3000,
                    closeButton: true
                });
                return;
            }
        });
    }

    /**
    * @method collegeNameVerification
    * @description College name is exist or not
    */
    collegeNameVerification() {
        let val = this.formGroup.get('name') ?.value;
        this.requestData.orgName =  'College';
        this.requestData.name =  val.toLowerCase().trim();
        this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
            if (result && result != null) {
                this.toastr.info('College name is already exist', '', {
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
    showMoveItemPopup(data: any) {
        this.selectedRow = data;
        if (this.selectedRow) {
            //this.showLoader();
            const confirmDialog = this.dialog.open(CollegeSchoolListMoveBoxComponent, {
                data: {
                    title: 'College Name',
                    message: 'College',
                    schoolCollegeDataList: this.collegeDataList,
                    selectedCollegeSchoolId: this.selectedRow.collegeSchoolId,
                    selectedCollegeSchoolName: this.selectedRow.name,
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRow = null;
                            this.dataSource.sort = this.sort;
                            this.collegeDataList = result;
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
    showMergeItemPopup(data: any) {
        this.selectedRow = data;
        if (this.selectedRow) {
            const confirmDialog = this.dialog.open(CollegeSchoolListMergeBoxComponent, {
                data: {
                    title: 'College Name',
                    message: 'Are you sure, you want to merge this record ' + this.selectedRow.collegeSchoolName,
                    collegeSchoolIdList: this.collegeDataList,
                    selectedCollegeSchoolId: this.selectedRow.collegeSchoolId,
                    selectedCollegeSchoolName: this.selectedRow.name
                }
            });
            confirmDialog.afterClosed().subscribe(result1 => {
                if (result1 == true) {
                    this.showLoader();
                    this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.dataSource = new MatTableDataSource(result);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRow = null;
                            this.dataSource.sort = this.sort;
                            this.collegeDataList = result;
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
    * @method getEmailMessage
    * @description show the email message
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
        //const doc = new jsPDF('l', 'mm', 'a4'); 
        const doc = new jsPDF('l', 'mm', 'a4'); 
        const head = [['College Name', 'FAFSA ID', 'County Name', 'In Pulldown List', 'Phone1', 'Phone2', 'Phone3', 'Fax']]
        let data : any = [];
          this.collegeDataList.forEach((e: any) => {
            var tempObj =[];
            tempObj.push(e.name);
            tempObj.push(e.fafsaId);
            tempObj.push(e.country);
            if(e.inPullDown == true){
                tempObj.push("Yes");
            }else{
                tempObj.push("No");
            }
            if(e.phone1){
               tempObj.push(e.phone1.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if(e.phone2){
                tempObj.push(e.phone2.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if(e.phone3){
                tempObj.push(e.phone3.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3'));
            }
            if(e.fax){
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
            fillColor : [240,240,240]
            },
            tableLineColor: [208,208,208],
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
                doc.text("Compansol TRIO College Listing", 140, 15,{
                    align: 'center'
                });
                
              },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "College list"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', {filename: 'college.pdf'});
        //doc.save('college.pdf');  
    }
    sorting(attr: string) {
        if (this.collegeDataList.length > 0) {
            this.collegeDataList = [...this.collegeDataList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }
    
    sorting2(attr: string) {
        if (this.collegeDataList.length > 0) {
            this.collegeDataList = [...this.collegeDataList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }

}
