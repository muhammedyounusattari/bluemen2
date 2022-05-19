import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPerformanceReportSectionTwoComponent } from './annual-performance-report-section-two.component';

describe('AnnualPerformanceReportSectionTwoComponent', () => {
  let component: AnnualPerformanceReportSectionTwoComponent;
  let fixture: ComponentFixture<AnnualPerformanceReportSectionTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPerformanceReportSectionTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPerformanceReportSectionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
