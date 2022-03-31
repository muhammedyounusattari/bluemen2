import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStandingListMoveBoxComponent } from './grade-standing-list-move-box.component';

describe('GradeStandingListMoveBoxComponent', () => {
  let component: GradeStandingListMoveBoxComponent;
  let fixture: ComponentFixture<GradeStandingListMoveBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeStandingListMoveBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeStandingListMoveBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
