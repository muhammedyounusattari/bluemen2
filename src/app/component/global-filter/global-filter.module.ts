import { NgModule } from '@angular/core';
import { AprFilterComponent } from './apr/apr-filter-infocomponent';
import { AttendanceFilterComponent } from './attendance/attendance-filter-info.component';
import { ContactFilterComponent } from './contact/contact-filter-info.component';
import { CourcesFilterComponent } from './cources/cources-filter-info.component';
import { CustomfieldsFilterComponent } from './customfields/Customfields-filter-info.component';
import { CustomlistFilterComponent } from './customlist/customlist-filter-info.component';
import { ExamFilterComponent } from './exam/exam-filter-info.component';
import { GlobalFilterComponent } from './global-filter.component';
import { GraduatedFilterComponent } from './graduated/graduated-filter-info.component';
import { MarkFilterComponent } from './mark/mark-filter-info.component';
import { NotesFilterComponent } from './notes/notes-filter-info.component';
import { ScheduleClassesFilterComponent } from './scheduleclasses/scheduleclasses-filter-info';
import { SemesterFilterComponent } from './semester/semester-filter-info.component';
import { ServicesFilterComponent } from './services/services-filter-info.component';
import { StaffFilterComponent } from './staff/staff-filter-info.component';
import { StipendFilterComponent } from './stipend/stipend-filter-info.component';
import { StudentFilterComponent } from './student/student-filter-info.component';
import { SubFilterComponent } from './sub/sub-filter-info.component';
import { TextMessageFilterComponent } from './textmessage/textmessage-filter-info.component';
import { WalletFilterComponent } from './wallet/wallet-filter-info.component';
import { YearlyFilterComponent } from './yearly/yearly-filter-info.component';

@NgModule({
    exports: [GlobalFilterComponent],
    declarations: [
        GlobalFilterComponent,
        AprFilterComponent,
        AttendanceFilterComponent,
        ContactFilterComponent,
        CourcesFilterComponent,
        CustomfieldsFilterComponent,
        CustomlistFilterComponent,
        ExamFilterComponent,
        GraduatedFilterComponent,
        MarkFilterComponent,
        NotesFilterComponent,
        ScheduleClassesFilterComponent,
        SemesterFilterComponent,
        ServicesFilterComponent,
        StaffFilterComponent,
        StipendFilterComponent,
        StudentFilterComponent,
        SubFilterComponent,
        TextMessageFilterComponent,
        WalletFilterComponent,
        YearlyFilterComponent
    ],
    imports: [
    ],
    providers: [],
    bootstrap: []
})

export class GlobalFilterModule { }
