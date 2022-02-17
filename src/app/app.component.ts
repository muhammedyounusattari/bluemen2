import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Blumen';
  avtarDdl: boolean = false;
  isLoggedIn: boolean = false;
  showDdl() {
    this.avtarDdl = !this.avtarDdl;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
      const data = sessionStorage.getItem('accessToken');
      if(data && data !== 'null') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
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
