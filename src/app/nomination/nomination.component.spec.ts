import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationComponent } from './nomination.component';

describe('NominationComponent', () => {
  let component: NominationComponent;
  let fixture: ComponentFixture<NominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
