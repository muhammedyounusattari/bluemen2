import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounselorsComponent } from './home/counselors/counselors.component';

const routes: Routes = [
    {
        path: 'counselor/counselors',
        component: CounselorsComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CounselorRoutingModule { }
