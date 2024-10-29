import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCSVDialogComponent } from './sheet-csv-dialog.component';

describe('SheetCsvDialogComponent', () => {
  let component: SheetCSVDialogComponent;
  let fixture: ComponentFixture<SheetCSVDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetCSVDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetCSVDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
