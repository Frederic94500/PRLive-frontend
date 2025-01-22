import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { sheetNoAuthResolver } from './sheet-no-auth.resolver';

describe('sheetNoAuthResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => sheetNoAuthResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
