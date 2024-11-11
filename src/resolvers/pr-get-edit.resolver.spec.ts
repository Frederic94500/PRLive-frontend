import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { prGetEditResolver } from './pr-get-edit.resolver';

describe('prGetEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => prGetEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
