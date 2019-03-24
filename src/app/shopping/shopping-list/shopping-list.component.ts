import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../ModuleRoutes';
import { ShoppingRoutes } from '../ShoppingRoutes';

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
  private currentShoppingListTotal: number;
  private currentCartTotal: number;

  constructor(private authService: AuthService,
              private shoppingListService: ShoppingListService,
              private categoryService: CategoryService,
              private router: Router) {
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
        this.computeTotalOfItemsInList();
        this.computeTotalOfCart();
      });
  }

  private initLocationsWithSortedCategories(userUid) {
    this.$locationsSub = this.categoryService.getLocationsWithSortedCategoriesByUserUid(userUid)
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
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      checked: false,
      quantity: 1,
    };
    const uncategorized = this.categoryService.getUncategorizedCategoryFromShoppingList(this.currentShoppingList);
    uncategorized.items.push(newItem);
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
    // Reset newItemTitle
    this.newItemTitle = '';
  }

  /***** ITEM LIST *****/

  checkItemToCart(category: ShoppingCategory, item: ShoppingItem) {
    // TODO ALH: Consider setting category id earlier!
    if (category.title !== this.categoryService.UNCATEGORIZED_TITLE) {
      // Assign categoryUid to item, to support unchecking of item
      item.categoryUid = category.uid;
    } else {
      item.categoryUid = this.categoryService.UNCATEGORIZED_TITLE;
    }
    // Find item to remove from current category
    const indexOfItemToMove = category.items.indexOf(item);
    category.items.splice(indexOfItemToMove, 1);

    this.currentShoppingList.cart.items.push(item);
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  reorderItems(positionChange, items: ShoppingItem[]) {
    // Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
    const fromPosition = positionChange.from;
    const itemToMove = items.splice(fromPosition, 1)[0];
    const toPosition = positionChange.to;
    items.splice(toPosition, 0, itemToMove);
    positionChange.complete();
    // Send updated list to firestore!
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  editItem(category: ShoppingCategory, item: ShoppingItem) {
    this.shoppingListService.currentItem = item;
    this.shoppingListService.currentCategory = category;
    this.router.navigateByUrl(ModuleRoutes.SHOPPING_LIST + ShoppingRoutes.ITEM_DETAIL);
  }

  removeItem(category: ShoppingCategory, item: ShoppingItem) {
    // Find index of item to remove from category
    const indexOfItemToRemove = category.items.findIndex(itemInList => itemInList.title === item.title);
    // Remove item
    category.items.splice(indexOfItemToRemove, 1);
    // Send updated shopping list to update in firestore
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  private computeTotalOfItemsInList() {
    // Set calculated shopping list total
    this.currentShoppingListTotal = this.shoppingListService.calculateShoppingListTotal(this.currentShoppingList);
  }

  /***** SHOPPING CART *****/

  uncheckItemFromCart(checkedItem: ShoppingItem) {
    // Make sure to uncheck item
    checkedItem.checked = false;
    // Locate the category to move the item back to
    const originalCategory = this.categoryService.getCategoryFromItem(this.currentShoppingList, checkedItem);
    originalCategory.items.push(checkedItem);
    // Remove item from shopping cart
    this.shoppingListService.removeItemFromItemList(this.currentShoppingList.cart.items, checkedItem);
    // Update shopping list on firestore
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  // Removes all items from shopping list cart
  checkoutCart() {
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  uncheckAllItemsFromCart() {
    this.currentShoppingList.cart.items
    // For every item in the cart
      .forEach(itemInList => {
        // Uncheck item
        itemInList.checked = false;
        // Locate the category to move the item back to
        const originalCategory = this.categoryService.getCategoryFromItem(this.currentShoppingList, itemInList);
        originalCategory.items.push(itemInList);
      });
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  /**
   * Helper method to compute cart total
   */
  private computeTotalOfCart() {
    // Set calculated cart total
    this.currentCartTotal = this.shoppingListService.calculateCartTotal(this.currentShoppingList.cart);
  }
}
