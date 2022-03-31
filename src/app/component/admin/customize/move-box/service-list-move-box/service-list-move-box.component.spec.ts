import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListMoveBoxComponent } from './service-list-move-box.component';

describe('ServiceListMoveBoxComponent', () => {
  let component: ServiceListMoveBoxComponent;
  let fixture: ComponentFixture<ServiceListMoveBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceListMoveBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListMoveBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
