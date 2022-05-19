import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPerformanceReportSectionTwoEditComponent } from './annual-performance-report-section-two-edit.component';

describe('AnnualPerformanceReportSectionTwoEditComponent', () => {
  let component: AnnualPerformanceReportSectionTwoEditComponent;
  let fixture: ComponentFixture<AnnualPerformanceReportSectionTwoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPerformanceReportSectionTwoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPerformanceReportSectionTwoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
