import { TestBed } from '@angular/core/testing';

import { LocationWithSortedCategoriesService } from './location-with-sorted-categories.service';

describe('LocationWithSortedCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationWithSortedCategoriesService = TestBed.get(LocationWithSortedCategoriesService);
    expect(service).toBeTruthy();
  });
});
