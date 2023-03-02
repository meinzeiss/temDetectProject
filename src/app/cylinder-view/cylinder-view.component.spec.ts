import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderViewComponent } from './cylinder-view.component';

describe('CylinderViewComponent', () => {
  let component: CylinderViewComponent;
  let fixture: ComponentFixture<CylinderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CylinderViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CylinderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
