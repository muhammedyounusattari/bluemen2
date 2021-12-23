import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-mat-data-table',
  templateUrl: './mat-data-table.component.html',
  styleUrls: ['./mat-data-table.component.css'],
})
export class MatDataTableComponent implements OnInit {
  columnsToDisplay: string[] = ['rank', 'athleteName', 'gender','tournamentName','location', 'date'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public showLoader: boolean = false;
  public data = [
    {
      rank: 1,
      athleteName: 'Abcd',
      gender: 'Male',
      tournamentName: 'ABCD Worlds',
      location: 'los angeles, california',
      date: new Date().toJSON()
    },
    {
      rank: 2,
      athleteName: 'mmmmm',
      gender: 'Feale',
      tournamentName: 'MMMMM Worlds',
      location: 'los angeles, california',
      date: new Date().toJSON()
    },
    {
      rank: 3,
      athleteName: 'llll',
      gender: 'Female',
      tournamentName: 'LLLLL Worlds',
      location: 'los angeles, california',
      date: new Date().toJSON()
    },
    {
      rank: 1,
      athleteName: 'kkkkk',
      gender: 'Male',
      tournamentName: 'KKKKK Worlds',
      location: 'los angeles, california',
      date: new Date().toJSON()
    },
    {
      rank: 1,
      athleteName: 'ggggg',
      gender: 'Male',
      tournamentName: 'GGGGG Worlds',
      location: 'los angeles, california',
      date: new Date().toJSON()
    }
  ]

  constructor(){
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @method applyFilter
   */
  public applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
