import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tieResolver } from './tie.resolver';

describe('tieResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tieResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
