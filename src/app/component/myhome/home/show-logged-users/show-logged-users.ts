import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-logged-users',
  templateUrl: './show-logged-users.html',
  styleUrls: ['./show-logged-users.css']
})
export class ShowLoggedUsersComponent {
  public usersList: any = null;
  public usersSearchList: any = null;
  public isLoading: boolean = false;


  constructor(private homeService: HomeService) {
    this.getLoggedUsers();
  }
  

  showLoader() {
    this.isLoading = true;;
  }

  hideLoader() {
   this.isLoading = false;
  }

  /**
     * @method getLoggedUsers
     */
  public getLoggedUsers() {
    this.showLoader();
    this.homeService.getLoggedUsers().subscribe((result: any) => {
      if (result) {
        this.hideLoader();
        this.usersList = result;
        this.usersSearchList = result;
      }
    });
  }

  sorting(attr: string) {
    if (this.usersList.length > 0) {
      this.usersList = [...this.usersList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
    }
  }

  sorting2(attr: string) {
    if (this.usersList.length > 0) {
      this.usersList = [...this.usersList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
    }
  }

  applyFilter(event: any) {
    const targetValue: any[] = [];
    this.usersSearchList.forEach((value: any) => {
        //let keys = Object.keys(value);
        let keys = ["email", "orgCode"];
        for (let i = 0; i < keys.length; i++) {
            if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(event.target.value.trim().toLowerCase())) {
                targetValue.push(value);
                break;
            }
        }
    });
    this.usersList = targetValue;

  }
}
