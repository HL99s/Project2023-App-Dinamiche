import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoFilmComponent} from './infoFilm.component';

describe('InfoComponent', () => {
  let component: InfoFilmComponent;
  let fixture: ComponentFixture<InfoFilmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoFilmComponent]
    });
    fixture = TestBed.createComponent(InfoFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
