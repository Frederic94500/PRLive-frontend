import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { alwaysTrueResolver } from './always-true.resolver';

describe('alwaysTrueResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => alwaysTrueResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
