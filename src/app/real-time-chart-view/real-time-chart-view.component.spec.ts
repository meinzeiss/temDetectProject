import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeChartViewComponent } from './real-time-chart-view.component';

describe('RealTimeChartViewComponent', () => {
  let component: RealTimeChartViewComponent;
  let fixture: ComponentFixture<RealTimeChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealTimeChartViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
