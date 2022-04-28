import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Router} from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  userName: any = '';
  user : any;
  constructor(private sharedService: SharedService
            , private router: Router
            , private loginService: LoginService) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('username');
    if (data) {
      this.userName = data;
    }
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
    this.loginService.logoutUser().subscribe((result)=>{
      if(result){
        sessionStorage.clear();
        localStorage.clear();
        window.location.reload();
      }
    });

  }
}
