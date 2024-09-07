import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { prOutputResolver } from './pr-output.resolver';

describe('prOutputResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => prOutputResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
