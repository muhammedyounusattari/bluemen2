import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { TeacherClassesListEnum } from 'src/app/constants/enums/teacher-classes-list.enum';
import { StudentListEnum } from 'src/app/constants/enums/student-list.enum';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
    selector: 'app-teachers-classes',
    templateUrl: './teachers-classes.component.html',
    styleUrls: ['./teachers-classes.component.css']
})

export class TeacherClassesComponent implements OnInit {
    teacherClassesListData: any;
    @ViewChild('teacherClassesPopup') teacherClassesPopupRef: TemplateRef<any>;

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

    // Teacher Classes List Grid DT start
    columnsToDisplay: string[] = ['currentYear', 'semester', 'teacherName', 'subject',
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
    // Teacher Classes List End

    // Teacher Classes Student Grid DT start
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
    // Teacher Classes Student Grid DT End

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

    teacherClassListEnum: TeacherClassesListEnum = new TeacherClassesListEnum();

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
        , private _teacheClassesService: TeacherService
        , private _studentService: StudentService
        , private toastr: ToastrService) { }

    ngOnInit(): void {
        this.teacherClassesListData = [];
        this.myElement = window.document.getElementById('loading');
        this.teacherClassListEnum = new TeacherClassesListEnum();
        this.teacherClassListEnum.studentList = new Array<StudentListEnum>();
        this.getTeacherClassesList();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getTeacherClassesList() {
        this._teacheClassesService.getTeacherClassesList().subscribe(result => {
            this.hideLoader();
            if (result) {
                this.teacherClassesListData = result;
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
        this.teacherClassListEnum = new TeacherClassesListEnum();
        this.teacherClassListEnum.studentList = new Array<StudentListEnum>();
        this.modalRef = this.modalService.show(template, this.modalConfigSM);
    }

    resetFields() {
        this.openModal(this.teacherClassesPopupRef);
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
        this.teacherClassListEnum.id = object.id;
        this.teacherClassListEnum.classPeriod = object.classPeriod;
        this.teacherClassListEnum.currentYear = object.currentYear;
        this.teacherClassListEnum.days = object.days;
        this.teacherClassListEnum.duration = object.duration;
        this.teacherClassListEnum.maxLimit = object.maxLimit;
        this.teacherClassListEnum.meetingTime = object.meetingTime;
        this.teacherClassListEnum.notes = object.notes;
        this.teacherClassListEnum.room = object.room;
        this.teacherClassListEnum.semester = object.semester;
        this.teacherClassListEnum.studentAssigned = object.studentAssigned;
        this.teacherClassListEnum.studentList = object.studentList;
        this.teacherClassListEnum.subject = object.subject;
        this.teacherClassListEnum.teacherName = object.teacherName;
    }

    setValuesToUpdate() {
        if (this.selectedClassesRow) {
            this.isEdit = true;
            if (this.teacherClassesListData) {
                const selectedData = this.teacherClassesListData.filter((item: any) => item.id === this.selectedClassesRow.id);
                if (selectedData && selectedData.length > 0) {
                    this.bindDataToProperties(selectedData[0]);
                    this.bindClassesStudentListData();
                    this.modalRef = this.modalService.show(this.teacherClassesPopupRef, this.modalConfigSM);
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

    // Teacher Classes Grid : Store selected row data
    setSelectedClassesGridRow(selectedRowItem: any, index: Number) {
        this.selectedClassesRowIndex = index;
        this.selectedClassesRow = selectedRowItem;
    }

    // Assigned Student List Grid : Store selected row data
    bindClassesStudentListData() {
        this.dataSource1 = new MatTableDataSource(this.teacherClassListEnum.studentList);
        this.teacherClassListEnum.studentAssigned = this.teacherClassListEnum.studentList.length.toString();
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
        this.teacherClassListEnum.studentList.push(this.selectedStudentRow);
        this.bindClassesStudentListData();
        this.selectedStudentRow = null;
        this.studentListModalRef.hide();
    }

    removeSelectedStudent() {
        if (this.selectedClassesStudentRow) {
            if (this.teacherClassListEnum.studentList && this.teacherClassListEnum.studentList.length > 0) {
                const updatedAssignedStudentList = this.teacherClassListEnum.studentList.filter(item => item.ssno !== this.selectedClassesStudentRow.ssno);
                this.teacherClassListEnum.studentList = updatedAssignedStudentList;
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
        const updateStudent = this.teacherClassListEnum.studentList.filter(item => item.ssno === this.selectedClassesStudentRow.ssno);
        if (updateStudent && updateStudent.length > 0) {
            updateStudent[0].grade = this.grade;
            updateStudent[0].gradeNotes = this.gradeNotes;
        }
        this.bindClassesStudentListData();
        this.classesGradeModalRef.hide();
    }

    addTeacherClassesToList() {
        this.showLoader();
        this._teacheClassesService.addToTeacherClassesList(this.teacherClassListEnum).subscribe(result => {
            this.hideLoader();
            if (result) {
                this.getTeacherClassesList();
                this.modalRef.hide();
                this.toastr.success('Saved successfully!', '', {
                    timeOut: 5000,
                    closeButton: true
                });
            }
        });
    }

    updateTeacherClassesToList() {
        this.showLoader();
        this._teacheClassesService.updateTeacherClassesList(this.teacherClassListEnum).subscribe(result => {
            this.hideLoader();
            if (result) {
                this.isEdit = false;
                this.selectedClassesRow = null;
                this.getTeacherClassesList();
                this.modalRef.hide();
                this.toastr.success('Updated successfully!', '', {
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
                    this._teacheClassesService.deleteTeacherClassesList(data).subscribe(result => {
                        this.getTeacherClassesList();
                        this.toastr.success('Deleted successfully!', '', {
                            timeOut: 5000,
                            closeButton: true
                        });
                    });
                } else {
                    this.hideLoader();
                }
            });
        } else {
            this.toastr.info('Please select row to delete', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }
}
