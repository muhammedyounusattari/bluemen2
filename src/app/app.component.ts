import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
      const data = localStorage.getItem('accessToken');
      if(data && data !== 'null') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
  }
  validate(event: any) {
    localStorage.setItem('accessToken', 'null');
    event = JSON.parse(event);
    if (event && event.body && event.body.access_token) {
      this.isLoggedIn = true;
      localStorage.setItem('accessToken', event.body.access_token);
    } else {
      this.isLoggedIn = false;
    }
  }
}
