import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SharedService } from 'src/app/shared/services/shared.service';
import { RolesService } from 'src/app/services/admin/roles.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements AfterViewInit, OnInit {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }
  roleList: any;
  userRoles: any = [];
  toggler: any;
  favoriteFruit: string;
  isExpandChildren = false;
  isExpandChild = false;
  roleNameList: any;
  constructor(private modalService: BsModalService
    , private sharedService: SharedService
    , private rolesService: RolesService) {
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Roles');
    this.roleNameList = [];
    this.rolesService.getRolesList().subscribe(result => {
      if (result) {
        this.roleList = result;
        this.roleList.forEach((element: any) => {
          const data = {
            id: element.id,
            name: element.name,
            default: element.default
          };
          this.roleNameList.push(data);
        });
        this.userRoles.push(this.roleList[0]);
        setTimeout(() => {
          this.setBgColorForSelectedRole(this.roleNameList[0].id);
        }, 1000);
      }
    });
  }

  setBgColorForSelectedRole(id: any) {
    this.roleNameList.forEach((element: any) => {
      const roleId = document.getElementById(element.id);
      if (roleId) {
        roleId.style.backgroundColor = 'white';
      }
    });
    const roleId = document.getElementById(id);
    if (roleId) {
      roleId.style.backgroundColor = '#00396b';
    }
    this.userRoles = [];
    const activeRole = this.roleList.filter((item: any) => item.id === id);
    this.userRoles.push(activeRole[0]);
  }

  ngAfterViewInit(): void {
    this.toggler = document.getElementsByClassName("caret");
    if (this.toggler != null) {
      for (let i = 0; i < this.toggler.length; i++) {
        this.toggler[i].addEventListener("click", function (element: any) {
          element.parentElement.querySelector(".nested").classList.toggle("active");
          element.classList.toggle("caret-down");
        });
      }
    }
    const innerHeight = window.innerHeight;
    const domElement = window.document.getElementById('leftBlock');
    const domElement1 = window.document.getElementById('rightBlock');
    if (domElement != null) {
      domElement.style.height = (innerHeight - 244) + 'px';
      domElement.style.overflowY = 'scroll';
    }
    if (domElement1 != null) {
      domElement1.style.height = (innerHeight - 244) + 'px';
      domElement1.style.overflowY = 'scroll';
    }
  }
  setValue() {
    this.isExpandChildren = !this.isExpandChildren;
  }
  setChildValue() {
    this.isExpandChild = !this.isExpandChild;
  }
}