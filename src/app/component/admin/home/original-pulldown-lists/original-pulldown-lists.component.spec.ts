import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalPulldownListsComponent } from './original-pulldown-lists.component';

describe('OriginalPulldownListsComponent', () => {
  let component: OriginalPulldownListsComponent;
  let fixture: ComponentFixture<OriginalPulldownListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginalPulldownListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginalPulldownListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
