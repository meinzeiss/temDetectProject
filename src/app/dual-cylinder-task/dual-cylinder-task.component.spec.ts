import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualCylinderTaskComponent } from './dual-cylinder-task.component';

describe('DualCylinderTaskComponent', () => {
  let component: DualCylinderTaskComponent;
  let fixture: ComponentFixture<DualCylinderTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualCylinderTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualCylinderTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
