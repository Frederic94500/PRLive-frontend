import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetXLSXDialogComponent } from './sheet-xlsxdialog.component';

describe('SheetXLSXDialogComponent', () => {
  let component: SheetXLSXDialogComponent;
  let fixture: ComponentFixture<SheetXLSXDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetXLSXDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetXLSXDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
