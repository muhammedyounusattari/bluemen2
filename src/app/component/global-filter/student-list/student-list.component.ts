import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';

export interface StudentList {
  ssno: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentListComponent implements OnInit {
  @Input() studentsList: any = [];
  public columnsToDisplay: string[] = ['select', 'ssno', 'firstName', 'lastName'];
  public dataSource: MatTableDataSource<any>;
  public selection: any = new SelectionModel<StudentList>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public selectedRow: any;
  public selectedRowData: any;
  public spinner: boolean = true;
  public selectedFilter: string;
  public isStudentTable: boolean = true;
  public selectedSSNos: any = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.selectedFilter = params?.page;
    });
    this.spinner = true;
    this.dataSource = new MatTableDataSource();
  }


  ngOnInit(): void {
    this.getStudentsList(this.studentsList);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @method applyFilter
   * @description Whether the number of selected elements matches the total number of rows
   */
  public isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  /**
   * @method applyFilter
   * @description Selects all rows if they are not all selected; otherwise clear selection
   */
  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /**
   * @method getStudentsList
   */
  public getStudentsList(studentsList: any) {
        this.spinner = false;
        this.selectedRow = null;
        this.studentsList = studentsList;
        this.dataSource = new MatTableDataSource(this.studentsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getSelectedRow(this.studentsList[0], 0);
  }

  /**
   * @method applyFilter
   */
  public applyFilter(filterValue: any, dataSource: MatTableDataSource<any>) {
    dataSource.filter = filterValue?.target?.value?.trim()?.toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.selectedRowData = data;
  }

  /**
   * @method navigateToUpdateRecord
   */
  public navigateToUpdateRecord() {
    if (this.selection?.selected) {
      this.selection?.selected.forEach((element: any) => {
        if (element && element.ssno) {
          this.selectedSSNos.push(element.ssno);
        }
      });
    }
    this.isStudentTable = false;
  }

  /**
   * @method navigateToStudentPage
   */
   public navigateToStudentPage() {
    this.isStudentTable = true;
  }

  /**
   * @method navigateToHome
   */
  public navigateToHome() {
    this.router.navigate(['/']);
  }
}
