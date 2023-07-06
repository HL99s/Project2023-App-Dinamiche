import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RentalsHistoryComponent} from './rentalsHistory.component';

describe('HistoprovaComponent', () => {
  let component: RentalsHistoryComponent;
  let fixture: ComponentFixture<RentalsHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentalsHistoryComponent]
    });
    fixture = TestBed.createComponent(RentalsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
