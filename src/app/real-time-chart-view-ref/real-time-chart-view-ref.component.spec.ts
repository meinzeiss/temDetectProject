import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeChartViewRefComponent } from './real-time-chart-view-ref.component';

describe('RealTimeChartViewRefComponent', () => {
  let component: RealTimeChartViewRefComponent;
  let fixture: ComponentFixture<RealTimeChartViewRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealTimeChartViewRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeChartViewRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
