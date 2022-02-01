import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { FiscalYearComponent } from './add-to/fiscal-year/fiscal-year.component';
import { GraduatedListComponent } from './add-to/graduated-list/graduated-list.component';
import { SemesterComponent } from './add-to/semester/semester.component';
import { GSAttendanceLogsComponent } from './generate-simillar/attendance-logs/gs-attendance-logs.component';
import { CustomFieldValueComponent } from './generate-simillar/custom-field-value/custom-field-value.component';
import { ChangeSSNOComponent } from './home/change-ssno/change-ssno.component';
import { NHCSComponent } from './home/nhcs/national-sudent-clearinghouse-di.component';
import { QuickChangeWizardComponent } from './home/quick-change-wizard/quick-change-wizard.component';
import { SemesterGPAInfoComponent } from './quick-edit/semester-gpa-info/semester-gpa-info.component';
import { StudentDemographicInfoComponent } from './quick-edit/student-demographic/student-demographi-info.component';
import { YearlyAndFinancialAIDInfoComponent } from './quick-edit/yearly-financial-aid/yearl-financial-aid-info.component';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        ChangeSSNOComponent,
        NHCSComponent,
        QuickChangeWizardComponent,
        SemesterGPAInfoComponent,
        StudentDemographicInfoComponent,
        YearlyAndFinancialAIDInfoComponent,
        FiscalYearComponent,
        GraduatedListComponent,
        SemesterComponent,
        GSAttendanceLogsComponent,
        CustomFieldValueComponent
    ],
    exports: [
      FiscalYearComponent,
      GraduatedListComponent,
      YearlyAndFinancialAIDInfoComponent
    ],
    imports: [
        UtilitiesRoutingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatTabsModule
    ],
    providers: []
  })

  export class UtilitiesModule { }
