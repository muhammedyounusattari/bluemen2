import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
    {
        path: 'utilities/change-ssno',
        component: ChangeSSNOComponent
    },
    {
        path: 'utilities/nsch',
        component: NHCSComponent
    },
    {
        path: 'utilities/quick-change-wizard',
        component: QuickChangeWizardComponent
    },
    {
        path: 'utilities/semester-gpa-info',
        component: SemesterGPAInfoComponent
    },
    {
        path: 'utilities/student-demographic-info',
        component: StudentDemographicInfoComponent
    },
    {
        path: 'utilities/yearly-financial-aid-info',
        component: YearlyAndFinancialAIDInfoComponent
    },
    {
        path: 'utilities/fiscal-year',
        component: FiscalYearComponent
    },
    {
        path: 'utilities/graduated-list',
        component: GraduatedListComponent
    },
    {
        path: 'utilities/semester',
        component: SemesterComponent
    },
    {
        path: 'utilities/gs-attendance-logs',
        component: GSAttendanceLogsComponent
    },
    {
        path: 'utilities/custom-field-value',
        component: CustomFieldValueComponent
    }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule { }
