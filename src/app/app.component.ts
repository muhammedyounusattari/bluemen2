import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'Blumen';
  avtarDdl: boolean = false;
  isLoggedIn: boolean = false;
  params: Params;
  isResetPassword = false;
  resetHashCode: any = null;
  errorMessage = '';
  successMessage = '';
  infoMessage = '';
  pageTitle = '';
  subscription: Subscription;

  showDdl() {
    this.avtarDdl = !this.avtarDdl;
  }

  constructor(private router: Router
    , private route: ActivatedRoute
    , private sharedService: SharedService
    , private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.resetHashCode = null;
    this.isResetPassword = false;
    this.subscription = this.sharedService.getErrorMessage().subscribe(message => {
      this.errorMessage = message.text;
    });
    this.subscription = this.sharedService.getSuccessMessage().subscribe(message => {
      this.successMessage = message.text;
    });
    this.subscription = this.sharedService.getInfoMessage().subscribe(message => {
      this.infoMessage = message.text;
    });
    this.subscription = this.sharedService.getPageTitle().subscribe(message => {
      this.pageTitle = message.text;
    });
    if (window.location.pathname === '/reset-password' || window.location.pathname === '/reset-password/') {
      this.isLoggedIn = false;
      this.resetHashCode = window.location.hash;
      this.isResetPassword = true;
    } else {
      const data = sessionStorage.getItem('accessToken');
      if (data && data !== 'null') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  validate(event: any) {
    sessionStorage.setItem('accessToken', 'null');
    if (event && event.access_token) {
      this.isLoggedIn = true;
      this.router.navigate(['']);
      sessionStorage.setItem('accessToken', event.access_token);
    } else {
      this.isLoggedIn = false;
    }
  }
}
