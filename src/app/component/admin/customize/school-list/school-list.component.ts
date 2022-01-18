import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CollegeAndSchoolService } from '../../../../services/admin/college-school.service';
import { SchoolListEnum } from '../../../../constants/enums/school-list.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html'
    // styleUrls: ['./pulldown-list.component.css']
})

export class SchoolListComponent implements OnInit {
    schoolDataList: any = [];
    schoolListEnum: SchoolListEnum = new SchoolListEnum();
    @ViewChild('schoolNamePopup') schoolNamePopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    requestData: any = {
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
        ncesId: '',
        fiscalYear: '',
        fafsaId: null,
        inPullDown: false
    };
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    isDisabled: boolean = false;
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

    countryList = [
        { "name": "Albania" },
        { "name": "Åland Islands" },
        { "name": "Algeria" },
        { "name": "American Samoa", "code": "AS" },
        { "name": "Andorra", "code": "AD" },
        { "name": "Angola", "code": "AO" },
        { "name": "Anguilla", "code": "AI" },
        { "name": "Antarctica", "code": "AQ" },
        { "name": "Antigua and Barbuda", "code": "AG" },
        { "name": "Argentina", "code": "AR" },
        { "name": "Armenia", "code": "AM" },
        { "name": "Aruba", "code": "AW" },
        { "name": "Australia", "code": "AU" },
        { "name": "Austria", "code": "AT" },
        { "name": "Azerbaijan", "code": "AZ" },
        { "name": "Bahamas (the)", "code": "BS" },
        { "name": "Bahrain", "code": "BH" },
        { "name": "Bangladesh", "code": "BD" },
        { "name": "Barbados", "code": "BB" },
        { "name": "Belarus", "code": "BY" },
        { "name": "Belgium", "code": "BE" },
        { "name": "Belize", "code": "BZ" },
        { "name": "Benin", "code": "BJ" },
        { "name": "Bermuda", "code": "BM" },
        { "name": "Bhutan", "code": "BT" },
        { "name": "Bolivia (Plurinational State of)", "code": "BO" },
        { "name": "Bonaire, Sint Eustatius and Saba", "code": "BQ" },
        { "name": "Bosnia and Herzegovina", "code": "BA" },
        { "name": "Botswana", "code": "BW" },
        { "name": "Bouvet Island", "code": "BV" },
        { "name": "Brazil", "code": "BR" },
        { "name": "British Indian Ocean Territory (the)", "code": "IO" },
        { "name": "Brunei Darussalam", "code": "BN" },
        { "name": "Bulgaria", "code": "BG" },
        { "name": "Burkina Faso", "code": "BF" },
        { "name": "Burundi", "code": "BI" },
        { "name": "Cabo Verde", "code": "CV" },
        { "name": "Cambodia", "code": "KH" },
        { "name": "Cameroon", "code": "CM" },
        { "name": "Canada", "code": "CA" },
        { "name": "Cayman Islands (the)", "code": "KY" },
        { "name": "Central African Republic (the)", "code": "CF" },
        { "name": "Chad", "code": "TD" },
        { "name": "Chile", "code": "CL" },
        { "name": "China", "code": "CN" },
        { "name": "Christmas Island", "code": "CX" },
        { "name": "Cocos (Keeling) Islands (the)", "code": "CC" },
        { "name": "Colombia", "code": "CO" },
        { "name": "Comoros (the)", "code": "KM" },
        { "name": "Congo (the Democratic Republic of the)", "code": "CD" },
        { "name": "Congo (the)", "code": "CG" },
        { "name": "Cook Islands (the)", "code": "CK" },
        { "name": "Costa Rica", "code": "CR" },
        { "name": "Croatia", "code": "HR" },
        { "name": "Cuba", "code": "CU" },
        { "name": "Curaçao", "code": "CW" },
        { "name": "Cyprus", "code": "CY" },
        { "name": "Czechia", "code": "CZ" },
        { "name": "Côte d'Ivoire", "code": "CI" },
        { "name": "Denmark", "code": "DK" },
        { "name": "Djibouti", "code": "DJ" },
        { "name": "Dominica", "code": "DM" },
        { "name": "Dominican Republic (the)", "code": "DO" },
        { "name": "Ecuador", "code": "EC" },
        { "name": "Egypt", "code": "EG" },
        { "name": "El Salvador", "code": "SV" },
        { "name": "Equatorial Guinea", "code": "GQ" },
        { "name": "Eritrea", "code": "ER" },
        { "name": "Estonia", "code": "EE" },
        { "name": "Eswatini", "code": "SZ" },
        { "name": "Ethiopia", "code": "ET" },
        { "name": "Falkland Islands (the) [Malvinas]", "code": "FK" },
        { "name": "Faroe Islands (the)", "code": "FO" },
        { "name": "Fiji", "code": "FJ" },
        { "name": "Finland", "code": "FI" },
        { "name": "France", "code": "FR" },
        { "name": "French Guiana", "code": "GF" },
        { "name": "French Polynesia", "code": "PF" },
        { "name": "French Southern Territories (the)", "code": "TF" },
        { "name": "Gabon", "code": "GA" },
        { "name": "Gambia (the)", "code": "GM" },
        { "name": "Georgia", "code": "GE" },
        { "name": "Germany", "code": "DE" },
        { "name": "Ghana", "code": "GH" },
        { "name": "Gibraltar", "code": "GI" },
        { "name": "Greece", "code": "GR" },
        { "name": "Greenland", "code": "GL" },
        { "name": "Grenada", "code": "GD" },
        { "name": "Guadeloupe", "code": "GP" },
        { "name": "Guam", "code": "GU" },
        { "name": "Guatemala", "code": "GT" },
        { "name": "Guernsey", "code": "GG" },
        { "name": "Guinea", "code": "GN" },
        { "name": "Guinea-Bissau", "code": "GW" },
        { "name": "Guyana", "code": "GY" },
        { "name": "Haiti", "code": "HT" },
        { "name": "Heard Island and McDonald Islands", "code": "HM" },
        { "name": "Holy See (the)", "code": "VA" },
        { "name": "Honduras", "code": "HN" },
        { "name": "Hong Kong", "code": "HK" },
        { "name": "Hungary", "code": "HU" },
        { "name": "Iceland", "code": "IS" },
        { "name": "India", "code": "IN" },
        { "name": "Indonesia", "code": "ID" },
        { "name": "Iran (Islamic Republic of)", "code": "IR" },
        { "name": "Iraq", "code": "IQ" },
        { "name": "Ireland", "code": "IE" },
        { "name": "Isle of Man", "code": "IM" },
        { "name": "Israel", "code": "IL" },
        { "name": "Italy", "code": "IT" },
        { "name": "Jamaica", "code": "JM" },
        { "name": "Japan", "code": "JP" },
        { "name": "Jersey", "code": "JE" },
        { "name": "Jordan", "code": "JO" },
        { "name": "Kazakhstan", "code": "KZ" },
        { "name": "Kenya", "code": "KE" },
        { "name": "Kiribati", "code": "KI" },
        { "name": "Korea (the Democratic People's Republic of)", "code": "KP" },
        { "name": "Korea (the Republic of)", "code": "KR" },
        { "name": "Kuwait", "code": "KW" },
        { "name": "Kyrgyzstan", "code": "KG" },
        { "name": "Lao People's Democratic Republic (the)", "code": "LA" },
        { "name": "Latvia", "code": "LV" },
        { "name": "Lebanon", "code": "LB" },
        { "name": "Lesotho", "code": "LS" },
        { "name": "Liberia", "code": "LR" },
        { "name": "Libya", "code": "LY" },
        { "name": "Liechtenstein", "code": "LI" },
        { "name": "Lithuania", "code": "LT" },
        { "name": "Luxembourg", "code": "LU" },
        { "name": "Macao", "code": "MO" },
        { "name": "Madagascar", "code": "MG" },
        { "name": "Malawi", "code": "MW" },
        { "name": "Malaysia", "code": "MY" },
        { "name": "Maldives", "code": "MV" },
        { "name": "Mali", "code": "ML" },
        { "name": "Malta", "code": "MT" },
        { "name": "Marshall Islands (the)", "code": "MH" },
        { "name": "Martinique", "code": "MQ" },
        { "name": "Mauritania", "code": "MR" },
        { "name": "Mauritius", "code": "MU" },
        { "name": "Mayotte", "code": "YT" },
        { "name": "Mexico", "code": "MX" },
        { "name": "Micronesia (Federated States of)", "code": "FM" },
        { "name": "Moldova (the Republic of)", "code": "MD" },
        { "name": "Monaco", "code": "MC" },
        { "name": "Mongolia", "code": "MN" },
        { "name": "Montenegro", "code": "ME" },
        { "name": "Montserrat", "code": "MS" },
        { "name": "Morocco", "code": "MA" },
        { "name": "Mozambique", "code": "MZ" },
        { "name": "Myanmar", "code": "MM" },
        { "name": "Namibia", "code": "NA" },
        { "name": "Nauru", "code": "NR" },
        { "name": "Nepal", "code": "NP" },
        { "name": "Netherlands (the)", "code": "NL" },
        { "name": "New Caledonia", "code": "NC" },
        { "name": "New Zealand", "code": "NZ" },
        { "name": "Nicaragua", "code": "NI" },
        { "name": "Niger (the)", "code": "NE" },
        { "name": "Nigeria", "code": "NG" },
        { "name": "Niue", "code": "NU" },
        { "name": "Norfolk Island", "code": "NF" },
        { "name": "Northern Mariana Islands (the)", "code": "MP" },
        { "name": "Norway", "code": "NO" },
        { "name": "Oman", "code": "OM" },
        { "name": "Pakistan", "code": "PK" },
        { "name": "Palau", "code": "PW" },
        { "name": "Palestine, State of", "code": "PS" },
        { "name": "Panama", "code": "PA" },
        { "name": "Papua New Guinea", "code": "PG" },
        { "name": "Paraguay", "code": "PY" },
        { "name": "Peru", "code": "PE" },
        { "name": "Philippines (the)", "code": "PH" },
        { "name": "Pitcairn", "code": "PN" },
        { "name": "Poland", "code": "PL" },
        { "name": "Portugal", "code": "PT" },
        { "name": "Puerto Rico", "code": "PR" },
        { "name": "Qatar", "code": "QA" },
        { "name": "Republic of North Macedonia", "code": "MK" },
        { "name": "Romania", "code": "RO" },
        { "name": "Russian Federation (the)", "code": "RU" },
        { "name": "Rwanda", "code": "RW" },
        { "name": "Réunion", "code": "RE" },
        { "name": "Saint Barthélemy", "code": "BL" },
        { "name": "Saint Helena, Ascension and Tristan da Cunha", "code": "SH" },
        { "name": "Saint Kitts and Nevis", "code": "KN" },
        { "name": "Saint Lucia", "code": "LC" },
        { "name": "Saint Martin (French part)", "code": "MF" },
        { "name": "Saint Pierre and Miquelon", "code": "PM" },
        { "name": "Saint Vincent and the Grenadines", "code": "VC" },
        { "name": "Samoa", "code": "WS" },
        { "name": "San Marino", "code": "SM" },
        { "name": "Sao Tome and Principe", "code": "ST" },
        { "name": "Saudi Arabia", "code": "SA" },
        { "name": "Senegal", "code": "SN" },
        { "name": "Serbia", "code": "RS" },
        { "name": "Seychelles", "code": "SC" },
        { "name": "Sierra Leone", "code": "SL" },
        { "name": "Singapore", "code": "SG" },
        { "name": "Sint Maarten (Dutch part)", "code": "SX" },
        { "name": "Slovakia", "code": "SK" },
        { "name": "Slovenia", "code": "SI" },
        { "name": "Solomon Islands", "code": "SB" },
        { "name": "Somalia", "code": "SO" },
        { "name": "South Africa", "code": "ZA" },
        { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
        { "name": "South Sudan", "code": "SS" },
        { "name": "Spain", "code": "ES" },
        { "name": "Sri Lanka", "code": "LK" },
        { "name": "Sudan (the)", "code": "SD" },
        { "name": "Suriname", "code": "SR" },
        { "name": "Svalbard and Jan Mayen", "code": "SJ" },
        { "name": "Sweden", "code": "SE" },
        { "name": "Switzerland", "code": "CH" },
        { "name": "Syrian Arab Republic", "code": "SY" },
        { "name": "Taiwan (Province of China)", "code": "TW" },
        { "name": "Tajikistan", "code": "TJ" },
        { "name": "Tanzania, United Republic of", "code": "TZ" },
        { "name": "Thailand", "code": "TH" },
        { "name": "Timor-Leste", "code": "TL" },
        { "name": "Togo", "code": "TG" },
        { "name": "Tokelau", "code": "TK" },
        { "name": "Tonga", "code": "TO" },
        { "name": "Trinidad and Tobago", "code": "TT" },
        { "name": "Tunisia", "code": "TN" },
        { "name": "Turkey", "code": "TR" },
        { "name": "Turkmenistan", "code": "TM" },
        { "name": "Turks and Caicos Islands (the)", "code": "TC" },
        { "name": "Tuvalu", "code": "TV" },
        { "name": "Uganda", "code": "UG" },
        { "name": "Ukraine", "code": "UA" },
        { "name": "United Arab Emirates (the)", "code": "AE" },
        { "name": "United Kingdom of Great Britain and Northern Ireland (the)", "code": "GB" },
        { "name": "United States Minor Outlying Islands (the)", "code": "UM" },
        { "name": "United States of America (the)", "code": "US" },
        { "name": "Uruguay", "code": "UY" },
        { "name": "Uzbekistan", "code": "UZ" },
        { "name": "Vanuatu", "code": "VU" },
        { "name": "Venezuela (Bolivarian Republic of)", "code": "VE" },
        { "name": "Viet Nam", "code": "VN" },
        { "name": "Virgin Islands (British)", "code": "VG" },
        { "name": "Virgin Islands (U.S.)", "code": "VI" },
        { "name": "Wallis and Futuna", "code": "WF" },
        { "name": "Western Sahara", "code": "EH" },
        { "name": "Yemen", "code": "YE" },
        { "name": "Zambia", "code": "ZM" },
        { "name": "Zimbabwe", "code": "ZW" }
    ];

    cityList = [
        { "name": "Aurangabad" },
        { "name": "Delhi" },
        { "name": "Mumbai" },
        { "name": "Nagpur" },
        { "name": "Pune" },
        { "name": "Vadodara" }
    ];

    stateList = [
        { "name": "Andhra Pradesh" },
        { "name": "Gujrat" },
        { "name": "Maharashtra" },
        { "name": "UP" }
    ];

    constructor(private modalService: BsModalService
        , private router: Router
        , private dialog: MatDialog
        , private _collegeAndSchoolService: CollegeAndSchoolService
        , private toastr: ToastrService) { }

    ngOnInit() {
        this.myElement = window.document.getElementById('loading');
        this.navigateToComponent('service-group-list');
        this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
            this.hideLoader();
            let domElement = window.document.getElementById('SCHOOL_LIST');
            if (domElement) {
                domElement.style.borderBottom = "2px solid #1672B7";
            }
            if (result) {
                this.dataSource = new MatTableDataSource(result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined));
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                this.schoolDataList = result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined);
            }
        });
    }

    navigateToComponent(componentName: string) {
        if (componentName === 'college-list') {
            this.router.navigate(['admin/college-list']);
        } else if (componentName === 'school-list') {
            this.router.navigate(['admin/school-list']);
        }
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    setValuesToUpdate() {
        if (this.selectedRow) {
            this.isEdit = true;
            this.isDisabled = true;
            this.schoolListEnum.orgName = this.selectedRow.name;
            this.schoolListEnum.inPullDown = this.selectedRow.inPullDown;
            this.schoolListEnum.name = this.selectedRow.name;
            this.schoolListEnum.codes = this.selectedRow.codes;
            this.schoolListEnum.title = this.selectedRow.title;
            this.schoolListEnum.country = this.selectedRow.country;
            this.schoolListEnum.address = this.selectedRow.address;
            this.schoolListEnum.ncesId = this.selectedRow.ncesId;
            this.schoolListEnum.city = this.selectedRow.city;
            this.schoolListEnum.states = this.selectedRow.states;
            this.schoolListEnum.zipcode = this.selectedRow.zipcode;
            this.schoolListEnum.fiscalYear = this.selectedRow.fiscalYear;
            this.schoolListEnum.phone1 = this.selectedRow.phone1;
            this.schoolListEnum.phone2 = this.selectedRow.phone2;
            this.schoolListEnum.phone3 = this.selectedRow.phone3;
            this.schoolListEnum.fax = this.selectedRow.fax;
            this.schoolListEnum.website = this.selectedRow.website;
            this.schoolListEnum.email = this.selectedRow.email;
            this.schoolListEnum.notes = this.selectedRow.notes;
            this.openModal(this.schoolNamePopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    resetFields() {
        this.isEdit = false;
        this.schoolListEnum = new SchoolListEnum();
        this.isDisabled = false;
        this.openModal(this.schoolNamePopupRef);
    }

    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
    }

    setSelectedRow(selectedRowItem: any, index: number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    addNewSchoolName() {
        this.showLoader();
        if (this.schoolListEnum.ncesId) {
            if (this.schoolDataList && this.schoolDataList.length > 0) {
                const isFound = this.schoolDataList.filter((item: any) => item.fafsaId === this.schoolListEnum.ncesId);
                if (isFound && isFound.length > 0) {
                    this.hideLoader();
                    this.toastr.info('Entered NCESID is alreay exist, to add this organization name please change entered NCESID.', '', {
                        timeOut: 5000,
                        closeButton: true
                    });
                    return;
                }
            }
        } else {
            this.hideLoader();
            this.toastr.info('Please enter NCESID.', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
        this.requestData.orgName = this.schoolListEnum.name;
        this.requestData.inPullDown = this.schoolListEnum.inPullDown;
        this.requestData.name = this.schoolListEnum.name;
        this.requestData.codes = this.schoolListEnum.codes;
        this.requestData.title = this.schoolListEnum.title;
        this.requestData.country = this.schoolListEnum.country;
        this.requestData.address = this.schoolListEnum.address;
        this.requestData.ncesId = this.schoolListEnum.ncesId;
        this.requestData.city = this.schoolListEnum.city;
        this.requestData.states = this.schoolListEnum.states;
        this.requestData.zipcode = this.schoolListEnum.zipcode;
        this.requestData.fiscalYear = this.schoolListEnum.fiscalYear;
        this.requestData.phone1 = this.schoolListEnum.phone1;
        this.requestData.phone2 = this.schoolListEnum.phone2;
        this.requestData.phone3 = this.schoolListEnum.phone3;
        this.requestData.fax = this.schoolListEnum.fax;
        this.requestData.website = this.schoolListEnum.website;
        this.requestData.email = this.schoolListEnum.email;
        this.requestData.notes = this.schoolListEnum.notes;
        this.requestData.fafsaId = null;

        this._collegeAndSchoolService.postStudentName(this.requestData).subscribe(result => {
            if (result) {
                this.modalRef.hide();
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined));
                        this.dataSource.paginator = this.paginator;
                        this.selectedRowIndex = null;
                        this.dataSource.sort = this.sort;
                        document.getElementById('closePopup')?.click();
                        this.schoolDataList = result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined);

                        this.toastr.success('Saved successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            }
        });
    }

    deleteSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.orgName = this.selectedRow.name;
            this.requestData.inPullDown = this.selectedRow.inPullDown;
            this.requestData.name = this.selectedRow.name;
            this.requestData.codes = this.selectedRow.codes;
            this.requestData.title = this.selectedRow.title;
            this.requestData.country = this.selectedRow.country;
            this.requestData.address = this.selectedRow.address;
            this.requestData.ncesId = this.selectedRow.ncesId;
            this.requestData.city = this.selectedRow.city;
            this.requestData.states = this.selectedRow.states;
            this.requestData.zipcode = this.selectedRow.zipcode;
            this.requestData.fiscalYear = this.selectedRow.fiscalYear;
            this.requestData.phone1 = this.selectedRow.phone1;
            this.requestData.phone2 = this.selectedRow.phone2;
            this.requestData.phone3 = this.selectedRow.phone3;
            this.requestData.fax = this.selectedRow.fax;
            this.requestData.website = this.selectedRow.website;
            this.requestData.email = this.selectedRow.email;
            this.requestData.notes = this.selectedRow.notes;

            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Remove Record',
                    message: 'Are you sure, you want to remove this School: ' + this.selectedRow.orgName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._collegeAndSchoolService.deleteCollegeSchoolName(this.requestData).subscribe(result => {
                        this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                            this.hideLoader();
                            this.selectedRowIndex = null;
                            if (result) {
                                this.dataSource = new MatTableDataSource(result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined));
                                this.dataSource.paginator = this.paginator;
                                this.selectedRow = null;
                                this.dataSource.sort = this.sort;
                                this.schoolDataList = result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined);

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

    updateSelectedRow() {
        if (this.selectedRow) {
            this.showLoader();
            this.requestData.orgName = this.schoolListEnum.name;
            this.requestData.inPullDown = this.schoolListEnum.inPullDown;
            this.requestData.name = this.schoolListEnum.name;
            this.requestData.codes = this.schoolListEnum.codes;
            this.requestData.title = this.schoolListEnum.title;
            this.requestData.country = this.schoolListEnum.country;
            this.requestData.address = this.schoolListEnum.address;
            this.requestData.ncesId = this.schoolListEnum.ncesId;
            this.requestData.city = this.schoolListEnum.city;
            this.requestData.states = this.schoolListEnum.states;
            this.requestData.zipcode = this.schoolListEnum.zipcode;
            this.requestData.fiscalYear = this.schoolListEnum.fiscalYear;
            this.requestData.phone1 = this.schoolListEnum.phone1;
            this.requestData.phone2 = this.schoolListEnum.phone2;
            this.requestData.phone3 = this.schoolListEnum.phone3;
            this.requestData.fax = this.schoolListEnum.fax;
            this.requestData.website = this.schoolListEnum.website;
            this.requestData.email = this.schoolListEnum.email;
            this.requestData.notes = this.schoolListEnum.notes;
            this.requestData.fafsaId = null;

            this._collegeAndSchoolService.updateCollegeSchoolName(this.requestData).subscribe(response => {
                this.modalRef.hide();
                this._collegeAndSchoolService.getCollegeSchoolNames('').subscribe(result => {
                    this.hideLoader();
                    this.selectedRowIndex = null;
                    if (result) {
                        this.dataSource = new MatTableDataSource(result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined));
                        this.dataSource.paginator = this.paginator;
                        this.selectedRow = null;
                        this.dataSource.sort = this.sort;
                        document.getElementById('closePopup')?.click();
                        this.schoolDataList = result.filter((item: any) => item.fafsaId === null || item.fafsaId === undefined);
                        this.isEdit = false;
                        this.toastr.success('Updated successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    }
                });
            });
        }
    }
}