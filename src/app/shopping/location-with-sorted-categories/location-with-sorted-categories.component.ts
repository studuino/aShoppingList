import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { ArrayUtil } from '../../shared/utils/ArrayUtil';
import { LocationWithSortedCategoriesService } from '../../shared/firestore/location-with-sorted-categories.service';

@Component({
  selector: 'a-location-with-sorted-categories',
  templateUrl: './location-with-sorted-categories.component.html',
  styleUrls: ['./location-with-sorted-categories.component.scss'],
})
export class LocationWithSortedCategoriesComponent implements OnInit {
  currentLocation: LocationWithSortedCategories;

  constructor(private shoppingListService: ShoppingListService,
              private locationService: LocationWithSortedCategoriesService) {
  }

  ngOnInit() {
    this.currentLocation = this.shoppingListService.currentLocation;
  }

  reorderItems(positionChange) {
    ArrayUtil.reorderItemsInArray(positionChange, this.currentLocation.sortedCategories);
    positionChange.complete();
    // Send updated location to firestore!
    this.locationService.update(this.currentLocation);
  }
}
