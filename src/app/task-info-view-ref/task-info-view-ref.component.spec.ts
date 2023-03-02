import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfoViewRefComponent } from './task-info-view-ref.component';

describe('TaskInfoViewRefComponent', () => {
  let component: TaskInfoViewRefComponent;
  let fixture: ComponentFixture<TaskInfoViewRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskInfoViewRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInfoViewRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
