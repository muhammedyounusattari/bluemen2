import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStandingGroupListMoveBoxComponent } from './grade-standing-group-list-move-box.component';

describe('GradeStandingGroupListMoveBoxComponent', () => {
  let component: GradeStandingGroupListMoveBoxComponent;
  let fixture: ComponentFixture<GradeStandingGroupListMoveBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeStandingGroupListMoveBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeStandingGroupListMoveBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
