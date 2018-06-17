import {Component, ViewChild} from '@angular/core';
import {Content, ItemSliding, Loading, NavController, NavParams, PopoverController} from 'ionic-angular';
import {DetailItemPage} from './detail-item/detail-item';
import {ShoppingItem} from '../../entities/ShoppingItem';
import {ShoppingListProvider} from '../../providers/shopping-list/shopping-list';
import {ShoppingList} from '../../entities/ShoppingList';
import {Observable} from 'rxjs';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import 'rxjs-compat/add/operator/switchMap';
import 'rxjs-compat/add/operator/map';
import {CategoryProvider} from '../../providers/categories/category';
import {ReorderIndexes} from 'ionic-angular/umd/components/item/item-reorder';
import {ShoppingListOptionsPage} from './shopping-list-options/shopping-list-options';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import 'rxjs-compat/add/operator/do';
import {AuthProvider} from '../../providers/auth/auth';
import {AlertProvider} from '../../providers/alert/alert';
import {SharedShoppingListProvider} from '../../providers/shared-shopping-list/shared-shopping-list';
import {SharedShoppingList} from '../../entities/SharedShoppingList';
import {LoadingProvider} from '../../providers/loading/loading';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})

export class ShoppingListPage implements ShoppingListCallback {
  @ViewChild(Content) content: Content;

  // Observable values
  $shoppingLists: Observable<ShoppingList[]>;
  $currentShoppingList: Observable<ShoppingList>;
  $locationsWithSortedCategories: Observable<LocationWithSortedCategories[]>;

  // Fields
  currentUserUid: string;
  currentShoppingList: ShoppingList;
  currentShoppingListTitle;
  currentShoppingListTotal = 0;
  currentCartTotal = 0;
  currentLocationTitle;
  currentLocation: LocationWithSortedCategories;
  newItemTitle: string;

  loader: Loading;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private authProvider: AuthProvider,
              private alertProvider: AlertProvider,
              private shoppingListProvider: ShoppingListProvider,
              private loadingProvider: LoadingProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider,
              private categoryProvider: CategoryProvider) {
    // Display loading when fetching data
    this.loader = this.loadingProvider.createLoadingDataScreen();
    this.loader.present();

    this.currentUserUid = this.authProvider.getCurrentAuthUid();
    this.instantiateShoppingLists();
    this.instantiateLocationsWithCategoriesByUserUid(this.currentUserUid);
  }

  ionViewDidLoad() {
  }

  /***** INSTANTIATION *****/

  /**
   * Load list of locations with sorted categories
   */
  private instantiateLocationsWithCategoriesByUserUid(userUid: string) {
    this.$locationsWithSortedCategories = this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(userUid);
  }

  /**
   * Load current shopping list
   */
  private instantiateShoppingLists() {
    // Create array to hold all users shopping lists
    let allLists = [];
    // Locate users own lists
    this.$shoppingLists = this.shoppingListProvider.getPartialShoppingListsByUserUid(this.currentUserUid)
      .switchMap(shoppingLists => {
        allLists = [];
        // Add to array
        shoppingLists.forEach(shoppingList => allLists.push(shoppingList));
        // switchmap to shared shopping lists
        return this.sharedShoppingListProvider.getSharedShoppingListForUserUid(this.currentUserUid);
      })
      .map(sharedShoppingLists => {
        // add to array
        sharedShoppingLists.forEach(sharedList => allLists.push(sharedList));
        // Return complete list
        return allLists;
      });
    // Check for instantiation of current shopping list
    if (!this.currentShoppingList) {
      this.setCurrentShoppingListToFirstShoppingListFromUser();
    }
  }

  /**
   * Default to first shopping list from user
   */
  private setCurrentShoppingListToFirstShoppingListFromUser() {
    this.setCurrentShoppingList(this.shoppingListProvider.getFirstShoppingListByUserUid(this.currentUserUid));
  }

  /**
   * Update current shopping list
   * @param shoppingList
   */
  loadShoppingList(shoppingList: ShoppingList | SharedShoppingList) {
    if (shoppingList as SharedShoppingList) {
      this.instantiateLocationsWithCategoriesByUserUid(shoppingList.userUid);
    }
    this.setCurrentShoppingList(this.shoppingListProvider.getShoppingListByUid(shoppingList.uid));
  }

  /**
   * Set current owned shopping list from user
   */
  setCurrentShoppingList(observableShoppingList: Observable<ShoppingList>) {
    // Stop displaying loader
    this.loader.dismiss();
    this.$currentShoppingList = observableShoppingList
    // Map shopping lists
      .switchMap(shoppingList => {
        // Check if shopping list has not been deleted
        if (shoppingList as ShoppingList && shoppingList.title !== null) {
          const currentShoppingList = this.extractCurrentShoppingList(shoppingList);
          // Get default location
          return this.instantiateShoppingListDefaultLocation(currentShoppingList, shoppingList);
        } else {
          // Set current list to first in array
          this.setCurrentShoppingListToFirstShoppingListFromUser();
        }
      });
  }

  /**
   * Extract shopping list to assign fields
   * @param shoppingList
   * @return {ShoppingList}
   */
  private extractCurrentShoppingList(shoppingList) {
    // Assign current list
    const currentShoppingList = shoppingList as ShoppingList;
    this.currentShoppingList = currentShoppingList;
    // Update current shopping list title
    this.currentShoppingListTitle = currentShoppingList.title;
    // Update totals
    this.computeTotalOfItemsInList();
    this.computeTotalOfCart();
    return currentShoppingList;
  }

  /**
   * Check shopping list for default location
   * @param currentShoppingList
   * @param shoppingList
   * @return {Observable<any>}
   */
  private instantiateShoppingListDefaultLocation(currentShoppingList, shoppingList) {
    return this.categoryProvider.getLocationWithSortedCategoriesByUid(currentShoppingList.defaultLocationUid)
    // Map to return location
      .map(locationWithSortedCategoriesByUid => {
        // Check for default location
        if (locationWithSortedCategoriesByUid) {
          // Assign current location
          this.currentLocation = locationWithSortedCategoriesByUid;
          this.currentLocationTitle = locationWithSortedCategoriesByUid.title;
        }
        // Return current shopping list
        return shoppingList;
      });
  }

  /***** OPTIONS MENU *****/

  /**
   * Display menu items
   * @param myEvent
   */
  presentPopover(myEvent) {
    const callback: ShoppingListCallback = this;
    let popover = this.popoverCtrl.create(ShoppingListOptionsPage,
      {
        callback: callback,
        locationTitle: this.currentLocationTitle,
        shoppingList: this.currentShoppingList
      });
    popover.present({
      ev: myEvent
    });
  }

  /***** CALLBACKS *****/

  /**
   * When user creates a shopping list, select the new list by uid
   * @param {string} newListUid
   */
  onListCreated(newListUid: string) {
    this.setCurrentShoppingList(this.shoppingListProvider.getShoppingListByUid(newListUid));
  }

  /**
   * When user deleted shopping list, Reset default first shopping list
   */
  onListDeleted() {
    const idOfListToDelete = this.currentShoppingList.uid;
    this.setCurrentShoppingListToFirstShoppingListFromUser();
    this.shoppingListProvider.deleteShoppingListByUid(idOfListToDelete)
      .then(() => {
        const confirmMessage = this.alertProvider.getConfirmAlert(
          'Deleted',
          'List deleted',
          {
            text: 'OK'
          });
        confirmMessage.present();
      })
  }

  /**
   * When user leaves shopping list
   * @param {string} listUid
   * @param {string} userUid
   */
  onListLeft(listUid: string, userUid: string) {
    this.sharedShoppingListProvider.leaveSharedShoppingList(listUid, userUid)
      .then(() => {
        // Reinstantiate shopping lists
        this.currentShoppingList = null;
        this.instantiateShoppingLists();
        this.instantiateLocationsWithCategoriesByUserUid(this.currentUserUid);
      });
  }

  /***** ITEM CRUD *****/

  /**
   * React on user adding item to list
   */
  addItem(shoppingList: ShoppingList) {
    this.currentShoppingList = shoppingList;
    // Create new item from input
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      checked: false,
      quantity: 1,
    };
    const uncategorized = this.categoryProvider.getUncategorizedCategoryFromShoppingList(shoppingList);
    uncategorized.items.push(newItem);
    this.shoppingListProvider.updateShoppingList(shoppingList);
    // Reset newItemTitle
    this.newItemTitle = null;
  }

  /**
   * Edit provided item
   * @param shoppingList
   * @param category
   * @param {ShoppingItem} item
   * @param slidingItem
   */
  editItem(shoppingList: ShoppingList, category: ShoppingCategory, item: ShoppingItem, slidingItem: ItemSliding) {
    this.navCtrl.push(DetailItemPage, {
      shoppingList: shoppingList,
      category: category,
      item: item
    });
    // Close slider for nice UX!
    slidingItem.close();
  }

  /**
   * Remove provided item
   * @param shoppingList
   * @param category
   * @param {ShoppingItem} item
   * @param slidingItem
   */
  removeItem(shoppingList: ShoppingList, category: ShoppingCategory, item: ShoppingItem, slidingItem: ItemSliding) {
    // Find index of item to remove from category
    const indexOfItemToRemove = category.items.findIndex(itemInList => itemInList.title === item.title);
    // Remove item
    category.items.splice(indexOfItemToRemove, 1);
    // Send updated shopping list to update in firestore
    this.shoppingListProvider.updateShoppingList(shoppingList);
    // Close slider for nice UX!
    slidingItem.close();
  }

  /**
   * Update order of items in in category
   * @param {ReorderIndexes} indexes
   * @param shoppingList
   * @param {ShoppingCategory} category
   */
  updateOrderOfItems(indexes: ReorderIndexes, shoppingList: ShoppingList, category: ShoppingCategory) {
    // Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
    category.items.splice(
      indexes.to, 0, // Index we're moving to
      category.items.splice(indexes.from, 1)[0]); // Item we are moving (splice returns array of removed items!)
    // Send updated list to firestore!
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /**
   * Rearrange shopping list by current location
   * @param shoppingList
   * @param locationWithSortedCategories
   */
  updateCategoriesOrderByLocation(locationWithSortedCategories: LocationWithSortedCategories) {
    // Update default location
    this.currentShoppingList.defaultLocationUid = locationWithSortedCategories.uid;
    // update currrent location on firestore
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList)
      .then(() => {
        this.shoppingListProvider.rearrangeShoppingListCategories(this.currentShoppingList, locationWithSortedCategories);
      });
  }

  /***** SHOPPING CART *****/

  /**
   * Compute shopping list total
   * @param {ShoppingList} shoppingList
   * @returns {number}
   */
  computeTotalOfItemsInList() {
    // Set calculated shopping list total
    this.currentShoppingListTotal = this.shoppingListProvider.calculateShoppingListTotal(this.currentShoppingList)
  }

  /**
   * Compute cart total
   */
  computeTotalOfCart() {
    // Set calculated cart total
    this.currentCartTotal = this.shoppingListProvider.calculateCartTotal(this.currentShoppingList.cart);
  }

  /**
   * Mark item as checked and move to shopping cart
   * @param shoppingList
   * @param categoryWithCheckedItem
   * @param {ShoppingItem} item
   */
  checkItemToCart(shoppingList: ShoppingList, categoryWithCheckedItem: ShoppingCategory, item: ShoppingItem) {
    this.currentShoppingList = shoppingList;
    // Check off item
    item.checked = true;
    // Check for category
    // TODO ALH: Rethink this implementation!
    if (categoryWithCheckedItem.title !== this.categoryProvider.UNCATEGORIZED_TITLE) {
      // Assign categoryUid to item, to support unchecking of item
      item.categoryUid = categoryWithCheckedItem.uid;
    } else {
      item.categoryUid = this.categoryProvider.UNCATEGORIZED_TITLE;
    }
    //Find item to remove from current category
    const indexOfItemToMove = categoryWithCheckedItem.items.indexOf(item);
    categoryWithCheckedItem.items.splice(indexOfItemToMove, 1);

    shoppingList.cart.items.push(item);
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /**
   * Uncheck item and move from shopping cart to original category
   * @param shoppingList
   * @param {ShoppingItem} item
   */
  uncheckItemFromCart(shoppingList: ShoppingList, item: ShoppingItem) {
    this.currentShoppingList = shoppingList;
    // Uncheck item
    item.checked = false;
    this.moveItemFromCartToOriginalCategory(shoppingList, item);
    // Locate index of item in cart
    const indexOfItemInCart = shoppingList.cart.items.indexOf(item);
    // Remove item from cart
    shoppingList.cart.items.splice(indexOfItemInCart, 1);
    // Update shopping list on firestore
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /**
   * Helper method to move provided item from shopping list cart to original category
   * @param {ShoppingList} shoppingList
   * @param {ShoppingItem} item
   */
  private moveItemFromCartToOriginalCategory(shoppingList: ShoppingList, item: ShoppingItem) {
    this.currentShoppingList = shoppingList;
    // If category is not uncategorized
    if (item.categoryUid !== this.categoryProvider.UNCATEGORIZED_TITLE) {
      // Locate original category for item
      const originalCategory = shoppingList.categories
        .find(category => category.uid === item.categoryUid);
      // Add item back to category
      originalCategory.items.push(item);
      // If uncategorized
    } else {
      // Locate uncategorized in array
      const uncategorized = this.categoryProvider.getUncategorizedCategoryFromShoppingList(shoppingList);
      // Push item to uncategorized
      uncategorized.items.push(item);
    }
  }

  /**
   * Uncheck every item and move from shopping cart to original category
   * @param {ShoppingList} shoppingList
   */
  uncheckAllItemsFromCart(shoppingList: ShoppingList) {
    this.currentShoppingList = shoppingList;
    shoppingList.cart.items
    // For every item in the cart
      .forEach(itemInList => {
        // Uncheck item
        itemInList.checked = false;
        this.moveItemFromCartToOriginalCategory(shoppingList, itemInList);
      });
    // Empty shopping cart
    shoppingList.cart.items = [];
    // Update firestore
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /**
   * Checkout all items from cart
   * @param {ShoppingList} shoppingList
   */
  checkoutCart(shoppingList: ShoppingList) {
    this.currentShoppingList = shoppingList;
    // Empty shopping cart
    shoppingList.cart.items = [];
    // Update firestore
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  onLogout() {
    this.navCtrl.setRoot('LoginPage')
      .then(() => {
        this.authProvider.logout();
      });
  }
}
