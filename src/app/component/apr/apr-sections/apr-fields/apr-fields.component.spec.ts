import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprFieldsComponent } from './apr-fields.component';

describe('AprFieldsComponent', () => {
  let component: AprFieldsComponent;
  let fixture: ComponentFixture<AprFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
