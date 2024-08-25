import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRTableComponent } from './pr-table.component';

describe('TableComponent', () => {
  let component: PRTableComponent;
  let fixture: ComponentFixture<PRTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PRTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
