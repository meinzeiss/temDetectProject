import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCollectedInfo8ChannelComponent } from './history-collected-info8-channel.component';

describe('HistoryCollectedInfo8ChannelComponent', () => {
  let component: HistoryCollectedInfo8ChannelComponent;
  let fixture: ComponentFixture<HistoryCollectedInfo8ChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCollectedInfo8ChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCollectedInfo8ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
