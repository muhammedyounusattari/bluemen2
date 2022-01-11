import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-assign-student-to-teacher-classes',
    templateUrl: './assign-student-teacher-classes.component.html',
    styleUrls: ['./assign-student-teacher-classes.component.css']
})

export class AssignStudentsToTeacherClassesComponent implements OnInit {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isShow: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    };

    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;

    columnsToDisplay: string[] = ['firstName', 'lastName', 'phone', 'currentYear', 'semester', 'teacherName', 'subject', 'classGrade'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private toastr: ToastrService) { }

    ngOnInit(): void {

    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    resetFields() {

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

    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    showSecondPopup() {}
}