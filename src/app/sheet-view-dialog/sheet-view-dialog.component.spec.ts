import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetViewDialogComponent } from './sheet-view-dialog.component';

describe('SheetViewDialogComponent', () => {
  let component: SheetViewDialogComponent;
  let fixture: ComponentFixture<SheetViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
