import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubExamsComponent } from './sub-exams.component';

describe('SubExamsComponent', () => {
  let component: SubExamsComponent;
  let fixture: ComponentFixture<SubExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubExamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
