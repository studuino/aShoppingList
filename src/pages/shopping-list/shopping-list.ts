import {Component, ViewChild} from '@angular/core';
import {Content, ItemSliding, NavController, NavParams, PopoverController} from 'ionic-angular';
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

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  @ViewChild(Content) content: Content;

  $shoppingLists: Observable<ShoppingList[]>;
  $currentShoppingList: Observable<ShoppingList>;
  $locationsWithSortedCategories: Observable<LocationWithSortedCategories[]>;

  private UNCATEGORIZED_TITLE = 'Uncategorized';

  currentShoppingList: ShoppingList;
  currentShoppingListTitle;
  currentLocationTitle;
  currentLocation: LocationWithSortedCategories;
  newItemTitle: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              private shoppingListProvider: ShoppingListProvider,
              private categoryProvider: CategoryProvider) {

    this.instantiateCurrentShoppingList();
    this.instantiateLocationsWithCategories();
  }

  ionViewDidLoad() {
  }

  /***** INSTANTIATION *****/

  /**
   * Load list of locations with sorted categories
   */
  private instantiateLocationsWithCategories() {
    this.$locationsWithSortedCategories = this.categoryProvider.getlocationsWithSortedCategoriesByUserUid('fprXH7XZKsWEa0T5TrAv');
  }

  /**
   * Load current shopping list
   */
  private instantiateCurrentShoppingList() {
    this.$shoppingLists = this.shoppingListProvider.getPartialshoppingLists()
    // Map shopping lists
      .map(shoppingLists => {
        if (!this.currentShoppingList) {
          // Get first list
          const firstShoppingList = shoppingLists[0];
          // Assign current shopping list
          this.$currentShoppingList = this.shoppingListProvider.getShoppingListByUid(firstShoppingList.uid)
            .switchMap(shoppingList => {
              // Assign current list
              const currentShoppingList = shoppingList as ShoppingList;
              this.currentShoppingList = currentShoppingList;
              // Update current shopping list title
              this.currentShoppingListTitle = currentShoppingList.title;
              // Get default location
              return this.instantiateShoppingListDefaultLocation(currentShoppingList, shoppingList);
            });
        }
        return shoppingLists;
      });
  }

  /**
   * Update current shopping list
   * @param {ShoppingList} shoppingList
   */
  loadShoppingList(shoppingList: ShoppingList) {
    this.$currentShoppingList = this.shoppingListProvider.getShoppingListByUid(shoppingList.uid)
    // Map shopping lists
      .switchMap(shoppingList => {
        const currentShoppingList = shoppingList as ShoppingList;
        // Get default location
        return this.instantiateShoppingListDefaultLocation(currentShoppingList, shoppingList);
      });
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

  /**
   * Display menu items
   * @param myEvent
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ShoppingListOptionsPage,
      {
        locationTitle: this.currentLocationTitle,
        shoppingList: this.currentShoppingList
      });
    popover.present({
      ev: myEvent
    });
  }

  /***** CRUD *****/

  /**
   * React on user adding item to list
   */
  addItem(shoppingList: ShoppingList) {
    // Create new item from input
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      checked: false,
      quantity: 1,
    };
    const uncategorized = shoppingList.categories
      .find(category => category.title === this.UNCATEGORIZED_TITLE);
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
  computeTotalOfItemsInList(): number {
    // Make sure to resize the view to ensure right dimensions
    this.content.resize();
    // Return calculated shopping list total
    return this.shoppingListProvider.calculateShoppingListTotal(this.currentShoppingList)
  }

  /**
   * Mark item as checked and move to shopping cart
   * @param shoppingList
   * @param categoryWithCheckedItem
   * @param {ShoppingItem} item
   */
  checkItemToCart(categoryWithCheckedItem: ShoppingCategory, item: ShoppingItem) {
    // Find category in current shopping list
    const categoryInCurrentShoppingList = this.currentShoppingList.categories
      .find(category => category.uid === categoryWithCheckedItem.uid);
    // Check off item
    item.checked = true;
    // Check for category
    // TODO ALH: Rethink this implementation!
    if (categoryInCurrentShoppingList.title !== this.UNCATEGORIZED_TITLE) {
      // Assign categoryUid to item, to support unchecking of item
      item.categoryUid = categoryInCurrentShoppingList.uid;
    } else {
      item.categoryUid = this.UNCATEGORIZED_TITLE;
    }
    //Find item to remove from current category
    const indexOfItemToMove = categoryInCurrentShoppingList.items.indexOf(item);
    categoryInCurrentShoppingList.items.splice(indexOfItemToMove, 1);

    this.currentShoppingList.cart.items.push(item);
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList);
  }

  /**
   * Uncheck item and move from shopping cart to original category
   * @param shoppingList
   * @param {ShoppingItem} item
   */
  uncheckItemFromCart(item: ShoppingItem) {
    // Uncheck item
    item.checked = false;
    this.moveItemFromCartToOriginalCategory(item);
    // Locate index of item in cart
    const indexOfItemInCart = this.currentShoppingList.cart.items.indexOf(item);
    // Remove item from cart
    this.currentShoppingList.cart.items.splice(indexOfItemInCart, 1);
    // Update shopping list on firestore
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList);
  }

  /**
   * Move provided item from shopping list cart to original category
   * @param {ShoppingList} shoppingList
   * @param {ShoppingItem} item
   */
  private moveItemFromCartToOriginalCategory(item: ShoppingItem) {
    // If category is not uncategorized
    if (item.categoryUid !== this.UNCATEGORIZED_TITLE) {
      // Locate original category for item
      const originalCategory = this.currentShoppingList.categories
        .find(category => category.uid === item.categoryUid);
      // Add item back to category
      originalCategory.items.push(item);
      // If uncategorized
    } else {
      // Locate in array
      const uncategorized = this.currentShoppingList.categories
        .find(category => category.title === this.UNCATEGORIZED_TITLE);
      // Push item to uncategorized
      uncategorized.items.push(item);
    }
  }

  /**
   * Uncheck every item and move from shopping cart to original category
   * @param {ShoppingList} shoppingList
   */
  uncheckAllItemsFromCart() {
    this.currentShoppingList.cart.items
    // For every item in the cart
      .forEach(itemInList => {
        // Uncheck item
        itemInList.checked = false;
        this.moveItemFromCartToOriginalCategory(itemInList);
      });
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList);
  }

  /**
   * Checkout all items from cart
   * @param {ShoppingList} shoppingList
   */
  checkoutCart() {
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList);
  }
}
