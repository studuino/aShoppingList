import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  currentShoppingList: ShoppingList;
  userShoppingLists: ShoppingList[];

  locationsWithSortedCategories: LocationWithSortedCategories[];
  currentLocationWithSortedCategories: LocationWithSortedCategories;

  newItemTitle = '';

  constructor(private authService: AuthService,
              private shoppingListService: ShoppingListService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    const userUid = this.authService.getUserUid();
    this.initShoppingLists(userUid);
    this.initLocationsWithSortedCategories(userUid);
    this.shoppingListService.getFirstShoppingListByUserUid(userUid)
      .subscribe(firstShoppingList => {
        this.currentShoppingList = firstShoppingList;
      });
  }

  private initLocationsWithSortedCategories(userUid) {
    this.categoryService.getlocationsWithSortedCategoriesByUserUid(userUid)
      .subscribe(locationsWithSortedCategories => {
        this.locationsWithSortedCategories = locationsWithSortedCategories;
        this.currentLocationWithSortedCategories = locationsWithSortedCategories[0];
      });
  }

  private initShoppingLists(userUid) {
    this.shoppingListService.getPartialShoppingListsByUserUid(userUid)
      .subscribe(shoppingLists => {
        if (shoppingLists) {
          this.userShoppingLists = shoppingLists;
        }
      });
  }

  addItem() {
    // TODO ALH: Add item to list!
    this.newItemTitle = '';
  }
}
