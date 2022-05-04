import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/services/shared.service';
import { RolesService } from 'src/app/services/admin/roles.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NzTreeFlattener, NzTreeFlatDataSource } from 'ng-zorro-antd/tree-view';
import { FlatTreeControl } from 'ng-zorro-antd/node_modules/@angular/cdk/tree';


interface TreeNode {
  id: number;
  name: string;
  code: number;
  accessType: string | null | undefined;
  orgId: number;
  parentCode: number | null;
  privileges: TreeNode[];
  disabled?: boolean;
}

interface FlatNode {
  id: number,
  name: string,
  code: number,
  accessType: string | null | undefined,
  orgId: number,
  parentCode: number | null,
  expandable: boolean;
  level: number;
  disabled?: boolean;
}

interface Role {
  code: string,
  copyRoleName: string,
  default: boolean,
  id: number,
  name: string,
  orgId: number,
  privileges: TreeNode[]
}

interface UpdateRole {
  code: string,
  copyRoleName: string,
  default: boolean,
  id: number,
  name: string,
  orgId: number,
  privileges?: UpdatePrivilege[]
}

interface UpdatePrivilege {
  id: number,
  name: string,
  code: number,
  accessType: string | null | undefined,
  orgId: number,
  parentCode: number | null,
  roleCode: string
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements AfterViewInit, OnInit {
  roleList: any;
  userRoles: Role[] = [];
  userRolesFromUI: Role[] = [];

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
  roleFormGroup: FormGroup;
  selectedRoleId: any;
  user: any;
  defaultTopPrivilege: TreeNode;

  constructor(private modalService: BsModalService
    , private sharedService: SharedService
    , private rolesService: RolesService
    , private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Roles');
    this.createForm();
    this.loadRoleNames();

    //get 'All' privilege from api a d replace accessType 
    this.defaultTopPrivilege = {
      accessType: 'Y',
      code: 1,
      id: 1,
      name: "**All**",
      orgId: 0,
      parentCode: null,
      privileges: []
    };
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

  createForm() {
    this.roleFormGroup = this.formBuilder.group({
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
        roleId.style.color = 'black';
      }
    });
    const roleId = document.getElementById(id);
    if (roleId) {
      roleId.style.backgroundColor = '#1366a0';
      roleId.style.color = 'white';
    }
    this.userRoles = [];
    this.getPriviledgesByRoleName(roleName);
  }

  ngAfterViewInit(): void {
    // this.toggler = document.getElementsByClassName("caret");
    // if (this.toggler != null) {
    //   for (let i = 0; i < this.toggler.length; i++) {
    //     this.toggler[i].addEventListener("click", function (element: any) {
    //       element.parentElement.querySelector(".nested").classList.toggle("active");
    //       element.classList.toggle("caret-down");
    //     });
    //   }
    // }
    // const innerHeight = window.innerHeight;
    // const domElement = window.document.getElementById('leftBlock');
    // const domElement1 = window.document.getElementById('rightBlock');
    // if (domElement != null) {
    //   domElement.style.height = (innerHeight - 320) + 'px';
    //   domElement.style.overflowY = 'scroll';
    // }
    // if (domElement1 != null) {
    //   domElement1.style.height = (innerHeight - 302) + 'px';
    //   domElement1.style.overflowY = 'scroll';
    // }
  }
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  resetFields() {
    this.createForm();
    this.openModal(this.addNewRolePopupRef);
  }

  addNewRole() {
    if (this.roleFormGroup.valid) {
      const request = this.getRequestPayload();
      this.rolesService.addNewRole(request).subscribe(result => {
        if (result) {
          this.loadRoleNames();
          this.modalRef.hide();
        }
      });
    } else {
      this.roleFormGroup.markAllAsTouched();
    }
  }

  deleteRole() {
    this.rolesService.deleteRole(this.selectedRoleId).subscribe(result => {
      if (result) {
        this.loadRoleNames();
      }
    });
  }

  getPriviledgesByRoleName(roleName: string) {
    this.rolesService.getPriviledgesByRoleName(roleName).subscribe(result => {
      if (result) {
        this.userRoles = result;
        console.log(this.userRoles);
        this.loadTreeData();
      }
    });
  }

  loadTreeData() {
    this.dataSource.setData(this.buildPrivilegeTreeFromDB());
    this.treeControl.expandAll();
  }

  buildPrivilegeTreeFromDB(): TreeNode[] {
    const copyUserRoles: Role[] = JSON.parse(JSON.stringify(this.userRoles));
    let privileges: TreeNode[] = copyUserRoles[0].privileges;
    let topPrivilege = privileges.filter(p => p.name === 'All')[0];
    let otherPrivileges = privileges.filter(p => p.name != 'All');
    if (topPrivilege) {
      topPrivilege.name = this.defaultTopPrivilege.name;//change to **All**
      topPrivilege.privileges = otherPrivileges;
      let privilegeData: TreeNode[] = [];
      privilegeData[0] = topPrivilege;
      return privilegeData;
    }
    return [];
  }


  getUpdateRequestPayload(): UpdateRole {
    let topNode: any = this.treeControl.dataNodes.find(dn => dn.code === 1);
    let updateRole: UpdateRole = {
      code: this.userRoles[0].code,
      copyRoleName: this.userRoles[0].copyRoleName,
      default: this.userRoles[0].default,
      id: this.userRoles[0].id,
      name: this.userRoles[0].name,
      orgId: this.userRoles[0].orgId
    };

    let updatePrivileges: UpdatePrivilege[] = [];

    //Add All privilge from tree control
    updatePrivileges.push({
      id: topNode.id,
      name: 'All',
      code: topNode.code,
      accessType: topNode.accessType,
      orgId: topNode.orgId,
      parentCode: topNode.parentCode,
      roleCode: updateRole.code
    });

    //Add others privilges from tree control
    const descendants = this.treeControl.getDescendants(topNode);
    descendants.forEach(privilege => {
      updatePrivileges.push({
        id: privilege.id,
        name: privilege.name,
        code: privilege.code,
        accessType: privilege.accessType,
        orgId: privilege.orgId,
        parentCode: privilege.parentCode,
        roleCode: updateRole.code
      });
    });

    if (descendants.length > 0) {
      updateRole.privileges = updatePrivileges;
    }

    return updateRole;
  }

  //update role needs flat privilieges inside role
  updateRole() {
    if (this.selectedRoleId) {
      let updateRole: UpdateRole = this.getUpdateRequestPayload();
      this.rolesService.updateRole(updateRole).subscribe(result => {
        if (result) {
          this.loadRoleNames();
        }
      }, (error: any) => {
        console.log(error);
        const errorResponse = JSON.parse(error.error);
      });

    } else {
      //TODO
    }
  }

  getRequestPayload() {
    this.user = sessionStorage.getItem('state');
    this.user = JSON.parse(this.user);
    const orgId = this.user.orgId;
    return {
      'copyRoleName': this.roleFormGroup?.get('copyRoleName')?.value,
      'newRoleName': this.roleFormGroup?.get('newRoleName')?.value,
      'newRoleCode': this.roleFormGroup?.get('newRoleName')?.value,
      'isDefault': this.roleFormGroup?.get('isDefault')?.value,
      'orgId': orgId
    }
  }


  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.privileges && node.privileges.length > 0,
          name: node.name,
          level,
          disabled: !!node.disabled,
          id: node.id,
          code: node.code,
          accessType: node.accessType,
          orgId: node.orgId,
          parentCode: node.parentCode
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };


  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.privileges
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;


  leafItemSelectionToggle(node: FlatNode): void {
  }

  itemSelectionToggle(node: FlatNode): void {
    const descendants = this.treeControl.getDescendants(node);

    descendants.forEach(child => {
      child.accessType = node.accessType;
    });
  }

}