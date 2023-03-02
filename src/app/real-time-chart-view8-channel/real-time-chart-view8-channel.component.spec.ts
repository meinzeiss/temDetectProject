import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeChartView8ChannelComponent } from './real-time-chart-view8-channel.component';

describe('RealTimeChartView8ChannelComponent', () => {
  let component: RealTimeChartView8ChannelComponent;
  let fixture: ComponentFixture<RealTimeChartView8ChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealTimeChartView8ChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeChartView8ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
