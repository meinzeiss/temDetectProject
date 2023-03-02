import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRunningVDualComponent } from './task-running-vdual.component';

describe('TaskRunningVDualComponent', () => {
  let component: TaskRunningVDualComponent;
  let fixture: ComponentFixture<TaskRunningVDualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRunningVDualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRunningVDualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
