import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoprovaComponent } from './histoprova.component';

describe('HistoprovaComponent', () => {
  let component: HistoprovaComponent;
  let fixture: ComponentFixture<HistoprovaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoprovaComponent]
    });
    fixture = TestBed.createComponent(HistoprovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
