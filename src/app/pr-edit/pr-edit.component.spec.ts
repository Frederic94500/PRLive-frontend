import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PREditComponent } from './pr-edit.component';

describe('PrEditComponent', () => {
  let component: PREditComponent;
  let fixture: ComponentFixture<PREditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PREditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PREditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
