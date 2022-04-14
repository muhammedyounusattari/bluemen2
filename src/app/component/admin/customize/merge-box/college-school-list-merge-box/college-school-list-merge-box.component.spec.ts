import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSchoolListMergeBoxComponent } from './college-school-list-merge-box.component';

describe('CollegeSchoolListMergeBoxComponent', () => {
  let component: CollegeSchoolListMergeBoxComponent;
  let fixture: ComponentFixture<CollegeSchoolListMergeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeSchoolListMergeBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeSchoolListMergeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
