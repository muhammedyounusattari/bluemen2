import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyInformationComponent } from './yearly-information.component';

describe('YearlyInformationComponent', () => {
  let component: YearlyInformationComponent;
  let fixture: ComponentFixture<YearlyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
