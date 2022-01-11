import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HeaderComponent } from './component/header/header-component';
import { NavigationComponent } from './component/navigation/navigation-component';
import { FooterComponent } from './component/footer/footer-component';

import { AdminModule } from './component/admin/admin-module';
import { StudentModule } from './component/student/student.module';
import { UtilitiesModule } from './component/utilities/utilities.module';
import { StaffModule } from './component/staff/staff.module.';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CounselorModule } from './component/counselor/counselor.module';
import { LoginComponent } from './component/login/login.component';

import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    StudentModule,
    UtilitiesModule,
    StaffModule,
    MDBBootstrapModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    CounselorModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [ToastrService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
