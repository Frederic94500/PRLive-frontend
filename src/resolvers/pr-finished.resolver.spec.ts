import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { prFinishedResolver } from './pr-finished.resolver';

describe('prFinishedResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => prFinishedResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
