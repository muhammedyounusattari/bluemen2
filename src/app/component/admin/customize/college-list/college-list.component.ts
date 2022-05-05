import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CollegeAndSchoolService } from "src/app/services/admin/college-school.service";
import { PullDownListService } from "src/app/services/admin/pulldown-list.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { NotificationUtilities } from "src/app/shared/utilities/notificationUtilities";
import { ValidationClass } from "src/app/shared/validation/common-validation-class";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'app-college-list',
    templateUrl: './college-list.component.html',
    styleUrls: ['./college-list.component.css']
})

export class CollegeListComponent implements OnInit {

    public collegeNamePopupTitle: string = 'College Name';
    public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    public collegeNamePopupVisiblity: boolean = false;
    public isCollegeNamePopupLoading: boolean = false;
    public collegeMovePopupVisiblity: boolean = false;
    public isCollegeMoveLoading: boolean = false;
    public isCollegeMergeLoading: boolean = false;
    public collegeMergePopupVisiblity: boolean = false;

    public isLoading: boolean = false;
    public isDisabled: boolean = false;
    public isEdit: boolean = false;

    public formGroup: FormGroup;
    public mergeFormGroup: FormGroup;
    public moveFormGroup: FormGroup;
    public collegeDataSearchList: any;
    public currentValId: any;

    public countryList: any = [];
    public cityList: any = [];
    public stateList: any = [];

    public selectedRow: any = {};
    public selectedRowIndex: any;
    public collegeDataList: any = [];
    validationClass: ValidationClass = new ValidationClass();
    public collegeMovePopupTitle: string = 'College Name';
    public collegeMergePopupTitle: string = 'College Name';
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

    constructor(
        private router: Router
        , private _collegeAndSchoolService: CollegeAndSchoolService
        , private notificationService: NotificationUtilities
        , private _pullDownListService: PullDownListService
        , private sharedService: SharedService
        , private modal: NzModalService
        , private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.sharedService.setPageTitle('College/School List');
        this.createForm();
        this.loadTableData();
        this.bindDropDownValues();
        this.navigateToComponent('college-list');

    }
    loadTableData() {
        this.showLoader();
        this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('COLLEGE_LIST');
            if (domElement) {
                domElement.style.borderBottom = "2px solid #1672B7";
            }
            if (result) {
                this.selectedRowIndex = null;
                this.collegeDataList = result;
                this.collegeDataSearchList = result;
            }
        });
    }
    hideLoader() {
        this.isLoading = false;
        this.isCollegeNamePopupLoading = false;
        this.isCollegeMoveLoading = false;
        this.isCollegeMergeLoading =false;
    }
    showLoader() {
        this.isLoading = true;
    }
    /**
    * @method applyFilter
    * @description search the text from list
    */
    applyFilter(filterValue: any) {

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
    * @method createForm
    * @description declare the form fileds
    */
    createForm() {
        this.formGroup = this.formBuilder.group({
            'collegeSchoolId': [""],
            'name': ["", Validators.required],
            'inPullDown': [""],
            'codes': [""],
            'title': [""],
            'country': [""],
            'address': [""],
            'fafsaId': [""],
            'city': [""],
            'states': [""],
            'zipcode': [""],
            'fiscalYear': [""],
            'phone1': [""],
            'phone2': [""],
            'phone3': [""],
            'fax': [""],
            'website': [""],
            'email': ["", [Validators.pattern(this.emailPattern)]],
            'notes': [""]
        });
        this.moveFormGroup = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
        this.mergeFormGroup = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
    }
    /**
* @method addNewCollegeName
* @description Add the college record
*/
    addNewCollegeName() {
        if (this.formGroup.valid) {
            this.isCollegeNamePopupLoading = true;
            let val = this.formGroup.get('name')?.value;
            this.requestData.orgName = 'College';
            this.requestData.name = val.toLowerCase().trim();
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                if (result && result != null) {
                    this.notificationService.createNotificationBasic('info', 'Info', 'College name is already exist');
                    this.formGroup.get('name')?.setValue('');
                    this.isCollegeNamePopupLoading = false;
                    return;
                } else {
                    let val = this.formGroup.get('fafsaId')?.value;
                    this.requestData.orgName = 'College';
                    this.requestData.codes = val.toLowerCase().trim();
                    this._collegeAndSchoolService.getCollegeSchoolByCode(this.requestData).subscribe(result => {
                        if (result && result != null) {
                            this.notificationService.createNotificationBasic('info', 'Info', 'Entered FAFSAID is alreay exist, to add this organization name please change entered FAFSAID.');
                            this.formGroup.get('fafsaId')?.setValue('');
                            this.isCollegeNamePopupLoading = false;
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
                            this.requestData.fafsaId = this.formGroup?.get('fafsaId')?.value;
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
                            this.requestData.ncesId = null;
                            this.showLoader();
                            this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
                                if (result) {
                                    this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                                        this.hideLoader();
                                        this.selectedRowIndex = null;
                                        if (result) {
                                            this.selectedRowIndex = null;
                                            this.collegeNamePopupVisiblity = false;
                                            this.collegeDataList = result;
                                            this.notificationService.createNotificationBasic('success', 'Success', 'Data Saved Successfully.');
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
            if (this.formGroup?.get('email')?.value) {
                if (!this.formGroup?.get('email')?.valid) {
                    this.notificationService.createNotificationBasic('info', 'Info', 'Please enter the correct email, this email is not valid!');
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
    showMoveItemPopup(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.collegeMovePopupVisiblity = true;
            this.moveFormGroup.reset();
        }
    }
    onConfirmMove() {
        this.isCollegeMoveLoading = true;
        if (this.moveFormGroup.valid) {
            this.currentValId = this.moveFormGroup?.get('collegeSchoolName')?.value;
            const status = this.verifyCollegeSchoolNameMove(this.currentValId);
            if (status) {
                this.getDeletedItemByIdMove(this.currentValId);
            }
        } else {
            this.moveFormGroup.markAllAsTouched();
        }
    }
    verifyCollegeSchoolNameMove(currentName: any) {
        let status = false;
        const data = this.collegeDataList.filter((item: any) => ((item.name.toLowerCase().trim()) === (currentName.toLowerCase().trim())));
        // debugger;
        if (data && data.length > 0) {
            const message = "Enter a different name as the name is already in use or To combine to lists use the merge option instead";
            this.modal.confirm({
                nzTitle: '',
                nzContent: message,
                nzOkText: 'OK',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.moveFormGroup.get("collegeSchoolName")?.setValue('');
                    status = true;
                    this.isCollegeMoveLoading = false;
                },
                nzCancelText: 'Cancel',
                nzOnCancel: () => { this.hideLoader();  status = true;this.moveFormGroup.get("collegeSchoolName")?.setValue(''); }
            });
        } else {
            status = true;
        }
        return status;
    }
    getDeletedItemByIdMove(name: any) {
        const verifyData = {
            collegeSchoolId: this.selectedRow.collegeSchoolId,
            name: name
        }
        this.requestData.orgName = 'College';
        this.requestData.name = name.toLowerCase().trim();
        this._collegeAndSchoolService.getDeletedCollegeAndSchoolByNameAndOrgId(this.requestData).subscribe(result => {
            if (result && result != null && result > 0) {
                let message = "College name was deleted. Do you want to recall the old name?";
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'OK',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this._collegeAndSchoolService.recoverCollegeAndSchoolList(this.requestData).subscribe(result2 => {
                            if (result2) {
                                this.hideLoader();
                                this.loadTableData();
                                this.moveFormGroup.get("collegeSchoolName")?.setValue('');
                                this.notificationService.createNotificationBasic('success', 'Success', 'Recover successfully Done!');
                            }
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.hideLoader(); this.moveFormGroup.get("collegeSchoolName")?.setValue(''); }
                });
            } else {
                let message = "Do you want to Rename College Name from " + this.selectedRow.name + " to  " + name + "?";
                this.modal.confirm({
                    nzTitle: '',
                    nzContent: message,
                    nzOkText: 'OK',
                    nzOkType: 'primary',
                    nzOkDanger: true,
                    nzOnOk: () => {
                        this._collegeAndSchoolService.updateCollegeAndSchoolNameById(verifyData).subscribe(result2 => {
                            if (result2) {
                                this.hideLoader();
                                this.collegeMovePopupVisiblity = false;
                                this.loadTableData();
                                this.notificationService.createNotificationBasic('success', 'Success', 'Move successfully Done!');
                            }
                        });
                    },
                    nzCancelText: 'Cancel',
                    nzOnCancel: () => { this.hideLoader(); this.moveFormGroup.get("collegeSchoolName")?.setValue(''); }
                });
            }
        });
    }
    updateSelectedRow() {
        if (this.formGroup.valid) {
            if (this.selectedRow) {
                this.showLoader();
                this.isCollegeNamePopupLoading = true;
                this.requestData.collegeSchoolId = this.formGroup?.get('collegeSchoolId')?.value;
                this.requestData.orgName = this.formGroup?.get('name')?.value.trim();
                this.requestData.inPullDown = this.formGroup?.get('inPullDown')?.value;
                this.requestData.name = this.formGroup?.get('name')?.value.trim();
                this.requestData.codes = this.formGroup?.get('codes')?.value;
                this.requestData.title = this.formGroup?.get('title')?.value;
                this.requestData.country = this.formGroup?.get('country')?.value;
                this.requestData.address = this.formGroup?.get('address')?.value;
                this.requestData.fafsaId = this.formGroup?.get('fafsaId')?.value.trim();
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
                this.requestData.ncesId = null;
                this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                    this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.selectedRow = null;
                            this.collegeNamePopupVisiblity = false;
                            this.collegeDataList = result;
                            this.isEdit = false;
                            this.isCollegeNamePopupLoading = false;
                            this.notificationService.createNotificationBasic('success', 'Success', 'Updated successfully!');
                        }
                    });
                });
            }
        } else {
            this.formGroup.markAllAsTouched();
            if (this.formGroup?.get('email')?.value) {
                if (!this.formGroup?.get('email')?.valid) {
                    this.notificationService.createNotificationBasic('info', 'Info', 'Please enter the correct email, this email is not valid!');
                    return;
                }
            }
        }
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
    resetFields() {
        this.createForm();
        this.isEdit = false;
        this.isDisabled = false;
        this.selectedRowIndex = null;
        this.collegeNamePopupVisiblity = true;
    }
    setValuesToUpdate(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
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
            this.formGroup.get('fafsaId')?.setValue(this.selectedRow.fafsaId);
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
            this.collegeNamePopupVisiblity = true;
        }
    }
    handleCancel() {
        this.collegeNamePopupVisiblity = false;
        this.selectedRow = null;
        this.collegeMovePopupVisiblity = false;
        this.collegeMergePopupVisiblity = false;
        this.hideLoader();
    }
    /**
    * @method print
    * @description show print and download the data.
    */
    print() {
        const doc = new jsPDF('l', 'mm', 'a4');
        const head = [['College Name', 'FAFSA ID', 'County Name', 'In Pulldown List', 'Phone1', 'Phone2', 'Phone3', 'Fax']]
        let data: any = [];
        this.collegeDataList.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.name);
            tempObj.push(e.fafsaId);
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
                doc.text("Compansol TRIO College Listing", 140, 15, {
                    align: 'center'
                });
            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "College list"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
    }
    onConfirmMerge() {
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
            this.formGroup.markAllAsTouched();
          }
    }
    getDeletedItemByIdMerge (currentValId: any) {
        const verifyData = {
            collegeSchoolId: this.selectedRow.collegeSchoolId,
          }
          let status = this.verifyCollegeSchoolName(this.currentValId);
          if (!status) {
            const message = "Do you want to merge from name " + this.selectedRow.name + " to name " + currentValId + " ?";
            this.modal.confirm({
                nzTitle: '',
                nzContent: message,
                nzOkText: 'OK',
                nzOkType: 'primary',
                nzOkDanger: true,
                nzOnOk: () => {
                   this.isCollegeMergeLoading = true;
                    this._collegeAndSchoolService.mergeCollegeSchoolByName(verifyData).subscribe(result2 => {
                        if (result2) {
                            this.hideLoader();
                            this.handleCancel();
                            this.loadTableData();
                            this.mergeFormGroup.get("collegeSchoolName")?.setValue('');
                            this.notificationService.createNotificationBasic('success', 'Success', 'Merge successfully Done!');
                        }
                    });
                },
                nzCancelText: 'Cancel',
                nzOnCancel: () => { this.hideLoader(); this.mergeFormGroup.get("collegeSchoolName")?.setValue(''); }
            });
          }
    }
     /**
  * @method verifyCollegeSchoolName
  * @description This method is used for verify the college school name.
  */
  verifyCollegeSchoolName(currentName: any) {
    let status = false;
    const data = this.collegeDataList.filter((item: any) => ((item.name.trim()) === (currentName.trim())));
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
   * @method sorting
   * @description this method is used for asc sorting
   */
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
    deleteSelectedRow(data: any) {
        this.selectedRow = data;
        if (this.selectedRow) {
            const data = {
                collegeSchoolId: this.selectedRow.collegeSchoolId
            }
            const message = 'Are you sure, you want to remove this College:';
            this.modal.confirm({
                nzTitle: 'Confirm Remove Record?',
                nzContent: message,
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
        this._collegeAndSchoolService.deleteCollegeSchoolName(data).subscribe(result => {
            this._collegeAndSchoolService.getCollegeNames('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.collegeDataList = result;
                    this.notificationService.createNotificationBasic('success', 'Success', 'Deleted successfully!')
                }
            });
        });
    }
    showMergeItemPopup(data: any) {
        this.selectedRow = JSON.parse(JSON.stringify(data));
        if (this.selectedRow) {
            this.collegeMergePopupVisiblity = true;
            this.mergeFormGroup.reset();
        }
    }
}