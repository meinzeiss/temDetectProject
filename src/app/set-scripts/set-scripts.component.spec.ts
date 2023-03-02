import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetScriptsComponent } from './set-scripts.component';

describe('SetScriptsComponent', () => {
  let component: SetScriptsComponent;
  let fixture: ComponentFixture<SetScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
