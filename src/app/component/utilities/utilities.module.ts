import { NgModule } from '@angular/core';
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
    imports: [
        UtilitiesRoutingModule
    ],
    providers: []
  })

  export class UtilitiesModule { }
  