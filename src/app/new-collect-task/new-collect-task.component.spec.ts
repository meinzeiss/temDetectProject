import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectTaskComponent } from './new-collect-task.component';

describe('NewCollectTaskComponent', () => {
  let component: NewCollectTaskComponent;
  let fixture: ComponentFixture<NewCollectTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCollectTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCollectTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
