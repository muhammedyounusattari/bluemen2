import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'app-student-ts-demo',
    templateUrl: './studentData-tsDemo.component.html',
    styleUrls: ['./studentData-tsDemo.component.css']
})

export class StudentDataTSDEMOComponent implements OnInit, AfterViewInit {
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

    isCurrentStatus = true;
    isEOYStatus = false;
    isActivity = false;
    isParentInfo = false;
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
        let domElement = window.document.getElementById('CurrentStatusTab');
        if (domElement) {
            domElement.style.borderBottom = "2px solid #0000FF";
        }
    }

    activeTab(name: string) {
        let firstTab = window.document.getElementById('CurrentStatusTab');
        let secondTab = window.document.getElementById('EOYStatusTab');
        let thirdTab = window.document.getElementById('ActivityTab');
        let fourthTab = window.document.getElementById('ParentsInfoTab');
        if (firstTab) {
            firstTab.style.borderBottom = "transparent";
        }
        if (secondTab) {
            secondTab.style.borderBottom = "transparent";
        }
        if (thirdTab) {
            thirdTab.style.borderBottom = "transparent";
        }
        if (fourthTab) {
            fourthTab.style.borderBottom = "transparent";
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
        } else if (name === 'ActivityTab') {
            if (thirdTab) {
                this.isActivity = true;
                thirdTab.style.borderBottom = "2px solid #0000FF";
            }
        } else if (name === 'ParentsInfoTab') {
            if (fourthTab) {
                this.isParentInfo = true;
                fourthTab.style.borderBottom = "2px solid #0000FF";
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
            'eligibility': [''],
            'ethinicity': [''],
            'gender': [''],
            'fiscalYear': [''],
            'active': [false],
            'served': [false],
            'reported': [false],
            'ageOfFiscalYear': [''],
            'cohortYear': [''],
            'school': [''],
            'college': [''],
            'participantStatus': [''],
            'counselor': [''],
            'gradeStanding': [''],
            'collegeType': [''],
            'military': [''],
            'highestDegree': [''],
            'trackGraduate': [''],
            'trackYear': [''],
            'randomId': [''],
            'servedByTrio': [''],
            'dualEnrollment': [''],
            'rigEnrollment': [''],
            'fafsaCompletion': [''],
            'cpp': [''],
            'notes': []
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


