import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCollectedInfoComponent } from './history-collected-info.component';

describe('HistoryCollectedInfoComponent', () => {
  let component: HistoryCollectedInfoComponent;
  let fixture: ComponentFixture<HistoryCollectedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCollectedInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCollectedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
