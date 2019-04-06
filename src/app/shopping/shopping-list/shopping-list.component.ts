import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/shared/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../ModuleRoutes';
import { ShoppingRoutes } from '../ShoppingRoutes';
import { IonItemSliding, NavController } from '@ionic/angular';

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
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
              private router: Router,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    const userUid = this.authService.getUserUid();
    this.initShoppingLists(userUid);
    this.initLocationsWithSortedCategories(userUid);
  }

  ngOnDestroy(): void {
    // Make sure to close connection to firestore!
    this.$shoppingListsSub.unsubscribe();
    this.$locationsSub.unsubscribe();
  }

  /***** HEADER ACTIONS *****/

  selectShoppingList() {
    this.shoppingListService.currentShoppingList = this.currentShoppingList;
    this.checkDefaultLocation();
    this.sortItemsByCurrentLocation();
  }

  sortItemsByCurrentLocation() {
    this.shoppingListService.sortItemsByCurrentLocation(this.currentShoppingList, this.currentLocationWithSortedCategories);
  }

  addItem() {
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      price: 0,
      checked: false,
      quantity: 1,
    };
    const uncategorized = this.categoryService.getUncategorizedCategoryFromShoppingList(this.currentShoppingList);
    uncategorized.items.push(newItem);
    this.updateShoppingList();
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
    this.updateShoppingList();
  }

  reorderItems(positionChange, items: ShoppingItem[]) {
    // Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
    const fromPosition = positionChange.from;
    const itemToMove = items.splice(fromPosition, 1)[0];
    const toPosition = positionChange.to;
    items.splice(toPosition, 0, itemToMove);
    positionChange.complete();
    // Send updated list to firestore!
    this.updateShoppingList();
  }

  editItem(category: ShoppingCategory, item: ShoppingItem, slider: IonItemSliding) {
    this.shoppingListService.currentItem = item;
    this.shoppingListService.currentCategory = category;
    this.shoppingListService.currentShoppingList = this.currentShoppingList;
    this.navCtrl.navigateForward(ModuleRoutes.SHOPPING_LIST + ShoppingRoutes.ITEM_DETAIL);
    slider.close();
  }

  removeItem(category: ShoppingCategory, item: ShoppingItem, slider: IonItemSliding) {
    // Find index of item to remove from category
    const indexOfItemToRemove = category.items.findIndex(itemInList => itemInList.title === item.title);
    // Remove item
    category.items.splice(indexOfItemToRemove, 1);
    // Send updated shopping list to update in firestore
    this.updateShoppingList();
    slider.close();
  }

  private computeTotalOfItemsInList() {
    // Set calculated shopping list total
    this.currentShoppingListTotal = this.shoppingListService.calculateShoppingListTotal(this.currentShoppingList);
  }

  /**
   * Helper method for initializing users locations
   */
  private initLocationsWithSortedCategories(userUid) {
    this.$locationsSub = this.categoryService.getLocationsWithSortedCategoriesByUserUid(userUid)
      .subscribe(locationsWithSortedCategories => {
        // Set locations
        this.locationsWithSortedCategories = locationsWithSortedCategories;
        // Set ensure current location is set
        this.currentLocationWithSortedCategories = locationsWithSortedCategories[0];
        // Check if user has set a default location
        this.checkDefaultLocation();
        this.sortItemsByCurrentLocation();
      });
  }

  /**
   * Check if user has set default location
   * If set, then update current location
   */
  checkDefaultLocation() {
    if (this.currentShoppingList.defaultLocationUid) {
      const defaultLocation = this.locationsWithSortedCategories
        .find(location => location.uid === this.currentShoppingList.defaultLocationUid);
      // If default location exists then set it to the current location
      if (defaultLocation) {
        this.currentLocationWithSortedCategories = defaultLocation;
      }
    }
  }

  /**
   * Helper method for initializing users shopping lists
   */
  private initShoppingLists(userUid) {
    this.$shoppingListsSub = this.shoppingListService.getShoppingListsByUserUid(userUid)
      .subscribe(shoppingLists => {
        if (shoppingLists) {
          if (this.shoppingListService.currentShoppingList) {
            this.currentShoppingList = shoppingLists.find(shoppingList =>
              shoppingList.uid === this.shoppingListService.currentShoppingList.uid);
          } else {
            this.currentShoppingList = shoppingLists[0];
          }
          this.userShoppingLists = shoppingLists;
          this.computeTotalOfItemsInList();
          this.computeTotalOfCart();
        }
      });
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
    this.updateShoppingList();
  }

  checkoutCart() {
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.updateShoppingList();
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
    this.updateShoppingList();
  }

  updateShoppingList() {
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
