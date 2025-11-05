import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrEditDynamicSampleLengthDialogComponent } from './pr-edit-dynamic-sample-length-dialog.component';

describe('PrEditDynamicSampleLengthDialogComponent', () => {
  let component: PrEditDynamicSampleLengthDialogComponent;
  let fixture: ComponentFixture<PrEditDynamicSampleLengthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrEditDynamicSampleLengthDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrEditDynamicSampleLengthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
