import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDataTableComponent } from './mat-data-table/mat-data-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    MatDataTableComponent
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule
  ],
  exports: [
    MatDataTableComponent
  ]
})
export class SharedComponentModule { }
