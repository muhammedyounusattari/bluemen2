import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SharedService } from 'src/app/shared/services/shared.service';

interface FoodNode {
  name: string;
  id: number;
  radActionVal: string;
  rad1Name:  string;
  rad2Name:  string;
  rad3Name:  string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'All',
    id: 1,
    radActionVal: 'Y',
    rad1Name: 'Y',
    rad2Name: 'R',
    rad3Name: 'N',
    children: [
      {
        name: 'Allow Easy Add To Pulldown List',
        id: 2,
        radActionVal: 'Y',
        rad1Name: 'Y',
        rad2Name: 'R',
        rad3Name: 'N',
      },
      {
        name: 'Add New Student',
        id: 2,
        radActionVal: 'N',
        rad1Name: 'Y',
        rad2Name: 'R',
        rad3Name: 'N'
      },
      {
        name: 'Orange',
        id: 8,
        radActionVal: 'Y',
        rad1Name: 'Y',
        rad2Name: 'R',
        rad3Name: 'N',
        children: [
          {
            name: 'Pumpkins', id: 9,
            radActionVal: 'Y',
            rad1Name: 'Y',
            rad2Name: 'R',
            rad3Name: 'N',
          },
          {
            name: 'Carrots', id: 10,
            radActionVal: 'Y',
            rad1Name: 'Y',
            rad2Name: 'R',
            rad3Name: 'N',
          },
        ]
      },
    ]
  },
];

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
  roleList = [
  {
      name: 'All',
      id: 1,
      radActionVal: 'Y',
      rad1Name: 'Y',
      rad2Name: 'R',
      rad3Name: 'N',
      children: [
        {
          name: 'Allow Easy Add To Pulldown List',
          id: 1,
          radActionVal: 'Y',
          rad1Name: 'Y',
          rad2Name: 'R',
          rad3Name: 'N',
        },
        {
          name: 'Add New Student',
          id: 2,
          radActionVal: 'N',
          rad1Name: 'Y',
          rad2Name: 'R',
          rad3Name: 'N'
        },
        {
          name: 'Orange',
          id: 3,
          radActionVal: 'Y',
          rad1Name: 'Y',
          rad2Name: 'R',
          rad3Name: 'N',
          children: [
            {
              name: 'Pumpkins',
              id: 1,
              radActionVal: 'Y',
              rad1Name: 'Y',
              rad2Name: 'R',
              rad3Name: 'N'
            },
            {
              name: 'Carrots',
              id: 2,
              radActionVal: 'Y',
              rad1Name: 'Y',
              rad2Name: 'R',
              rad3Name: 'N',
            }
          ]
        }
      ]
    }
  ];
  toggler: any;
  favoriteFruit: string;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  isExpandChildren = false;
  isExpandChild = false;
  constructor(private modalService: BsModalService
    , private sharedService: SharedService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Roles');
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngAfterViewInit(): void {
    this.toggler = document.getElementsByClassName("caret");
    if (this.toggler != null) {
      for (let i = 0; i < this.toggler.length; i++) {
        this.toggler[i].addEventListener("click", function(element: any) {
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
