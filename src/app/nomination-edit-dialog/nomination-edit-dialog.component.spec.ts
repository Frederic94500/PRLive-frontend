import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationEditDialogComponent } from './nomination-edit-dialog.component';

describe('NominationEditDialogComponent', () => {
  let component: NominationEditDialogComponent;
  let fixture: ComponentFixture<NominationEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominationEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominationEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
