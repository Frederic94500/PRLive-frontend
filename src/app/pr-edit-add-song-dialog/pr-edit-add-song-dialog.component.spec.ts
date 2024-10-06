import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrEditAddSongDialogComponent } from './pr-edit-add-song-dialog.component';

describe('PrEditAddSongDialogComponent', () => {
  let component: PrEditAddSongDialogComponent;
  let fixture: ComponentFixture<PrEditAddSongDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrEditAddSongDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrEditAddSongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
