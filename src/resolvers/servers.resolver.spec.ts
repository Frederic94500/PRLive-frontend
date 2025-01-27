import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { serversResolver } from './servers.resolver';

describe('serversResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => serversResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
