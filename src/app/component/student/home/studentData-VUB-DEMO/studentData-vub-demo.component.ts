import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
    selector: 'app-student-vub-demo',
    templateUrl: './studentData-vub-demo.component.html',
    styleUrls: ['./studentData-vub-demo.component.css']
})

export class StudentDataVUBDemoComponent implements OnInit, AfterViewInit {
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
    isEntryCurStatusTab = false;
    isActivity = false;
    isPermInfo = false;
    isPostInfoTab = false;
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
        let entryCurStatusTab = window.document.getElementById('EntryCurStatusTab');
        let postInfoTab = window.document.getElementById('PostInfoTab');
        let permAddTab = window.document.getElementById('PermAddTab');
        let activityTab = window.document.getElementById('ActivityTab');
        if (profileTab) {
            profileTab.style.borderBottom = "transparent";
        }
        if (entryCurStatusTab) {
            entryCurStatusTab.style.borderBottom = "transparent";
        }
        if (postInfoTab) {
            postInfoTab.style.borderBottom = "transparent";
        }
        if (permAddTab) {
            permAddTab.style.borderBottom = "transparent";
        }
        if (activityTab) {
            activityTab.style.borderBottom = "transparent";
        }
        this.isProfileTab = false;
        this.isEntryCurStatusTab = false;
        this.isPostInfoTab = false;
        this.isPermInfo = false;
        this.isActivity = false;
        if (name === 'EntryCurStatusTab') {
            if (entryCurStatusTab) {
                entryCurStatusTab.style.borderBottom = "2px solid #0000FF";
                this.isEntryCurStatusTab = true;
            }
        } else if (name === 'PostInfoTab') {
            if (postInfoTab) {
                postInfoTab.style.borderBottom = "2px solid #0000FF";
                this.isPostInfoTab = true;
            }
        } else if (name === 'PermAddTab') {
            if (permAddTab) {
                permAddTab.style.borderBottom = "2px solid #0000FF";
                this.isPermInfo = true;
            }
        } else if (name === 'ActivityTab') {
            if (activityTab) {
                activityTab.style.borderBottom = "2px solid #0000FF";
                this.isActivity = true;
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
            'riskOutSchool': [''],
            'riskLowStd': [''],
            'riskDisability': [''],
            'academicNeed': [''],
            'recruitment': [''],
            'vetranEduStatus': [''],
            'enrollmentStatus': [''],
            'servedFFP': [''],
            'callADFE': [''],
            'academicImpStd': [''],
            'dtLastProgService': [false],
            'vubProgCompYear': [''],
            'reasonForLeaving': [''],
            'entryClgDate': [''],
            'postSecondEnrolCohYear': [''],
            'clgFirstAttended': [''],
            'sourcePSEInfo': [''],
            'clgStatusBegofNextAcademicYear': [''],
            'psRemediation': [''],
            'certDipComp': [''],
            'dtCertDip': [''],
            'associatedDegAtt': [''],
            'dtAssociatedDeg': [''],
            'bachDegAtt': [''],
            'dtBachDeg': [''],
            'degCertComp': [''],
            'dtOfDegree': [''],
            'lengthOfActDuty': ['']
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


