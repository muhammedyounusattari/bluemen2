import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CounselorRoutingModule } from './counselor-routing.module';
import { CounselorsComponent } from './home/counselors/counselors.component';

@NgModule({
    declarations: [
      CounselorsComponent
    ],
    imports: [
      CounselorRoutingModule,
      HttpClientModule,
      BrowserModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
    providers: []
  })

  export class CounselorModule { }
