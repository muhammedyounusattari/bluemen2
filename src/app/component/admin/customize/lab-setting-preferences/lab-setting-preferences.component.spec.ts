import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSettingPreferencesComponent } from './lab-setting-preferences.component';

describe('LabSettingPreferencesComponent', () => {
  let component: LabSettingPreferencesComponent;
  let fixture: ComponentFixture<LabSettingPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabSettingPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSettingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
