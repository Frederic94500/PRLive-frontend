import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { nominationResolver } from './nomination.resolver';

describe('nominationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => nominationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
