import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CollegeAndSchoolService } from '../../../../services/admin/college-school.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html',
    styleUrls: ['./school-list.component.css']
})

export class SchoolListComponent implements OnInit {

    public schoolDataList: any[] = [];
    public schoolNamePopupVisiblity:boolean = false;
    public schoolNameMovePopupVisiblity:boolean = false;
    public schoolNamePopupTitle: string = 'School Name';
    public schoolNameMovePopupTitle: string = 'School Name';
    public schoolNameMergePopupTitle:string = 'School Name';
    public schoolNameMergePopupVisiblity:boolean = false;
    schoolDataSearchList: any = [];
    currentValId: any;
    @ViewChild('schoolNamePopup') schoolNamePopupRef: TemplateRef<any>;
    schoolNamePopupLoading = false;
    schoolNameMovePopupLoading = false;
    schoolNameMergePopupLoading = false;
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
    selectedRowIndex: any;
    formGroup: FormGroup;
    moveFormGroup: FormGroup;
    mergeFormGroup: FormGroup;
    isLoading: boolean = true;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    countryList: any = [];
    cityList: any = [];
    stateList: any = [];

    validationClass: ValidationClass = new ValidationClass();
    constructor(
        private router: Router
        , private modal: NzModalService
        , private _collegeAndSchoolService: CollegeAndSchoolService
        , private _pullDownListService: PullDownListService
        , private sharedService: SharedService
        , private formBuilder: FormBuilder
        , private notificationService: NotificationUtilities) { }

    ngOnInit() {
        this.sharedService.setPageTitle('College/School List');
        this.createForm();
        this.bindDropDownValues();
        this.navigateToComponent('school-list');
        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
            this.isLoading = false;
            this.hideLoader();
            let domElement = window.document.getElementById('SCHOOL_LIST');
            if (domElement) {
                domElement.style.borderBottom = "2px solid #1672B7";
            }
            if (result) {
                this.selectedRowIndex = null;
                this.schoolDataList = result;
                this.schoolDataSearchList = result;
            }
        });
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
    applyFilter(search: any) {
        const targetValue: any[] = [];
        this.schoolDataSearchList.forEach((value: any) => {
            let keys = ["name", "inPullDown", "ncesId", "country", "phone1", "phone2", "phone3", "fax"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
                    targetValue.push(value);
                    break;
                }
            }
        });
        this.schoolDataList = targetValue;
    }

    /**
    * @method createForm
    * @description declare the form fileds
    */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'collegeSchoolId': [''],
            'name': ['', Validators.required],
            'inPullDown': [true],
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
        this.moveFormGroup = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
        this.mergeFormGroup = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
    }

    /**
    * @method setValuesToUpdate
    * @description Set the select row values in formgroup
    */
    setValuesToUpdate(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            this.isEdit = true;
            this.isDisabled = true;
            this.formGroup.get('collegeSchoolId')?.setValue(this.selectedRow.collegeSchoolId);
            this.formGroup.get('orgName')?.setValue(this.selectedRow.name);
            this.formGroup.get('inPullDown')?.setValue(this.selectedRow.inPullDown);
            this.formGroup.get('name')?.setValue(this.selectedRow.name);
            this.formGroup.get('codes')?.setValue(this.selectedRow.codes);
            this.formGroup.get('title')?.setValue(this.selectedRow.title);
            this.formGroup.get('country')?.setValue(this.selectedRow.country);
            this.formGroup.get('address')?.setValue(this.selectedRow.address);
            this.formGroup.get('ncesId')?.setValue(this.selectedRow.ncesId);
            this.formGroup.get('city')?.setValue(this.selectedRow.city);
            this.formGroup.get('states')?.setValue(this.selectedRow.states);
            this.formGroup.get('zipcode')?.setValue(this.selectedRow.zipcode);
            this.formGroup.get('fiscalYear')?.setValue(this.selectedRow.fiscalYear);
            this.formGroup.get('phone1')?.setValue(this.selectedRow.phone1);
            this.formGroup.get('phone2')?.setValue(this.selectedRow.phone2);
            this.formGroup.get('phone3')?.setValue(this.selectedRow.phone3);
            this.formGroup.get('fax')?.setValue(this.selectedRow.fax);
            this.formGroup.get('website')?.setValue(this.selectedRow.website);
            this.formGroup.get('email')?.setValue(this.selectedRow.email);
            this.formGroup.get('notes')?.setValue(this.selectedRow.notes);
            this.schoolNamePopupVisiblity = true;
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to update');
        }
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
        this.schoolNamePopupVisiblity = true;
    }

    /**
    * @method hideLoader
    * @description Hide loader
    */
    hideLoader() {
        this.isLoading = false;
        this.schoolNamePopupLoading = false;
        this.schoolNameMovePopupLoading =false;
        this.schoolNameMergePopupLoading = false;
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
    * @method addNewCollegeName
    * @description Add the college record
    */
    addNewSchoolName() {
        if (this.formGroup.valid) {
            this.schoolNamePopupLoading = true;
            let val = this.formGroup.get('name')?.value;
            this.requestData.name = val.toLowerCase().trim();
            this.requestData.orgName = 'School';
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                if (result && result != null) {
                    this.notificationService.createNotificationBasic('info', "info", 'School name is already exist');
                    let val = this.formGroup.get('name')?.setValue('');
                    this.schoolNamePopupLoading = false;
                    return;
                } else {
                    let val = this.formGroup.get('ncesId')?.value;
                    this.requestData.codes = val;
                    this.requestData.orgName = 'School';
                    this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
                        if (result && result != null) {
                            this.notificationService.createNotificationBasic('info', "info", 'Entered NCESID is alreay exist, to add this organization name please change entered NCESID.');
                            this.formGroup.get('ncesId')?.setValue('');
                            this.schoolNamePopupLoading = false;
                            return;
                        } else {
                            this.requestData.collegeSchoolId = this.formGroup?.get('collegeSchoolId')?.value;
                            this.requestData.orgName = this.formGroup?.get('name')?.value.trim();
                            this.requestData.inPullDown = this.formGroup?.get('inPullDown')?.value;
                            this.requestData.name = this.formGroup?.get('name')?.value.trim();
                            this.requestData.codes = this.formGroup?.get('codes')?.value;
                            this.requestData.title = this.formGroup?.get('title')?.value;
                            this.requestData.country = this.formGroup?.get('country')?.value;
                            this.requestData.address = this.formGroup?.get('address')?.value;
                            this.requestData.ncesId = this.formGroup?.get('ncesId')?.value;
                            this.requestData.city = this.formGroup?.get('city')?.value;
                            this.requestData.states = this.formGroup?.get('states')?.value;
                            this.requestData.zipcode = this.formGroup?.get('zipcode')?.value;
                            this.requestData.fiscalYear = this.formGroup?.get('ifiscalYeard')?.value.trim();
                            this.requestData.phone1 = this.formGroup?.get('phone1')?.value;
                            this.requestData.phone2 = this.formGroup?.get('phone2')?.value;
                            this.requestData.phone3 = this.formGroup?.get('phone3')?.value;
                            this.requestData.fax = this.formGroup?.get('fax')?.value;
                            this.requestData.website = this.formGroup?.get('website')?.value;
                            this.requestData.email = this.formGroup?.get('email')?.value;
                            this.requestData.notes = this.formGroup?.get('notes')?.value;
                            this.requestData.fafsaId = null;
                            this.showLoader();
                            this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
                                if (result) {
                                    this.schoolNamePopupLoading = false;
                                    this.handleCancel();
                                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                                        this.hideLoader();
                                        this.selectedRowIndex = null;
                                        if (result) {
                                            this.selectedRowIndex = null;
                                            this.schoolDataList = result;
                                            this.schoolDataSearchList = result;
                                            this.notificationService.createNotificationBasic('success', "Success", 'Saved successfully.');
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        } else {
            if (this.formGroup?.get('email')?.value) {
                if (!this.formGroup?.get('email')?.valid) {
                    this.notificationService.createNotificationBasic('info', "info", 'Please enter the correct email, this email is not valid!');
                    return;
                }
            }
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
    * @description delete the school record
    */
    deleteSelectedRow(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            const data = {
                collegeSchoolId: this.selectedRow.collegeSchoolId
            }
            this.modal.confirm({
                nzTitle: 'Confirm Remove Record',
                nzContent: 'Are you sure, you want to remove this School: ' + this.selectedRow.orgName,
                nzOkText: 'OK',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.showLoader();
                    this._collegeAndSchoolService.deleteCollegeSchoolName(data).subscribe(result => {
                        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.selectedRow = null;
                                this.schoolDataList = result;
                                this.schoolDataSearchList = result;
                                this.notificationService.createNotificationBasic('success', "Success", 'Deleted successfully!');
                            }
                        });
                    });
                },
                nzCancelText: 'Cancel',
                nzOnCancel: () => { this.hideLoader(); }
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
                this.schoolNamePopupLoading = true;
                this.requestData.collegeSchoolId = this.formGroup?.get('collegeSchoolId')?.value;
                this.requestData.orgName = this.formGroup?.get('name')?.value.trim();
                this.requestData.inPullDown = this.formGroup?.get('inPullDown')?.value;
                this.requestData.name = this.formGroup?.get('name')?.value.trim();
                this.requestData.codes = this.formGroup?.get('codes')?.value;
                this.requestData.title = this.formGroup?.get('title')?.value;
                this.requestData.country = this.formGroup?.get('country')?.value;
                this.requestData.address = this.formGroup?.get('address')?.value;
                this.requestData.ncesId = this.formGroup?.get('ncesId')?.value.trim();
                this.requestData.city = this.formGroup?.get('city')?.value;
                this.requestData.states = this.formGroup?.get('states')?.value;
                this.requestData.zipcode = this.formGroup?.get('zipcode')?.value;
                this.requestData.fiscalYear = this.formGroup?.get('ifiscalYeard')?.value;
                this.requestData.phone1 = this.formGroup?.get('phone1')?.value;
                this.requestData.phone2 = this.formGroup?.get('phone2')?.value;
                this.requestData.phone3 = this.formGroup?.get('phone3')?.value;
                this.requestData.fax = this.formGroup?.get('fax')?.value;
                this.requestData.website = this.formGroup?.get('website')?.value;
                this.requestData.email = this.formGroup?.get('email')?.value;
                this.requestData.notes = this.formGroup?.get('notes')?.value;
                this.requestData.fafsaId = null;
                this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                    this.showLoader();
                    this.handleCancel();
                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.selectedRow = null;
                            this.schoolDataList = result;
                            this.schoolDataSearchList = result;
                            this.isEdit = false;
                            this.notificationService.createNotificationBasic('success', "Success", 'Updated successfully!');
                        }
                    });
                });
            }
        } else {
            if (this.formGroup?.get('email')?.value) {
                if (!this.formGroup?.get('email')?.valid) {
                    this.notificationService.createNotificationBasic('success', "Success", 'Please enter the correct email, this email is not valid!');
                    return;
                }
            }
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
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

    handleCancel() {
        this.schoolNamePopupVisiblity = false;
        this.schoolNameMovePopupVisiblity = false;
        this.schoolNameMergePopupVisiblity = false;
    }
    /**
     * @method checkName
     * @description Check college Name is exist or not
     */
    checkName(event: any) {
        if (!this.isDisabled) {
            if (!this.validationClass.isNullOrUndefined(event)) {
                let val = this.formGroup.get('name')?.value;
                this.requestData.orgName = 'School';
                this.requestData.name = val.toLowerCase().trim();
                this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                    if (result) {
                        this.notificationService.createNotificationBasic('info', "info", 'School Name is already exist!');
                        this.formGroup.get('name')?.setValue('');
                        return;
                    } else {
                        this.formGroup.get('name')?.setValue(event.target.value);
                    }
                });
            }
        }
    }


    /**
    * @method schoolCodeVerification
    * @description NcesId code is exist or not
    */
    schoolCodeVerification() {
        let val = this.formGroup.get('ncesId')?.value;
        this.requestData.codes = val;
        this.requestData.orgName = 'School';
        this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
            if (result && result != null) {
                this.notificationService.createNotificationBasic('info', "info", 'Entered NCESID is alreay exist, to add this organization name please change entered NCESID!');
                return;
            }
        });
    }

    /**
    * @method schoolNameVerification
    * @description School name is exist or not
    */
    schoolNameVerification() {
        let val = this.formGroup.get('name')?.value;
        this.requestData.name = val.toLowerCase().trim();
        this.requestData.orgName = 'School';
        this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
            if (result && result != null) {
                this.notificationService.createNotificationBasic('info', "info", 'School name is already exist!');
                return;
            }
        });
    }

    /**
    * @method showMoveItemPopup
    * @description Open the popup for move the record
    */
    showMoveItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            this.schoolNameMovePopupVisiblity =true;
        } 
    }
     /**
   * @method onConfirm
   * @description this method is used for move the records.
   */
    onConfirmMove(): void {
        // Close the dialog, return true
        if (this.moveFormGroup.valid) {
        this.currentValId = this.moveFormGroup?.get('collegeSchoolName')?.value;
        let status = this.verifyCollegeSchoolNameMove(this.currentValId);
        if (!status) {
            this.getDeletedItemByIdMove(this.currentValId);
        }
        } else {
        this.moveFormGroup.markAllAsTouched();
        }
    }
    /**
     * @method getDeletedItemByIdMove
     * @description This method is used for recover record and get deleted recodes.
     */
    getDeletedItemByIdMove(name: any) {
        const verifyData = {
            collegeSchoolId: this.selectedRow.collegeSchoolId,
            name: name
        }
        this.requestData.orgName = 'School';
        this.requestData.name = name.toLowerCase().trim();
        this.schoolNameMovePopupLoading = true;
        this._collegeAndSchoolService.getDeletedCollegeAndSchoolByNameAndOrgId(this.requestData).subscribe(result => {
            if (result && result != null && result > 0) {
                let message = "School name was deleted. Do you want to recall the old name?";
                this.modal.confirm({
                    nzTitle: 'Recall Old Name!',
                    nzContent: message,
                    nzOkText: 'OK',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this.showLoader();
                        this._collegeAndSchoolService.recoverCollegeAndSchoolList(this.requestData).subscribe(result2 => {
                            if (result2) {
                                this.hideLoader();
                                this.selectedRowIndex = null;
                                this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                                    this.hideLoader();
                                    this.selectedRowIndex = null;
                                    if (result) {
                                        this.selectedRow = null;
                                        this.schoolDataList = result;
                                        this.schoolDataSearchList = result;
                                        this.handleCancel();
                                        this.notificationService.createNotificationBasic('success', "Success", 'Successfully Recalled the Old Name');
                                    }
                                });
                            }
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.hideLoader(); }
                });
            } else {
                let message = "Do you want to Rename College Name from " + this.selectedRow.name + " to  " + name + "?";
                this.modal.confirm({
                    nzTitle: 'Confirm Rename Record',
                    nzContent: message,
                    nzOkText: 'OK',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this._collegeAndSchoolService.updateCollegeAndSchoolNameById(verifyData).subscribe(result3 => {
                            if (result3) {
                                this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                                    this.hideLoader();
                                    this.selectedRowIndex = null;
                                    if (result) {
                                        this.selectedRow = null;
                                        this.schoolDataList = result;
                                        this.schoolDataSearchList = result;
                                        this.handleCancel();
                                        this.notificationService.createNotificationBasic('success', "Success", 'Successfully Renammed Record');
                                    }
                                });
                            }
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.hideLoader(); }
                });
            }
        });
    }

    /**
     * @method verifyCollegeSchoolNameMove
     * @description Verify the college and school name.
     */
    verifyCollegeSchoolNameMove(currentName: any) {
        let status = true;
        const data = this.schoolDataList.filter((item: any) => ((item.name.toLowerCase().trim()) === (currentName.toLowerCase().trim())));
        if (data && data.length > 0) {
            let message = "Enter a different name as the name is already in use or To combine to lists use the merge option instead";
            const modal = this.modal.warning({
                nzTitle: message,
                nzContent: '',
                nzOnOk: () => {  modal.destroy();this.moveFormGroup.get("collegeSchoolName")?.setValue(''); status = true; this.hideLoader(); }
            });
            
            setTimeout(() => { this.moveFormGroup.get("collegeSchoolName")?.setValue(''); status = true; this.hideLoader(); modal.destroy(); }, 5000);
        } else {
            status = false;
        }
        return status;

    }

    /**
     * @method showMergeItemPopup
     * @description Open the popup for merge the record
     */
    showMergeItemPopup(selectedRowItem: any, index: any) {
        this.mergeFormGroup.get("collegeSchoolName")?.setValue(null);
        this.mergeFormGroup.reset();
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            this.schoolNameMergePopupVisiblity = true;
        } 
    }
    onConfirmMerge () {
        if (this.mergeFormGroup.valid) {
            let val = this.mergeFormGroup?.get('collegeSchoolName')?.value;
            if (this.selectedRow.name.trim() == val.trim()) {
              this.notificationService.createNotificationBasic('info', "info", 'Same Name can not be merge!');
              this.mergeFormGroup.get("collegeSchoolName")?.setValue('');
              return;
            } else {
              this.currentValId = val.trim();
            }
            this.getDeletedItemByIdMerge(this.currentValId);
          } else {
            this.mergeFormGroup.markAllAsTouched();
          }
    }
    getDeletedItemByIdMerge (currentName: any) {
        const verifyData = {
            collegeSchoolId: this.selectedRow.collegeSchoolId
          }
          let status = this.verifyCollegeSchoolNameMerge(this.currentValId);
          if (!status) {
            let message = "Do you want to merge from name " + this.selectedRow.name + " to name " + currentName + " ?";
            this.modal.confirm({
                nzTitle: 'Confirm Merge!',
                nzContent: message,
                nzOkText: 'OK',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.showLoader();
                    this.schoolNameMergePopupLoading = true;
                    this._collegeAndSchoolService.mergeCollegeSchoolByName(verifyData).subscribe(result => {
                        this.schoolNameMergePopupVisiblity = false;
                        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.selectedRow = null;
                                this.schoolDataList = result;
                                this.schoolDataSearchList = result;
                                this.notificationService.createNotificationBasic('success', "Success", 'Merge Successfully Done!');
                            }
                        });
                    });
                },
                nzCancelText: 'Cancel',
                nzOnCancel: () => { this.hideLoader();}
            });
          }
    }
    verifyCollegeSchoolNameMerge(currentName: any) {
        let status = false;
        const data = this.schoolDataList.filter((item: any) => ((item.name.trim()) === (currentName.trim())));
        if (data && data.length > 0) {
          status = false;
        } else {
          this.notificationService.createNotificationBasic('info', "info", 'This record does not exist!');
          this.mergeFormGroup.get("collegeSchoolName")?.setValue('');
          status = true;
        }
        return status;
    }
    /**
     * Show the email message
     */
    getEmailMessage() {
        this.notificationService.createNotificationBasic('info', "info", 'Please enter the correct email, this email is not valid!');
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

    /**
 * @method sorting
 * @description this method is used for asc sorting
 */
    sorting(attr: string) {
        if (this.schoolDataList.length > 0) {
            this.schoolDataList = [...this.schoolDataList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
    * @method sorting
    * @description this method is used for desc sorting
    */
    sorting2(attr: string) {
        if (this.schoolDataList.length > 0) {
            this.schoolDataList = [...this.schoolDataList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
}
