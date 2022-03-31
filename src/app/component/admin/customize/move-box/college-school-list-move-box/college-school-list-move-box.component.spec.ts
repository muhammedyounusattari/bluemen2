import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSchoolListMoveBoxComponent } from './college-school-list-move-box.component';

describe('CollegeSchoolListMoveBoxComponent', () => {
  let component: CollegeSchoolListMoveBoxComponent;
  let fixture: ComponentFixture<CollegeSchoolListMoveBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeSchoolListMoveBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeSchoolListMoveBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
