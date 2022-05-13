import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Router} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  userName: any = '';
  user : any;
  fiscalYear = '-';
  semester = '-';
  constructor(private notificationService: NotificationUtilities
            , private router: Router
            , private loginService: LoginService) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('username');
    if (data) {
      this.userName = data;
    }
    this.user = sessionStorage.getItem('state');
    this.user = JSON.parse(this.user);
  }
  logout() {
    this.loginService.logoutUser().subscribe((result)=>{
      if(result){
        sessionStorage.clear();
        localStorage.clear();
        this.notificationService.createNotificationBasic('success', "User Logout", 'User loggged out successfully !');
        this.router.navigate(['/']);
        window.location.reload();
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', "User Logout", 'User loggged out failed!');
    });

  }
}
