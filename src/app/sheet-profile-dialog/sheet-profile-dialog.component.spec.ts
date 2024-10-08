import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetProfileDialogComponent } from './sheet-profile-dialog.component';

describe('SheetProfileDialogComponent', () => {
  let component: SheetProfileDialogComponent;
  let fixture: ComponentFixture<SheetProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetProfileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
