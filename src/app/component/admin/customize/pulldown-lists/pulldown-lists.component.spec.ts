import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulldownListsComponent } from './pulldown-lists.component';

describe('PulldownListsComponent', () => {
  let component: PulldownListsComponent;
  let fixture: ComponentFixture<PulldownListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulldownListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulldownListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
