import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSchoolListComponent } from './college-school-list.component';

describe('CollegeSchoolListComponent', () => {
  let component: CollegeSchoolListComponent;
  let fixture: ComponentFixture<CollegeSchoolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeSchoolListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeSchoolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
