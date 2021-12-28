import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StaffMemberComponent } from './home/staff-member/staff-member.component.';
import { StaffRoutingModule } from './staff-routing.module';
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
        ReactiveFormsModule
    ],
    providers: []
  })

  export class StaffModule { }