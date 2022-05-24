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
        ncsIdFafsaId: '',
        isSchool: true,
        fiscalYear: '',
        inPullDown: false
    };
    requestMoveMergeData: any = {
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
        fiscalYear: '',
        ncsIdFafsaId: '',
        isSchool: true,
        inPullDown: false
    };

    schoolDataList: any = [];
    schoolDataSearchList: any = [];
    schoolDataMergeDropDownList: any = [];
    isDisabled: boolean = false;
    isEdit: boolean = false;
    selectedRow: any = '';
    selectedRowIndex: any;
    formGroup: FormGroup;
    isLoading: boolean = true;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    countryList: any = [];
    cityList: any = [];
    stateList: any = [];
    validationClass: ValidationClass = new ValidationClass();

    public schoolModalVisible: boolean = false;
    public schoolModalHeader: string = 'School List';
    public isConfirmSchoolLoading: boolean = false;
    currentValId: any;
    currentMergeValId: any;
    selectedCollegeSchoolId: any;
    selectedCollegeSchoolName: any;
    message: any;

    public moveModalVisible: boolean = false;
    public ismoveItemLoading: boolean = false;
    moveItemForm: FormGroup;
    mergeFormGroup: FormGroup;
    public mergeModalVisible: boolean = false;
    public ismergeItemLoading: boolean = false;
    selectedCollegeSchoolMergeName: any;
    selectedCollegeSchoolMergeId: any;

    constructor(private _collegeAndSchoolService: CollegeAndSchoolService
        , private _pullDownListService: PullDownListService
        , private sharedService: SharedService
        , private formBuilder: FormBuilder
        , private notificationService: NotificationUtilities
        , private modal: NzModalService) { }

    ngOnInit() {
        this.sharedService.setPageTitle('College/School List');
        this.bindDropDownValues();
        this.createForm();
        this.createMoveForm();
        this.createMergeForm();
        this.getSchoolList();
    }

    /**
     * @method getSchoolList
     * @description get the school list
     */
    getSchoolList() {
        this.showLoader();
        this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
            this.hideLoader();
            if (result) {
                this.selectedRowIndex = null;
                this.schoolDataList = result;
                this.schoolDataSearchList = result;
                this.schoolDataMergeDropDownList = result;
            }
        });
    }

    /**
    * @method applyFilter
    * @description search the text from list
    */
    applyFilter(search: any) {
        const targetValue: any[] = [];
        this.schoolDataSearchList.forEach((value: any) => {
            //let keys = Object.keys(value);
            let keys = ["name", "inPullDown", "ncsIdFafsaId", "country", "phone1", "phone2", "phone3", "fax"];
            for (let i = 0; i < keys.length; i++) {
                if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
                    targetValue.push(value);
                    break;``
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
            'ncsIdFafsaId': [''],
            'isSchool': [true],
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
            this.formGroup.get('ncsIdFafsaId')?.setValue(this.selectedRow.ncsIdFafsaId);
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
            this.formGroup.get('isSchool')?.setValue(true);
            this.openModal();
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to update');
        }
    }

    /**
    * @method openModal
    * @description open model
    */
    openModal() {
        this.schoolModalVisible = true;
    }

    /**
    * @method hideModal
    * @description open model
    */
    hideModal() {
        this.schoolModalVisible = false;
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
        this.openModal();
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
    * @method addNewSchoolName
    * @description Add the school record
    */
    addNewSchoolName() {
        if (this.formGroup.valid) {
            let val = this.formGroup.get('name')?.value;
            this.requestData.orgName = 'School';
            this.requestData.name = val.toLowerCase().trim();
            this._collegeAndSchoolService.getCollegeSchoolByName(this.requestData).subscribe(result => {
                if (result && result != null) {
                    this.notificationService.createNotificationBasic('info', "info", 'School name is already exist!');
                    let val = this.formGroup.get('name')?.setValue('');
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
                            this.requestData.ncsIdFafsaId = this.formGroup?.get('ncsIdFafsaId')?.value;
                            this.requestData.city = this.formGroup?.get('city')?.value;
                            this.requestData.states = this.formGroup?.get('states')?.value;
                            this.requestData.zipcode = this.formGroup?.get('zipcode')?.value;
                            this.requestData.fiscalYear = this.formGroup?.get('fiscalYear')?.value;
                            this.requestData.phone1 = this.formGroup?.get('phone1')?.value;
                            this.requestData.phone2 = this.formGroup?.get('phone2')?.value;
                            this.requestData.phone3 = this.formGroup?.get('phone3')?.value;
                            this.requestData.fax = this.formGroup?.get('fax')?.value;
                            this.requestData.website = this.formGroup?.get('website')?.value;
                            this.requestData.email = this.formGroup?.get('email')?.value;
                            this.requestData.notes = this.formGroup?.get('notes')?.value;
                            this.requestData.isSchool = this.formGroup.get('isSchool')?.setValue(true);
                            this.showLoader();
                            this.isConfirmSchoolLoading = true;
                            this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
                                if (result) {
                                    this.hideModal();
                                    this.isConfirmSchoolLoading = false;
                                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                                        this.hideLoader();
                                        this.selectedRowIndex = null;
                                        if (result) {
                                            this.selectedRowIndex = null;
                                            this.schoolDataList = result;
                                            this.schoolDataSearchList = result;
                                            this.schoolDataMergeDropDownList = result;
                                            this.notificationService.createNotificationBasic('success', "success", 'Saved successfully!');
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
        const data = {
            collegeSchoolId: this.selectedRow.collegeSchoolId
        }
        this._collegeAndSchoolService.deleteCollegeSchoolName(data).subscribe(result => {
            this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                this.hideLoader();
                this.selectedRowIndex = null;
                if (result) {
                    this.selectedRow = null;
                    this.schoolDataList = result;
                    this.schoolDataSearchList = result;
                    this.schoolDataMergeDropDownList = result;
                    this.notificationService.createNotificationBasic('success', "success", 'Deleted successfully!');
                }
            });
        });
    }

    /**
    * @method updateSelectedRow
    * @description update the school record
    */
    updateSelectedRow() {
        if (this.formGroup.valid) {
            if (this.selectedRow) {
                this.showLoader();
                this.requestData.collegeSchoolId = this.formGroup?.get('collegeSchoolId')?.value;
                this.requestData.orgName = this.formGroup?.get('name')?.value.trim();
                this.requestData.inPullDown = this.formGroup?.get('inPullDown')?.value;
                this.requestData.name = this.formGroup?.get('name')?.value.trim();
                this.requestData.codes = this.formGroup?.get('codes')?.value;
                this.requestData.title = this.formGroup?.get('title')?.value;
                this.requestData.country = this.formGroup?.get('country')?.value;
                this.requestData.address = this.formGroup?.get('address')?.value;
                this.requestData.ncsIdFafsaId = this.formGroup?.get('ncsIdFafsaId')?.value;
                this.requestData.city = this.formGroup?.get('city')?.value;
                this.requestData.states = this.formGroup?.get('states')?.value;
                this.requestData.zipcode = this.formGroup?.get('zipcode')?.value;
                this.requestData.fiscalYear = this.formGroup?.get('fiscalYear')?.value;
                this.requestData.phone1 = this.formGroup?.get('phone1')?.value;
                this.requestData.phone2 = this.formGroup?.get('phone2')?.value;
                this.requestData.phone3 = this.formGroup?.get('phone3')?.value;
                this.requestData.fax = this.formGroup?.get('fax')?.value;
                this.requestData.website = this.formGroup?.get('website')?.value;
                this.requestData.email = this.formGroup?.get('email')?.value;
                this.requestData.notes = this.formGroup?.get('notes')?.value;
                this.requestData.isSchool = this.formGroup.get('isSchool')?.setValue(true);
                this.isConfirmSchoolLoading = true;
                this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                    this.hideModal();
                    this.isConfirmSchoolLoading = false;
                    this._collegeAndSchoolService.getSchoolNames('').subscribe(result => {
                        this.hideLoader();
                        this.selectedRowIndex = null;
                        if (result) {
                            this.selectedRow = null;
                            this.schoolDataList = result;
                            this.schoolDataSearchList = result;
                            this.schoolDataMergeDropDownList = result;
                            this.isEdit = false;
                            this.notificationService.createNotificationBasic('success', "success", 'Updated successfully!');
                        }
                    });
                });
            }
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
            console.log(this.countryList);
        });
    }


    /**
     * @method checkName
     * @description Check school Name is exist or not
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
    * @description ncsIdFafsaId code is exist or not
    */
    schoolCodeVerification() {
        let val = this.formGroup.get('ncsIdFafsaId')?.value;
        this.requestData.orgName = 'School';
        this.requestData.codes = val.toLowerCase().trim();
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
        this.requestData.orgName = 'School';
        this.requestData.name = val.toLowerCase().trim();
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
        this.createMoveForm();
        this.selectedCollegeSchoolId = this.selectedRow.collegeSchoolId,
            this.selectedCollegeSchoolName = this.selectedRow.name
        this.moveModalVisible = true;
    }

    /**
     * @method showMergeItemPopup
     * @description Open the popup for merge the record
     */
    showMergeItemPopup(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        this.selectedCollegeSchoolMergeId = this.selectedRow.collegeSchoolId,
        this.selectedCollegeSchoolMergeName = this.selectedRow.name
        if(this.selectedCollegeSchoolMergeName){
            const data = this.schoolDataSearchList.filter((item: any) => ((item.name.toLowerCase().trim()) != (this.selectedCollegeSchoolMergeName.toLowerCase().trim())));
            this.schoolDataMergeDropDownList = data;
        }
        this.createMergeForm();
        this.mergeModalVisible = true;
    }

    /**
    * @method getEmailMessage
    * @description show the email message
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
        //const doc = new jsPDF('l', 'mm', 'a4'); 
        const doc = new jsPDF('l', 'mm', 'a4');
        const head = [['School Name', 'NCES ID', 'County Name', 'In Pulldown List', 'Phone1', 'Phone2', 'Phone3', 'Fax']]
        let data: any = [];
        this.schoolDataList.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.name);
            tempObj.push(e.ncsIdFafsaId);
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
            title: "School list"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', {filename: 'college.pdf'});
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

    /**
    * @method handleCancel
    * @description this method is used for reset the form
    */
    handleCancel(): void {
        this.createForm();
        this.schoolModalVisible = false;
    }

    /**
    * @method cancelDelete
    * @description this method is used for cancel Delete popup
    */
    cancelDelete(): void {

    }

    //start move
    /**
    * @method onConfirm
    * @description this method is used for move the records.
    */
    onConfirm(): void {
        // Close the dialog, return true
        if (this.moveItemForm.valid) {
            this.currentValId = this.moveItemForm?.get('collegeSchoolName')?.value;
            let status = this.verifyCollegeSchoolName(this.currentValId);
            if (!status) {
                this.getDeletedItemById(this.currentValId);
            }
        } else {
            this.moveItemForm.markAllAsTouched();
            Object.values(this.moveItemForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    /**
    * @method createForm
    * @description Form group create
    */
    createMoveForm() {
        this.moveItemForm = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
    }

    /**
     * @method getDeletedItemById
     * @description This method is used for recover record and get deleted recodes.
     */
    getDeletedItemById(name: any) {
        this.message = "School";
        const verifyData = {
            collegeSchoolId: this.selectedCollegeSchoolId,
            name: name
        }
        this.requestMoveMergeData.orgName = this.message.trim();
        this.requestMoveMergeData.name = name.toLowerCase().trim();
        this._collegeAndSchoolService.getDeletedCollegeAndSchoolByNameAndOrgId(this.requestMoveMergeData).subscribe(result => {
            if (result && result != null && result > 0) {
                let message = this.message + " name was deleted. Do you want to recall the old name?";
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        this.requestMoveMergeData.collegeSchoolId = result;
                        this._collegeAndSchoolService.recoverCollegeAndSchoolList(this.requestMoveMergeData).subscribe(result2 => {
                            if (result2) {
                                this.moveModalVisible = false;
                                this.getSchoolList();
                            }
                        });
                    }
                });
            } else {
                let message = "Do you want to Rename School Name from : " + this.selectedCollegeSchoolName + " to:  " + name + "?";
                this.modal.confirm({
                    nzTitle: message,
                    nzContent: '',
                    nzOnOk: () => {
                        this._collegeAndSchoolService.updateCollegeAndSchoolNameById(verifyData).subscribe(result3 => {
                            if (result3) {
                                this.moveModalVisible = false;
                                this.getSchoolList();
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * @method verifyCollegeSchoolName
     * @description Verify the college and school name.
     */
    verifyCollegeSchoolName(currentName: any) {
        let status = true;
        const data = this.schoolDataList.filter((item: any) => ((item.name.toLowerCase().trim()) === (currentName.toLowerCase().trim())));
        if (data && data.length > 0) {
            let message = "Enter a different name as the name is already in use or To combine to lists use the merge option instead";
            this.notificationService.createNotificationBasic('info', "School Name", message);
            this.moveItemForm.get("collegeSchoolName")?.setValue('');
            status = true;
        } else {
            status = false;
        }
        return status;

    }

    /**
     * @method moveHandleCancel
     * @description cancel the popup
     */
    moveHandleCancel(): void {
        this.clearMoveFormValue();
        this.moveModalVisible = false;
    }

    /**
     * @method clearMoveFormValue
     * @description validate the all fields
     */
    clearMoveFormValue() {
        for (let control in this.moveItemForm.controls) {
            // this.moveItemForm.controls[control].setErrors(null);
            this.moveItemForm.controls[control].markAsPristine();
            this.moveItemForm.controls[control].markAsUntouched();
            this.moveItemForm.controls[control].updateValueAndValidity();
        }
    }

    //End move

    //Start Merge
    /**
    * @method onMergeConfirm
    * @description For merging the record
    */
    onMergeConfirm(): void {
        // Close the dialog, return true
        if (this.mergeFormGroup.valid) {
            let val = this.mergeFormGroup?.get('collegeSchoolName')?.value;
            if (this.selectedCollegeSchoolMergeName.trim() == val.trim()) {
                this.notificationService.createNotificationBasic('info', "info", 'Same Name can not be merge!');
                this.mergeFormGroup.get("collegeSchoolName")?.setValue('');
                return;
            } else {
                this.currentMergeValId = val.trim();
            }
            this.getDeletedMergeItemById(this.currentMergeValId);
        } else {
            Object.values(this.mergeFormGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }


    /**
    * @method createMergeForm
    * @description Form group create
    */
    createMergeForm() {
        this.mergeFormGroup = this.formBuilder.group({
            'collegeSchoolName': ['', Validators.required]
        });
    }

    /**
     * @method getDeletedMergeItemById
     * @description This method is used for Deleted Merge Item by id.
     */
    getDeletedMergeItemById(currentName: any) {
        const verifyData = {
            collegeSchoolId: this.selectedCollegeSchoolMergeId
        }
        let status = this.verifyMergeCollegeSchoolName(this.currentMergeValId);
        if (!status) {
            let message = "Do you want to merge from name " + this.selectedCollegeSchoolMergeName + " to name " + currentName + " ?";
            this.modal.confirm({
                nzTitle: message,
                nzContent: '',
                nzOnOk: () => {
                    this._collegeAndSchoolService.mergeCollegeSchoolByName(verifyData).subscribe(result3 => {
                        if (result3) {
                            this.mergeModalVisible = false;
                            this.getSchoolList();
                        }
                    });
                }
            });
        }
    }

    /**
    * @method verifyMergeCollegeSchoolName
    * @description This method is used for verify the merge college school name.
    */
    verifyMergeCollegeSchoolName(currentName: any) {
        let status = false;
        const data = this.schoolDataSearchList.filter((item: any) => ((item.name.trim()) === (currentName.trim())));
        if (data && data.length > 0) {
            status = false;
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'This record does not exist!');
            this.formGroup.get("collegeSchoolName")?.setValue('');
            status = true;
        }
        return status;
    }

    /**
    * @method mergeHandleCancel
    * @description reset the fileds.
    */
    mergeHandleCancel(): void {
        this.clearMergeFormValue();
        this.mergeModalVisible = false;
    }

    /**
    * @method clearMergeFormValue
    * @description validate the fields.
    */
    clearMergeFormValue() {
        for (let control in this.mergeFormGroup.controls) {
            // this.moveItemForm.controls[control].setErrors(null);
            this.mergeFormGroup.controls[control].markAsPristine();
            this.mergeFormGroup.controls[control].markAsUntouched();
            this.mergeFormGroup.controls[control].updateValueAndValidity();
        }
    }
}
