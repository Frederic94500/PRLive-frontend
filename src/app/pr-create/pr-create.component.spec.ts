import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRCreateComponent } from './pr-create.component';

describe('PrCreateComponent', () => {
  let component: PRCreateComponent;
  let fixture: ComponentFixture<PRCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PRCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
