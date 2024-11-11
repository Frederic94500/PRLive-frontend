import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationNominateDialogComponent } from './nomination-nominate-dialog.component';

describe('NominationNominateDialogComponent', () => {
  let component: NominationNominateDialogComponent;
  let fixture: ComponentFixture<NominationNominateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominationNominateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominationNominateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
