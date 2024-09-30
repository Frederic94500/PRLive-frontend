import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListDialogComponent } from './song-list-dialog.component';

describe('SongListDialogComponent', () => {
  let component: SongListDialogComponent;
  let fixture: ComponentFixture<SongListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
