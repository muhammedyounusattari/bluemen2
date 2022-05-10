import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgadminPulldownListsComponent } from './orgadmin-pulldown-lists.component';

describe('OrgadminPulldownListsComponent', () => {
  let component: OrgadminPulldownListsComponent;
  let fixture: ComponentFixture<OrgadminPulldownListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgadminPulldownListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgadminPulldownListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
