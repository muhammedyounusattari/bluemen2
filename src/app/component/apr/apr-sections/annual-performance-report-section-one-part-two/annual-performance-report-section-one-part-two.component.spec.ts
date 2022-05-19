import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPerformanceReportSectionOnePartTwoComponent } from './annual-performance-report-section-one-part-two.component';

describe('AnnualPerformanceReportSectionOnePartTwoComponent', () => {
  let component: AnnualPerformanceReportSectionOnePartTwoComponent;
  let fixture: ComponentFixture<AnnualPerformanceReportSectionOnePartTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPerformanceReportSectionOnePartTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPerformanceReportSectionOnePartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
