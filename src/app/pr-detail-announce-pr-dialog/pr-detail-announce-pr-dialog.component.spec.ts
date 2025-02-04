import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRDetailAnnouncePRDialogComponent } from './pr-detail-announce-pr-dialog.component';

describe('PrDetailAnnouncePrDialogComponent', () => {
  let component: PRDetailAnnouncePRDialogComponent;
  let fixture: ComponentFixture<PRDetailAnnouncePRDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRDetailAnnouncePRDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PRDetailAnnouncePRDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
