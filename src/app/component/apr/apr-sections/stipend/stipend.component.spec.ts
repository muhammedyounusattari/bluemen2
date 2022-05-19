import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StipendComponent } from './stipend.component';

describe('StipendComponent', () => {
  let component: StipendComponent;
  let fixture: ComponentFixture<StipendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StipendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StipendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
