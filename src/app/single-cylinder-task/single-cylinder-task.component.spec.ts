import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCylinderTaskComponent } from './single-cylinder-task.component';

describe('SingleCylinderTaskComponent', () => {
  let component: SingleCylinderTaskComponent;
  let fixture: ComponentFixture<SingleCylinderTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCylinderTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCylinderTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
