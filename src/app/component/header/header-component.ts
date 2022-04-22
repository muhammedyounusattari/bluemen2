import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  userName: any = '';
  
  constructor(private sharedService: SharedService
    , private router: Router) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('username');
    if (data) {
      this.userName = data;
    }
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    if (this.sharedService.getUserRole() === 'SuperAdmin') {
      this.router.navigate(['']);
    } else if (this.sharedService.getUserRole() === 'OrgUser') {
      this.router.navigate(['user-login']);
    } else {
      this.router.navigate(['']);
    }
    window.location.reload();
  }
}
