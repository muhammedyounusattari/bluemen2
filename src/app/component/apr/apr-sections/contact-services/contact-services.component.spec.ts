import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactServicesComponent } from './contact-services.component';

describe('ContactServicesComponent', () => {
  let component: ContactServicesComponent;
  let fixture: ComponentFixture<ContactServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
