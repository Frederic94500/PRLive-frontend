import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJoinPRComponent } from './confirm-join-pr.component';

describe('ConfirmJoinPrComponent', () => {
  let component: ConfirmJoinPRComponent;
  let fixture: ComponentFixture<ConfirmJoinPRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmJoinPRComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmJoinPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
