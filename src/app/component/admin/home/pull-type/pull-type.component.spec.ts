import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullTypeComponent } from './pull-type.component';

describe('PullTypeComponent', () => {
  let component: PullTypeComponent;
  let fixture: ComponentFixture<PullTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
