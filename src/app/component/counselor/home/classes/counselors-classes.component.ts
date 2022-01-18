import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CounselorsService } from 'src/app/services/counselor/counselors.service';
import { CounselorClassesListEnum } from 'src/app/constants/enums/counselor-classes-list.enum';
import { StudentListEnum } from 'src/app/constants/enums/student-list.enum';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
    selector: 'app-counselor-classes',
    templateUrl: './counselors-classes.component.html',
    styleUrls: ['./counselors-classes.component.css']
})

export class CounselorClassesComponent implements OnInit {
    counselorClassesListData: any;
    @ViewChild('counselorClassesPopup') counselorClassesPopupRef: TemplateRef<any>;

    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    };
    studentModalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
    };
    selectedClassesRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedClassesRowIndex: any;

    // Counselor Classes List Grid DT start
    columnsToDisplay: string[] = ['currentYear', 'semester', 'counselorName', 'subject',
        'classPeriod', 'meetingTime', 'days', 'room', 'maxLimit', 'studentAssigned'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    // Counselor Classes List End

    // Counselor Classes Student Grid DT start
    selectedClassesStudentRowIndex: any;
    selectedClassesStudentRow: any;
    columnsToDisplay1: string[] = ['firstName', 'lastName', 'grade', 'gradeNotes'];
    dataSource1: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator1: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort1: MatSort;
    @ViewChild(MatSort) set matSort1(sort1: MatSort) {
        if (this.dataSource1 && !this.dataSource1.sort) {
            this.dataSource1.sort = sort1;
        }
    }
    isLoading1: boolean = true;
    // Counselor Classes Student Grid DT End

    // Student List Grid DT Start
    public studentListColumnsToDisplay: string[] =
        ['ssno', 'firstName', 'lastName', 'phoneNumber', 'fiscalYear', 'active', 'served', 'reported', 'counselor', 'school', 'standing'];
    public studentListDataSource: MatTableDataSource<any>;
    @ViewChild('studentListPopup') studentListPopupRef: TemplateRef<any>;
    public studentListModalRef: BsModalRef;

    @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort2: MatSort;
    @ViewChild(MatSort) set matSort2(sort2: MatSort) {
        if (this.studentListDataSource && !this.studentListDataSource.sort) {
            this.studentListDataSource.sort = sort2;
        }
    };
    studentsList: any;
    selectedStudentRow: any = null;
    selectedStudentRowIndex: any;
    isLoading2: boolean = true;
    // Student List Grid DT End

    counselorClassListEnum: CounselorClassesListEnum = new CounselorClassesListEnum();

    // Grade pop up
    @ViewChild('classesGradeModalPopup') classesGradeModalPopupRef: TemplateRef<any>;
    classesGradeModalRef: BsModalRef;
    gradeModalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md'
    };
    grade: any = '';
    gradeNotes: any = '';

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private _counselorClassesService: CounselorsService
        , private _studentService: StudentService
        , private toastr: ToastrService) { }

    ngOnInit(): void {
        this.counselorClassesListData = [];
        this.myElement = window.document.getElementById('loading');
        this.counselorClassListEnum = new CounselorClassesListEnum();
        this.counselorClassListEnum.studentList = new Array<StudentListEnum>();
        this.getCounselorClassesList();
    }

   ngAfterViewInit() {
       this.dataSource.paginator = this.paginator;
   }

    getCounselorClassesList() {
        this._counselorClassesService.getCounselorClassesList().subscribe(result => {
            this.hideLoader();
            if (result) {
                this.counselorClassesListData = result;
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.selectedClassesRowIndex = null;
                this.dataSource.sort = this.sort;
            }
        });
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyClassFilter(filterValue: any) {
        // this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        // if (this.dataSource.paginator) {
        //     this.dataSource.paginator.firstPage();
        // }
    }

    openModal(template: TemplateRef<any>) {
        this.counselorClassListEnum = new CounselorClassesListEnum();
        this.counselorClassListEnum.studentList = new Array<StudentListEnum>();
        this.modalRef = this.modalService.show(template, this.modalConfigSM);
    }

    resetFields() {
        this.openModal(this.counselorClassesPopupRef);
        this.bindClassesStudentListData();
    }

    resetVariables() {
        this.selectedClassesRow = null;
        this.selectedClassesStudentRow = null;
        this.selectedClassesRowIndex = null;
        this.selectedClassesStudentRowIndex = null;
        this.selectedStudentRow = null;
    }

    bindDataToProperties(object: any) {
        this.counselorClassListEnum.id = object.id;
        this.counselorClassListEnum.classPeriod = object.classPeriod;
        this.counselorClassListEnum.currentYear = object.currentYear;
        this.counselorClassListEnum.days = object.days;
        this.counselorClassListEnum.duration = object.duration;
        this.counselorClassListEnum.maxLimit = object.maxLimit;
        this.counselorClassListEnum.meetingTime = object.meetingTime;
        this.counselorClassListEnum.notes = object.notes;
        this.counselorClassListEnum.room = object.room;
        this.counselorClassListEnum.semester = object.semester;
        this.counselorClassListEnum.studentAssigned = object.studentAssigned;
        this.counselorClassListEnum.studentList = object.studentList;
        this.counselorClassListEnum.subject = object.subject;
        this.counselorClassListEnum.counselorName = object.counselorName;
    }

    setValuesToUpdate() {
        if (this.selectedClassesRow) {
            this.isEdit = true;
            if (this.counselorClassesListData) {
                const selectedData = this.counselorClassesListData.filter((item: any) => item.id === this.selectedClassesRow.id);
                if (selectedData && selectedData.length > 0) {
                    this.bindDataToProperties(selectedData[0]);
                    this.bindClassesStudentListData();
                    this.modalRef = this.modalService.show(this.counselorClassesPopupRef, this.modalConfigSM);
                }
            }
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
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

    // Counselor Classes Grid : Store selected row data
    setSelectedClassesGridRow(selectedRowItem: any, index: Number) {
        this.selectedClassesRowIndex = index;
        this.selectedClassesRow = selectedRowItem;
    }

    // Assigned Student List Grid : Store selected row data
    bindClassesStudentListData() {
        this.dataSource1 = new MatTableDataSource(this.counselorClassListEnum.studentList);
        this.counselorClassListEnum.studentAssigned = this.counselorClassListEnum.studentList.length.toString();
        this.dataSource1.paginator = this.paginator1;
        this.selectedStudentRowIndex = null;
        this.dataSource1.sort = this.sort1;
        this.isLoading1 = false;
    }

    openStudentModal() {
        this.isLoading2 = true;
        this.selectedStudentRow = null;
        this.selectedStudentRowIndex = null;
        this.bindStudentListToGrid();
        this.studentListModalRef = this.modalService.show(this.studentListPopupRef, this.studentModalConfigSM);
    }

    getSelectedStudentRow(selectedRowItem: any, index: any) {
        this.selectedStudentRowIndex = index;
        this.selectedStudentRow = selectedRowItem;
    }

    bindStudentListToGrid() {
        this._studentService.getTStudentsList().subscribe(result => {
            this.isLoading2 = false;
            if (result) {
                this.studentsList = result;
                this.studentListDataSource = new MatTableDataSource(result);
                this.studentListDataSource.sort = this.sort2;
                this.studentListDataSource.paginator = this.paginator2;
            }
        })
    }

    setSelectedRowOfClassesStudent(selectedRowItem: any, index: number) {
        this.selectedStudentRowIndex = index;
        this.selectedClassesStudentRow = selectedRowItem;
    }

    addSelectedStudentToClassGrid() {
        this.selectedStudentRow.grade = '';
        this.selectedStudentRow.gradeNotes = '';
        this.counselorClassListEnum.studentList.push(this.selectedStudentRow);
        this.bindClassesStudentListData();
        this.selectedStudentRow = null;
        this.studentListModalRef.hide();
    }

    removeSelectedStudent() {
        if (this.selectedClassesStudentRow) {
            if (this.counselorClassListEnum.studentList && this.counselorClassListEnum.studentList.length > 0) {
                const updatedAssignedStudentList = this.counselorClassListEnum.studentList.filter(item => item.ssno !== this.selectedClassesStudentRow.ssno);
                this.counselorClassListEnum.studentList = updatedAssignedStudentList;
                this.bindClassesStudentListData();
            }
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    resetSelectedStudentAndFilter() {
        this.selectedStudentRow = null;
        this.selectedStudentRowIndex = null;
    }

    editStudentGrade() {
        if (this.selectedClassesStudentRow) {
            this.grade = this.selectedClassesStudentRow.grade;
            this.gradeNotes = this.selectedClassesStudentRow.gradeNotes;
            this.classesGradeModalRef = this.modalService.show(this.classesGradeModalPopupRef, this.gradeModalConfigSM);
        } else {
            this.toastr.info('Please select student to update his/her grade', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    updateStudentGrade() {
        const updateStudent = this.counselorClassListEnum.studentList.filter(item => item.ssno === this.selectedClassesStudentRow.ssno);
        if (updateStudent && updateStudent.length > 0) {
            updateStudent[0].grade = this.grade;
            updateStudent[0].gradeNotes = this.gradeNotes;
        }
        this.bindClassesStudentListData();
        this.classesGradeModalRef.hide();
    }

    addCounselorClassesToList() {
        this.showLoader();
        this._counselorClassesService.addToCounselorClassesList(this.counselorClassListEnum).subscribe(result => {
            this.hideLoader();
            if (result) {
                this.getCounselorClassesList();
                this.modalRef.hide();
                this.toastr.success('Saved successfully !', '', {
                    timeOut: 5000,
                    closeButton: true
                });
            }
        });
    }

    updateCounselorClassesToList() {
        this.showLoader();
        this._counselorClassesService.updateCounselorClassesList(this.counselorClassListEnum).subscribe(result => {
            this.hideLoader();
            if (result) {
                this.isEdit = false;
                this.selectedClassesRow = null;
                this.getCounselorClassesList();
                this.modalRef.hide();
                this.toastr.success('Updated successfully !', '', {
                    timeOut: 5000,
                    closeButton: true
                });
            }
        });
    }

    deleteSelectedRow() {
        if (this.selectedClassesRow) {
            const data = {
                id: this.selectedClassesRow.id
            }
            this.showLoader();
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm remove record',
                    message: 'Are you sure, you want to remove this record: ' + this.selectedClassesRow.firstName
                }
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result === true) {
                    this._counselorClassesService.deleteCounselorClassesList(data).subscribe(result => {
                        this.getCounselorClassesList();
                        this.toastr.success('Deleted successfully !', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.toastr.info('Please select a row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }
}
