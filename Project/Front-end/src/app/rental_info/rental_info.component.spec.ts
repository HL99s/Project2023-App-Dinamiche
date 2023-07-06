import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Rental_infoComponent} from './rental_info.component';

describe('InfoRentalComponent', () => {
  let component: Rental_infoComponent;
  let fixture: ComponentFixture<Rental_infoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Rental_infoComponent]
    });
    fixture = TestBed.createComponent(Rental_infoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
