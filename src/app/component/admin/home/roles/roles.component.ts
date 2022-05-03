import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SharedService } from 'src/app/shared/services/shared.service';
import { RolesService } from 'src/app/services/admin/roles.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements AfterViewInit, OnInit {
  roleList: any;
  userRoles: any = [];
  toggler: any;
  favoriteFruit: string;
  isExpandChildren = false;
  isExpandChild = false;
  roleNameList: any;

  @ViewChild('addNewRolePopup') addNewRolePopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  }
  formGroup: FormGroup;
  selectedRoleId: any;
  user: any;

  constructor(private modalService: BsModalService
    , private sharedService: SharedService
    , private rolesService: RolesService
    , private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Roles');
    this.createForm();
    this.loadRoleNames();
  }

  loadRoleNames() {
    this.roleNameList = [];
    this.rolesService.getRoleNamesList().subscribe(result => {
      if (result) {
        this.roleNameList = result;
        setTimeout(() => {
          this.setBgColorForSelectedRole(this.roleNameList[0].id, this.roleNameList[0].name);
        }, 1000);
      }
    });

  }

  getPriviledgesByRoleName(roleName: string) {
    this.rolesService.getPriviledgesByRoleName(roleName).subscribe(result => {
      if (result) {
        this.userRoles = result;
      }
    });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'id': [''],
      'newRoleName': ['', Validators.required],
      'roleCode': [''],
      'copyRoleName': ['', Validators.required],
      'isDefault': ['']
    });
  }

  setBgColorForSelectedRole(id: any, roleName: string) {
    this.selectedRoleId = id;
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
    this.getPriviledgesByRoleName(roleName);
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  resetFields() {
    this.createForm();
    this.openModal(this.addNewRolePopupRef);
  }

  addNewRole() {
    if (this.formGroup.valid) {
      const request = this.getRequestPayload();
      this.rolesService.addNewRole(request).subscribe(result => {
        if (result) {
          this.loadRoleNames();
          this.modalRef.hide();
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  deleteRole() {
    this.rolesService.deleteRole(this.selectedRoleId).subscribe(result => {
      if(result) {
        this.loadRoleNames();
      }
    });
  }

  updateRole() {
    if(this.selectedRoleId) {
      // const request = 
    }
  }

  getRequestPayload() {
    this.user = sessionStorage.getItem('state');
    this.user = JSON.parse(this.user);
    const orgId = this.user.orgId;
    return {
      'copyRoleName' : this.formGroup ?.get('copyRoleName') ?.value,
      'newRoleName' : this.formGroup ?.get('newRoleName') ?.value,
      'newRoleCode' : this.formGroup ?.get('newRoleName') ?.value,
      'isDefault' : this.formGroup ?.get('isDefault') ?.value,
      'orgId' : orgId
    }
  }
}