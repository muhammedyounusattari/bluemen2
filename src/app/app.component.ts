import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Blumen';
  avtarDdl: boolean = false;
  isLoggedIn: boolean = false;
  params: Params;
  isResetPassword = false;
  resetHashCode: any = null;

  showDdl() {
    this.avtarDdl = !this.avtarDdl;
  }

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.resetHashCode = null;
    this.isResetPassword = false;
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
