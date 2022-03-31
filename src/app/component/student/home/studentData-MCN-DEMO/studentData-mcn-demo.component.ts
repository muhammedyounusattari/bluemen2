import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'app-student-mcn-demo',
    templateUrl: './studentData-mcn-demo.component.html',
    styleUrls: ['./studentData-mcn-demo.component.css']
})

export class StudentDataMcnDemoComponent implements OnInit, AfterViewInit {
    public columnsToDisplay: string[] =
        ['firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
    @ViewChild('studentDataPopup') studentDataPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
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

    isDemoTab = true;
    isAcademic = false;
    isActivity = false;
    isGradInfoTab = false;
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
        let domElement = window.document.getElementById('DemographicTab');
        if (domElement) {
            domElement.style.borderBottom = "2px solid #0000FF";
        }
    }

    activeTab(name: string) {
        let demoTab = window.document.getElementById('DemographicTab');
        let academicTab = window.document.getElementById('AcademicTab');
        let actTab = window.document.getElementById('ActivityTab');
        let gradTab = window.document.getElementById('GradInfoTab');
        if (demoTab) {
            demoTab.style.borderBottom = "transparent";
        }
        if (academicTab) {
            academicTab.style.borderBottom = "transparent";
        }
        if (gradTab) {
            gradTab.style.borderBottom = "transparent";
        }
        if (actTab) {
            actTab.style.borderBottom = "transparent";
        }
        this.isDemoTab = false;
        this.isActivity = false;
        this.isAcademic = false;
        this.isGradInfoTab = false;
        if (name === 'AcademicTab') {
            if (academicTab) {
                academicTab.style.borderBottom = "2px solid #0000FF";
                this.isAcademic = true;
            }
        } else if (name === 'ActivityTab') {
            if (actTab) {
                this.isActivity = true;
                actTab.style.borderBottom = "2px solid #0000FF";
            }
        } else if (name === 'GradInfoTab') {
            if (gradTab) {
                this.isGradInfoTab = true;
                gradTab.style.borderBottom = "2px solid #0000FF";
            }
        } else {
            if (demoTab) {
                this.isDemoTab = true;
                demoTab.style.borderBottom = "2px solid #0000FF";
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
            'eligibility': [''],
            'ethinicity': [''],
            'gender': [''],
            'hisPanic': [false],
            'aIAN': [false],
            'asian': [false],
            'boAA': [false],
            'white': [false],
            'nHoI': [false],
            'entryCollegeDate': [''],
            'projectEntryDate': [''],
            'atteComCollege': [''],
            'etyGradeLevel': [''],
            'fiscalYear': [''],
            'active': [false],
            'served': [false],
            'reported': [false],
            'counselor': [''],
            'gradeStanding': [''],
            'partStatus': [''],
            'partLevel': [''],
            'clgEnrollStatus': [''],
            'fund': [''],
            'stemMajor': [''],
            'bachelorDegree': [''],
            'bachelorDt': [''],
            'bdCohortYear': [''],
            'mainStudyBachelorDegree': [''],
            'gpaEnd': [''],
            'research': [''],
            'scholarAct': [''],
            'internship': [''],
            'financialAid': [false],
            'financialUnmet': [''],
            'financialReqAmt': [''],
            'financialReason': [''],
            'financialAidRecv': [''],
            'financialAidName': [''],
            'financialRecAmt': [''],
            'academicNotes': [''],
            'gradSchAdmTest': [''],
            'dtFirstSchEnr': [''],
            'gradSchFstAttended': [''],
            'gradEnrlStatus': [''],
            'gradPerStatus': [''],
            'curYearGradStudy': [''],
            'majorFldStudy': [''],
            'gradMnFldStudy': [''],
            'gradAssShip': [''],
            'reasonLftGradSch': [''],
            'highestGradDegree': [''],
            'dtHighGradDegEarned': [''],
            'clgDoctEarned': [''],
            'doctEmpAct': [''],
            'nameChangedTo': ['']
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
}


