import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationWithSortedCategoriesComponent } from './location-with-sorted-categories.component';

describe('LocationWithSortedCategoriesComponent', () => {
  let component: LocationWithSortedCategoriesComponent;
  let fixture: ComponentFixture<LocationWithSortedCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationWithSortedCategoriesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationWithSortedCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
