import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrBulkAnnounceDialogComponent } from './pr-bulk-announce-dialog.component';

describe('PrBulkAnnounceDialogComponent', () => {
  let component: PrBulkAnnounceDialogComponent;
  let fixture: ComponentFixture<PrBulkAnnounceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrBulkAnnounceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrBulkAnnounceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
