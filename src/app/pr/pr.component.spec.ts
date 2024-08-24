import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRComponent } from './pr.component';

describe('PrComponent', () => {
  let component: PRComponent;
  let fixture: ComponentFixture<PRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
