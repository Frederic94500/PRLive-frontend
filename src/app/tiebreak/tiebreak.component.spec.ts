import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiebreakComponent } from './tiebreak.component';

describe('TiebreakComponent', () => {
  let component: TiebreakComponent;
  let fixture: ComponentFixture<TiebreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiebreakComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiebreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
