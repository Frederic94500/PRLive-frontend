import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetGsheetDialogComponent } from './sheet-gsheet-dialog.component';

describe('SheetGsheetDialogComponent', () => {
  let component: SheetGsheetDialogComponent;
  let fixture: ComponentFixture<SheetGsheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetGsheetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetGsheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
