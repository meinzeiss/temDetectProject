import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCollectedInfoRefComponent } from './history-collected-info-ref.component';

describe('HistoryConnectedInfoRefComponent', () => {
  let component: HistoryCollectedInfoRefComponent;
  let fixture: ComponentFixture<HistoryCollectedInfoRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCollectedInfoRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCollectedInfoRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
