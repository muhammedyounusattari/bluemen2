import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { AssignStudentsToTutorClassesComponent } from '../tutor/home/assign-student-tutor-classes/assign-student-tutor-classes.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedComponentModule } from '../../shared/components/shared-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {ShowLoggedUsersComponent} from '../myhome/home/show-logged-users/show-logged-users';
import {ChangePasswordComponent} from '../myhome/home/change-my-password/change-password';
import { TimeClockComponent } from './home/time-clock/time-clock.component';

@NgModule({
  declarations: [
    ShowLoggedUsersComponent,
    ChangePasswordComponent,
    TimeClockComponent
  ],
  imports: [
    HomeRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
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
    MatSelectModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class HomeModule { }
