import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsLogComponent } from './exams-log.component';

describe('ExamsLogComponent', () => {
  let component: ExamsLogComponent;
  let fixture: ComponentFixture<ExamsLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamsLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
