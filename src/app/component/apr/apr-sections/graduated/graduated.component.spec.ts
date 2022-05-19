import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatedComponent } from './graduated.component';

describe('GraduatedComponent', () => {
  let component: GraduatedComponent;
  let fixture: ComponentFixture<GraduatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
