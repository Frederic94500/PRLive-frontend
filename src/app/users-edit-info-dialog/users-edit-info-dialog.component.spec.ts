import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEditInfoDialogComponent } from './users-edit-info-dialog.component';

describe('UsersEditInfoDialogComponent', () => {
  let component: UsersEditInfoDialogComponent;
  let fixture: ComponentFixture<UsersEditInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersEditInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersEditInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
