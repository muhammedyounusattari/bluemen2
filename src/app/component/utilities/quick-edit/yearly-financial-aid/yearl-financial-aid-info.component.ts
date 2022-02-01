import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { YearlyAndFinancialAIDColumns } from './yearly-financial-column';

@Component({
  selector: 'app-yearly-financial-aid-info',
  templateUrl: './yearl-financial-aid-info.component.html',
  styleUrls: ['./yearl-financial-aid-info.component.css'],
})
export class YearlyAndFinancialAIDInfoComponent implements OnInit {
  @Output() navigateToStudentPage: EventEmitter<any> = new EventEmitter();
  @Input() studentsList: any;
  public columnsToDisplay: string[] = YearlyAndFinancialAIDColumns;
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public yearlyAndFinancialForm: FormGroup;
  public selectedStudent: any;
  public spinner: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.yearlyAndFinancialForm = this.fb.group({
      row: this.fb.array([this.createArray()])
    });
    this.dataSource = new MatTableDataSource(this.studentsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @method createArray
   */
  public createArray() {
    return this.fb.group({
      name: '',
      description: '',
      price: ''
    });
  }

  get yearlyAndFinancialRow() : FormArray {
    return this.yearlyAndFinancialForm.get('row') as FormArray
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
