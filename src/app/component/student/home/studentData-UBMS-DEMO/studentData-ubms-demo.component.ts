import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'app-student-ubms-demo',
    templateUrl: './studentData-ubms-demo.component.html',
    styleUrls: ['./studentData-ubms-demo.component.css']
})

export class StudentDataUBMSDemoComponent implements OnInit, AfterViewInit {
    public columnsToDisplay: string[] =
        ['firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
    @ViewChild('studentDataPopup') studentDataPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    }
    @ViewChild('permanentAddressInfoPopup') permanentAddressInfoPopupRef: TemplateRef<any>;
    addressmodalRef: BsModalRef;
    addressModalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    }
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }

    isProfileTab = true;
    isEntryInfoTab = false;
    isActivity = false;
    isNumberTab1 = false;
    isNumberTab2 = false;
    isNumberTab3 = false;
    isParentsInfoTab = false;
    isAPRSubjectTab = false;
    formGroup: FormGroup;

    constructor(private modalService: BsModalService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService) { }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Student Data');
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.createFB();
    }

    ngAfterViewInit(): void {
        let domElement = window.document.getElementById('ProfileTab');
        if (domElement) {
            domElement.style.borderBottom = "2px solid #0000FF";
        }
    }

    activeTab(name: string) {
        let profileTab = window.document.getElementById('ProfileTab');
        let entryInfoTab = window.document.getElementById('EntryInfoTab');
        let numberTab1 = window.document.getElementById('NumberTab1');
        let numberTab2 = window.document.getElementById('NumberTab2');
        let numberTab3 = window.document.getElementById('NumberTab3');
        let parentsInfoTab = window.document.getElementById('ParentsInfoTab');
        let activityTab = window.document.getElementById('ActivityTab');
        let aPRTab = window.document.getElementById('APRTab');
        if (profileTab) {
            profileTab.style.borderBottom = "transparent";
        }
        if (entryInfoTab) {
            entryInfoTab.style.borderBottom = "transparent";
        }
        if (numberTab1) {
            numberTab1.style.borderBottom = "transparent";
        }
        if (numberTab2) {
            numberTab2.style.borderBottom = "transparent";
        }
        if (numberTab3) {
            numberTab3.style.borderBottom = "transparent";
        }
        if (parentsInfoTab) {
            parentsInfoTab.style.borderBottom = "transparent";
        }
        if (activityTab) {
            activityTab.style.borderBottom = "transparent";
        }
        if (aPRTab) {
            aPRTab.style.borderBottom = "transparent";
        }
        this.isProfileTab = false;
        this.isEntryInfoTab = false;
        this.isNumberTab1 = false;
        this.isNumberTab2 = false;
        this.isNumberTab3 = false;
        this.isParentsInfoTab = false;
        this.isActivity = false;
        this.isAPRSubjectTab = false;
        if (name === 'EntryInfoTab') {
            if (entryInfoTab) {
                entryInfoTab.style.borderBottom = "2px solid #0000FF";
                this.isEntryInfoTab = true;
            }
        } else if (name === 'NumberTab1') {
            if (numberTab1) {
                numberTab1.style.borderBottom = "2px solid #0000FF";
                this.isNumberTab1 = true;
            }
        } else if (name === 'NumberTab2') {
            if (numberTab2) {
                numberTab2.style.borderBottom = "2px solid #0000FF";
                this.isNumberTab2 = true;
            }
        } else if (name === 'NumberTab3') {
            if (numberTab3) {
                numberTab3.style.borderBottom = "2px solid #0000FF";
                this.isNumberTab3 = true;
            }
        } else if (name === 'ParentsInfoTab') {
            if (parentsInfoTab) {
                parentsInfoTab.style.borderBottom = "2px solid #0000FF";
                this.isParentsInfoTab = true;
            }
        } else if (name === 'ActivityTab') {
            if (activityTab) {
                activityTab.style.borderBottom = "2px solid #0000FF";
                this.isActivity = true;
            }
        } else if (name === 'APRTab') {
            if (aPRTab) {
                aPRTab.style.borderBottom = "2px solid #0000FF";
                this.isAPRSubjectTab = true;
            }
        } else {
            if (profileTab) {
                this.isProfileTab = true;
                profileTab.style.borderBottom = "2px solid #0000FF";
            }
        }
    }

    createFB() {
        this.formGroup = this.formBuilder.group({
            'studentId': [''],
            'firstName': [''],
            'mIValue': [''],
            'lastName': [''],
            'email': [''],
            'address': [''],
            'city': [''],
            'state': [''],
            'scanId': [''],
            'zipcode': [''],
            'phone1': [''],
            'phone1Type': [''],
            'sendTxtToPhone1': [''],
            'phone2': [''],
            'phone2Type': [''],
            'sendTxtToPhone2': [''],
            'siteLocation': [''],
            'dob': [''],
            'entryDate': [''],
            'ethinicity': [''],
            'gender': [''],
            'hisPanic': [false],
            'aIAN': [false],
            'asian': [false],
            'boAA': [false],
            'white': [false],
            'nHoI': [false],
            'eligibility': [''],
            'eligibilityType': [''],
            'nameChangedToOpt': [''],
            'notes': [''],
            'dtFirstService': [''],
            'fiscalYear': [''],
            'active': [''],
            'served': [''],
            'reported': [''],
            'counselor': [''],
            'gradeStanding': [''],
            'participantStatus': [''],
            'gpaEnd': [''],
            'enrollmentStatusAtEnd': [''],
            'riskReading': [''],
            'riskLowGPA': [''],
            'riskPreAlgebra': [''],
            'limitedEnglish': [''],
            'disConnectedYouth': [''],
            'otherAcademicNeed': [''],
            'entrySchool': [''],
            'dtOfFirstService': [''],
            'gradeLvlFirstService': [''],
            'partLevel': [''],
            'servedByFFP': [''],
            'gradeLvlStartForFiscalYear': [''],
            'gradeLvlBegForFiscalYear': [''],
            'hsGraduationStatus': [''],
            'rigProgram': [''],
            'ssRetention': [''],
            'hsGPAFiscalYear': [''],
            'hsGPAEnd': [''],
            'dtActualGraduation': [''],
            'metHSStateArts': [''],
            'metHSStateMath': [''],
            'advancedPlacement': [''],
            'dualEnrollment': [''],
            'dualEnrollmentCredential': [''],
            'advancedMathCC': [''],
            'fafsaCompletion': [''],
            'reasonForLeavingProgram': [''],
            'dtOfLastProject': [''],
            'sourchOfPSEI': [''],
            'firstClgAttended': [''],
            'psEntollmentCoYear': [''],
            'dtOfFirstClgEnrollment': [''],
            'clgStatusBegNxtAcademicYear': [''],
            'psEnrollmentReportYear': [''],
            'certDiplComp': [''],
            'dtOfDiplComp': [''],
            'asccociatedDegAtt': [''],
            'dtOfAssComp': [''],
            'bachDegAtt': [''],
            'dtOfBachDeg': [''],
            'psRemediation': [''],
            'psCompletion': [''],
            'psSTEMDeg': ['']
        });
    }

    openStudentPopup() {
        this.openModal(this.studentDataPopupRef);
    }
    /**
     * @method openModal
     */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    openAddPopup() {
        this.openAddressModal(this.permanentAddressInfoPopupRef);
    }

    openAddressModal(template: TemplateRef<any>) {
        this.addressmodalRef = this.modalService.show(template, this.addressModalConfigSM);
    }
}


