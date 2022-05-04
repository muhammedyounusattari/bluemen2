import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStandingComponent } from './grade-standing.component';

describe('GradeStandingComponent', () => {
  let component: GradeStandingComponent;
  let fixture: ComponentFixture<GradeStandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeStandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeStandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
