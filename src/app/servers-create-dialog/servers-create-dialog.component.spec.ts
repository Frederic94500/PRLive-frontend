import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersCreateDialogComponent } from './servers-create-dialog.component';

describe('ServersCreateDialogComponent', () => {
  let component: ServersCreateDialogComponent;
  let fixture: ComponentFixture<ServersCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServersCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServersCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
