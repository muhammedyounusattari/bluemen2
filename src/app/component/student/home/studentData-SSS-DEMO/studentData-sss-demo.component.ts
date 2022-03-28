import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'app-student-sss-demo',
    templateUrl: './studentData-sss-demo.component.html',
    styleUrls: ['./studentData-sss-demo.component.css']
})

export class StudentDataSSSDemoComponent implements OnInit {
    public columnsToDisplay: string[] =
        ['firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
    @ViewChild('studentDataPopup') studentDataPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    };

    @ViewChild('newStudentDataEntryPopup') newStudentDataEntryPopupRef: TemplateRef<any>;
    newStudentRef: BsModalRef;
    newStudentModalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-sm'
    };

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }

    isCurrentStatus = true;
    isEOYStatus = false;
    isActivity = false;
    isParentInfo = false;
    formGroup: FormGroup;
    SSNO = '';
    firstName = '';
    lastName = '';
    middleNameInitial = '';

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

    activeTab(name: string) {
        let firstTab = window.document.getElementById('CurrentStatusTab');
        let secondTab = window.document.getElementById('EOYStatusTab');
        if (firstTab) {
            firstTab.style.borderBottom = "transparent";
        }
        if (secondTab) {
            secondTab.style.borderBottom = "transparent";
        }
        this.isCurrentStatus = false;
        this.isActivity = false;
        this.isEOYStatus = false;
        this.isParentInfo = false;
        if (name === 'EOYStatusTab') {
            if (secondTab) {
                secondTab.style.borderBottom = "2px solid #0000FF";
                this.isEOYStatus = true;
            }
        } else {
            if (firstTab) {
                this.isCurrentStatus = true;
                firstTab.style.borderBottom = "2px solid #0000FF";
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
            'entiryGradeLevel': [''],
            'academicNeed': [''],
            'enrollmentStatus': [''],
            'firstEnrollment': [''],
            'cohortYear': [''],
            'cohortYearTxt': [''],
            'dtFirstService': [''],
            'participantNameChanged': [''],
            'fiscalYear': [''],
            'active': [''],
            'served': [''],
            'reported': [''],
            'counselor': [''],
            'gradeStanding': [''],
            'participantStatus': [''],
            'gpaEnd': [''],
            'enrollmentStatusAtEnd': [''],
            'collegeGradLevelStart': [''],
            'academicStanding': [''],
            'collegeGradLevelEnd': [''],
            'dtLastProject': [''],
            'reasonWithdrawal': [''],
            'transferStatus': [''],
            'degreeInstitute': [''],
            'dtDegree': [''],
            'fieldStudyDegree': [''],
            'persistenceNY': [''],
            'financialAidName': [''],
            'neededFinancialAid': [false],
            'neededGrantAid': [false],
            'amtFAN': [''],
            'amtGAN': [''],
            'recFinancialAid': [false],
            'recGrantAid': [false],
            'amtFAR': [''],
            'amtGAA': [''],
            'FANNotes': ['']
        });
    }

    openStudentPopup() {
        setTimeout(() => {
            this.activeTab('CurrentStatusTab');
        }, 100);
        this.newStudentRef.hide();
        this.openModal(this.studentDataPopupRef);
    }

    openNewStudentDEPopup() {
        this.openNewStudentDEModal(this.newStudentDataEntryPopupRef);
    }

    openNewStudentDEModal(template: TemplateRef<any>) {
        this.newStudentRef = this.modalService.show(template, this.newStudentModalConfigSM)
    }
    /**
     * @method openModal
     */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
}


