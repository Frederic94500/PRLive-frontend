import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { prNoAuthResolver } from './pr-no-auth.resolver';

describe('prNoAuthResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => prNoAuthResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
