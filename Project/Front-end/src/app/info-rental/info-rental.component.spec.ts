import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRentalComponent } from './info-rental.component';

describe('InfoRentalComponent', () => {
  let component: InfoRentalComponent;
  let fixture: ComponentFixture<InfoRentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoRentalComponent]
    });
    fixture = TestBed.createComponent(InfoRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
