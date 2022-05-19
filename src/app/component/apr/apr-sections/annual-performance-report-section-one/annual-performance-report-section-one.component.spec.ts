import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPerformanceReportSectionOneComponent } from './annual-performance-report-section-one.component';

describe('AnnualPerformanceReportSectionOneComponent', () => {
  let component: AnnualPerformanceReportSectionOneComponent;
  let fixture: ComponentFixture<AnnualPerformanceReportSectionOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPerformanceReportSectionOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPerformanceReportSectionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
