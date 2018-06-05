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

  currentShoppingList: ShoppingList;
  currentShoppingListTitle;
  currentLocation: LocationWithSortedCategories;
  currentLocationTitle;
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
    this.$locationsWithSortedCategories = this.categoryProvider.getlocationsWithSortedCategoriesByUserUid('fprXH7XZKsWEa0T5TrAv')
      .map(locationsWithSortedCategories => {
        locationsWithSortedCategories
        // For each user location
          .forEach(locationWithSortedCategories => {
            // Check if the location is the current one
            if (locationWithSortedCategories.isCurrentLocation) {
              this.currentLocation = locationWithSortedCategories;
              this.currentLocationTitle = locationWithSortedCategories.title;
            }
          });
        return locationsWithSortedCategories;
      });
  }

  /**
   * Load current shopping list
   */
  private instantiateCurrentShoppingList() {
    this.$shoppingLists = this.shoppingListProvider.getPartialshoppingLists()
    // Map shopping lists
      .map(shoppingLists => {
        this.checkForSelectedList(shoppingLists);
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
      .map(shoppingList => {
        this.currentShoppingList = shoppingList;
        return shoppingList;
      });
  }

  /**
   * Check for a currently selected list
   * @param shoppingLists
   */
  private checkForSelectedList(shoppingLists) {
    if (!this.currentShoppingList) {
      // Get first list
      const firstShoppingList = shoppingLists[0];
      // Assign current list
      this.currentShoppingList = firstShoppingList;
      // Update current shopping list title
      this.currentShoppingListTitle = firstShoppingList.title;
      // Assign current shopping list
      this.$currentShoppingList = this.shoppingListProvider.getShoppingListByUid(firstShoppingList.uid);
    }
  }

  /**
   * Display menu items
   * @param myEvent
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ShoppingListOptionsPage,
      {
        location: this.currentLocation,
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
      .find(category => category.title === 'Uncategorized');
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
   * @param locationWithSortedCategories
   */
  updateCategoriesOrderByLocation(locationWithSortedCategories) {
    // Set current location boolean to false
    this.currentLocation.isCurrentLocation = false;
    // update currrent location on firestore
    this.categoryProvider.updateLocationWithSortedCategories(this.currentLocation)
      .then(() => {
        // Switch current location
        this.currentLocation = locationWithSortedCategories;
        // Set new location boolean to true
        locationWithSortedCategories.isCurrentLocation = true;
        // Update new location on firestore
        this.categoryProvider.updateLocationWithSortedCategories(locationWithSortedCategories)
      });
    this.shoppingListProvider.rearrangeShoppingListCategories(this.currentShoppingList, locationWithSortedCategories);
  }

  /**
   * Mark item as checked and move to shopping cart
   * @param shoppingList
   * @param categoryWithCheckedItem
   * @param {ShoppingItem} item
   */
  checkItemToCart(shoppingList: ShoppingList, categoryWithCheckedItem: ShoppingCategory, item: ShoppingItem) {
    // Check off item
    item.checked = true;
    // Assign categoryUid to item, to support unchecking of item
    // TODO ALH: Rethink this implementation!
    item.categoryUid = categoryWithCheckedItem.uid;
    //Find item to remove from current category
    const indexOfItemToMove = categoryWithCheckedItem.items.indexOf(item);
    categoryWithCheckedItem.items.splice(indexOfItemToMove, 1);

    shoppingList.cart.items.push(item);
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /***** COMPUTATION *****/

  /**
   * Compute shopping list total
   * @param {ShoppingList} shoppingList
   * @returns {number}
   */
  computeTotalOfItemsInList(shoppingList: ShoppingList): number {
    // Make sure to resize the view to ensure right dimensions
    this.content.resize();
    // Return calculated shopping list total
    return this.shoppingListProvider.calculateShoppingListTotal(shoppingList)
  }

  /**
   * Uncheck item and move from shopping cart to original category
   * @param shoppingList
   * @param {ShoppingItem} item
   */
  uncheckItemFromCart(shoppingList: ShoppingList, item: ShoppingItem) {
    // Uncheck item
    item.checked = false;
    // Locate original category for item
    const originalCategory = shoppingList.categories.find(category => category.uid === item.categoryUid);
    // Add item back to category
    originalCategory.items.push(item);
    // Locate index of item in cart
    const indexOfItemInCart = shoppingList.cart.items.indexOf(item);
    // Remove item from cart
    shoppingList.cart.items.splice(indexOfItemInCart, 1);
    // Update shopping list on firestore
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }
}
