import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRFinishedComponent } from './pr-finished.component';

describe('PrFinishedComponent', () => {
  let component: PRFinishedComponent;
  let fixture: ComponentFixture<PRFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRFinishedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PRFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
