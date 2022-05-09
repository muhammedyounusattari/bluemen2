import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDataTableComponent } from './mat-data-table/mat-data-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    MatDataTableComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    CommonModule,
    NzSpinModule,
    NzModalModule,
    NzButtonModule,
    NzAlertModule
  ],
  exports: [
    MatDataTableComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedComponentModule { }
