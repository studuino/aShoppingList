import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingItem } from '../../entities/ShoppingItem';

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  $currentShoppingListSub;
  currentShoppingList: ShoppingList;
  $shoppingListsSub;
  userShoppingLists: ShoppingList[];

  $locationsSub;
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
    this.initFirstShoppingList(userUid);
  }

  ngOnDestroy(): void {
    // Make sure to close connection to firestore!
    this.$shoppingListsSub.unsubscribe();
    this.$locationsSub.unsubscribe();
    this.$currentShoppingListSub.unsubscribe();
  }

  private initFirstShoppingList(userUid) {
    this.$currentShoppingListSub = this.shoppingListService.getFirstShoppingListByUserUid(userUid)
      .subscribe(firstShoppingList => {
        this.currentShoppingList = firstShoppingList;
      });
  }

  private initLocationsWithSortedCategories(userUid) {
    this.$locationsSub = this.categoryService.getlocationsWithSortedCategoriesByUserUid(userUid)
      .subscribe(locationsWithSortedCategories => {
        this.locationsWithSortedCategories = locationsWithSortedCategories;
        this.currentLocationWithSortedCategories = locationsWithSortedCategories[0];
      });
  }

  private initShoppingLists(userUid) {
    this.$shoppingListsSub = this.shoppingListService.getPartialShoppingListsByUserUid(userUid)
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

  checkItemToCart(category: ShoppingCategory, item: ShoppingItem) {
    console.log(item);
  }

  reorderItems(positionChange, items: ShoppingItem[]) {
    const fromPosition = positionChange.from;
    const itemToMove = items.splice(fromPosition, 1)[0];
    const toPosition = positionChange.to;
    items.splice(toPosition, 0, itemToMove);
    positionChange.complete();
  }
}
