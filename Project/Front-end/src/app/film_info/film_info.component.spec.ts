import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Film_infoComponent} from './film_info.component';

describe('InfoComponent', () => {
  let component: Film_infoComponent;
  let fixture: ComponentFixture<Film_infoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Film_infoComponent]
    });
    fixture = TestBed.createComponent(Film_infoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
