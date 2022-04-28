import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {HomeService} from 'src/app/services/home/home.service';

@Component({
    selector: 'app-logged-users',
    templateUrl: './show-logged-users.html',
    styleUrls: ['./show-logged-users.css']
})
export class ShowLoggedUsersComponent {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
     public selectedRow: any = null;
      public selectedRowData: any = null;
      public usersList: any = null;
       public spinner: boolean = true;
    public dataSource: MatTableDataSource<any>;
    public columnsToDisplay: string[] =
     ['email', 'orgCode', 'issueDate'];

    constructor(private modalService: BsModalService, private homeService: HomeService) {
      this.getLoggedUsers();
    }

     /**
       * @method applyFilter
       */
       public applyFilter(filterValue: any, dataSource: MatTableDataSource<any>) {
        dataSource.filter = filterValue.target.value.trim().toLowerCase();
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
         * @method getLoggedUsers
         */
        public getLoggedUsers() {
          this.spinner = true;
          this.homeService.getLoggedUsers().subscribe((result: any) => {
            if (result ) {
              this.spinner = false;
              this.usersList = result;
              this.selectedRow = null;
              this.dataSource = new MatTableDataSource(result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.getSelectedRow(this.usersList[0], 0);
            }
          });
        }
}
