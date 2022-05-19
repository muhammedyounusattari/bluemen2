import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HeaderComponent } from './component/header/header-component';
import { NavigationComponent } from './component/navigation/navigation-component';
import { FooterComponent } from './component/footer/footer-component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';

import { AdminModule } from './component/admin/admin-module';
import { StudentModule } from './component/student/student.module';
import { UtilitiesModule } from './component/utilities/utilities.module';
import { StaffModule } from './component/staff/staff.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CounselorModule } from './component/counselor/counselor.module';
import { LoginComponent } from './component/login/login.component';
import { HomeModule} from './component/myhome/home-module';
import { HomeComponent } from 'src/app/component/myhome/home/home.component';
import { ConfirmationComponent } from 'src/app/shared/components/canDeactivate/confrimation.component';
import { PendingChangesGuard } from 'src/app/shared/components/canDeactivate/can-deactivate.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogBoxComponent } from './shared/components/dialog-box/dialog-box.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { AprModule } from './component/apr/apr-sections/apr.module';
import { CookieService } from 'ngx-cookie-service';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    ConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    StudentModule,
    UtilitiesModule,
    StaffModule,
    HomeModule,
    MDBBootstrapModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    CounselorModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatRadioModule, 
    MatSelectModule,
    NgDynamicBreadcrumbModule,
    HttpClientModule,
    DemoNgZorroAntdModule,
    AprModule
  ],
  entryComponents: [ConfirmationComponent],
  providers: [CookieService, ToastrService, PendingChangesGuard, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
