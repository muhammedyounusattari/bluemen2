import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  userName: any = '';
  ngOnInit(): void {
      const data = sessionStorage.getItem('username');
      if (data) {
        this.userName = data;
      }
  }
  logout() {
    localStorage.setItem('accessToken', 'null');
    localStorage.setItem('userName', 'null');
    window.location.reload();
  }
}
