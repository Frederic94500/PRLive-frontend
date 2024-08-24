import { ResolveFn } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { sheetResolverResolver } from './sheet.resolver';

describe('sheetResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      sheetResolverResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
