import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRunningVSingleComponent } from './task-running-vsingle.component';

describe('TaskRunningVSingleComponent', () => {
  let component: TaskRunningVSingleComponent;
  let fixture: ComponentFixture<TaskRunningVSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRunningVSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRunningVSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
