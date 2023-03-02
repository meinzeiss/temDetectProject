import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMaintainComponent } from './device-maintain.component';

describe('DeviceMaintainComponent', () => {
  let component: DeviceMaintainComponent;
  let fixture: ComponentFixture<DeviceMaintainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceMaintainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
