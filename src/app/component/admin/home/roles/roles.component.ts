import { Component,  OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { RolesService } from 'src/app/services/admin/roles.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NzTreeFlattener, NzTreeFlatDataSource } from 'ng-zorro-antd/tree-view';
import { FlatTreeControl } from 'ng-zorro-antd/node_modules/@angular/cdk/tree';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { Router } from '@angular/router';


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
export class RolesComponent implements  OnInit {
  roleList: any;
  userRoles: Role[] = [];
  userRolesFromUI: Role[] = [];

  toggler: any;
  favoriteFruit: string;
  isExpandChildren = false;
  isExpandChild = false;
  roleNameList: any;

  roleFormGroup: FormGroup;
  selectedRoleId: any;
  user: any;
  defaultTopPrivilege: TreeNode;

  isAddRoleModalVisible =  false;
  isConfirmRolesLoading = true;

  renameRoleFormGroup: FormGroup;
  isRenameRoleModalVisible = false;

  constructor(private sharedService: SharedService
    , private rolesService: RolesService
    , private formBuilder: FormBuilder
    , private notificationService: NotificationUtilities
    , private router: Router) {
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
    this.isConfirmRolesLoading = true;
    this.rolesService.getRoleNamesList().subscribe(result => {
      this.isConfirmRolesLoading = false;
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
      'isDefault': [false]
    });
  }

  renameForm() {
    this.renameRoleFormGroup = this.formBuilder.group({
      'id': this.selectedRoleId,
      'newRoleName': ['', Validators.required]
    });
  }

  cancel() {
    this.router.navigate(['admin/home']);
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
    this.getPriviledgesByRoleName(id, roleName);
  }

  showAddForm() {
    this.createForm();
    this.isAddRoleModalVisible = true;
  }

  showRenameForm() {
    this.renameForm();
    this.isRenameRoleModalVisible = true;
  }


  addNewRole() {
    if (this.roleFormGroup.valid) {
      const request = this.getRequestPayload();
      this.rolesService.addNewRole(request).subscribe(result => {
        if (result) {
          this.notificationService.createNotificationBasic('success', 'Add Role', 'Added new role successfully');
          this.loadRoleNames();
          this.isAddRoleModalVisible = false;
        }
      }, (error: any) => {
        this.notificationService.createNotificationBasic('error', 'Add Role', 'Adding new role failed');
        console.log(error);
        this.isAddRoleModalVisible = false;
      });
    } else {
      this.roleFormGroup.markAllAsTouched();
    }
  }

  deleteRole() {
    this.rolesService.deleteRole(this.selectedRoleId).subscribe(result => {
      if (result) {
        this.notificationService.createNotificationBasic('success', 'Delete Role', 'Role deleted successfully');
        this.loadRoleNames();
      }
    }, (error: any) => {
      this.notificationService.createNotificationBasic('error', 'Delete Role', 'Deleting of role failed');
      console.log(error);
    });
  }

  getPriviledgesByRoleName(roleId: any, roleName: string) {
    this.rolesService.getPriviledgesByRoleName(roleName).subscribe(result => {
      if (result) {
        const allUserRoles: Role[] = JSON.parse(JSON.stringify(result));
        this.userRoles = allUserRoles.filter(r => r.id === roleId);
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

  renameRole() {
    if (this.selectedRoleId) {      
      let updateRole: UpdateRole = this.getUpdateRequestPayload();
      updateRole.name = this.renameRoleFormGroup?.get('newRoleName')?.value;
      this.rolesService.updateRole(updateRole).subscribe(result => {
        if (result) {
          this.notificationService.createNotificationBasic('success', 'Rename Role', 'Role Name Successfully');
          this.loadRoleNames();
        }
      }, (error: any) => {
        console.log(error);
        this.notificationService.createNotificationBasic('error', 'Rename Role', 'Role Name Failed');      });

    } else {
      //TODO
    }
  }
  //update role needs flat privilieges inside role
  updateRole() {
    if (this.selectedRoleId) {      
      let updateRole: UpdateRole = this.getUpdateRequestPayload();
      this.rolesService.updateRole(updateRole).subscribe(result => {
        if (result) {
          this.notificationService.createNotificationBasic('success', 'Update Role', 'Role & Privileges updated successfully');
          this.loadRoleNames();
        }
      }, (error: any) => {
        console.log(error);
        this.notificationService.createNotificationBasic('error', 'Update Role', 'Role update failed');      });

    } else {
      //TODO
    }
  }

  saveAndClose() {
    this.updateRole();
    this.cancel();
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

  handleCancel(): void {
    //this.clearPullFormValue();
    this.isAddRoleModalVisible = false;
    this.isRenameRoleModalVisible = false;
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