import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRDetailComponent } from './pr-detail.component';

describe('PRDetailComponent', () => {
  let component: PRDetailComponent;
  let fixture: ComponentFixture<PRDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PRDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
