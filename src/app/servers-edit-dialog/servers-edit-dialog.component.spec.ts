import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersEditDialogComponent } from './servers-edit-dialog.component';

describe('ServersEditDialogComponent', () => {
  let component: ServersEditDialogComponent;
  let fixture: ComponentFixture<ServersEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServersEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServersEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
