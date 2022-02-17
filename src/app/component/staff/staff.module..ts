import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StaffMemberComponent } from './home/staff-member/staff-member.component.';
import { StaffRoutingModule } from './staff-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        StaffMemberComponent
    ],
    imports: [
        StaffRoutingModule,
        HttpClientModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatCheckboxModule,
        MatCardModule,
        MatIconModule
        ],
          providers: [
            MatDatepickerModule,
            MatNativeDateModule
          ]

  })

  export class StaffModule { }
