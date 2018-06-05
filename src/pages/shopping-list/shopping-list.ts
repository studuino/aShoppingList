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
  }

  ionViewDidLoad() {
    this.instantiateCurrentShoppingList();
    this.instantiateLocationsWithCategories();
  }

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
   * Mark item as checked
   * @param shoppingList
   * @param categoryWithCheckedItem
   * @param {ShoppingItem} item
   */
  changeChecked(shoppingList: ShoppingList, categoryWithCheckedItem: ShoppingCategory, item: ShoppingItem) {
    item.checked = !item.checked;
    this.shoppingListProvider.updateShoppingList(shoppingList);
  }

  /**
   * Compute shopping list total
   * @param {ShoppingList} shoppingList
   * @returns {number}
   */
  computeTotalOfItemsInList(shoppingList: ShoppingList): number {
    this.content.resize();
    return this.shoppingListProvider.calculateShoppingListTotal(shoppingList)
  }

  /**
   * Update order of items in in category
   * @param {ReorderIndexes} indexes
   * @param shoppingList
   * @param {ShoppingCategory} category
   */
  updateListOrder(indexes: ReorderIndexes, shoppingList: ShoppingList, category: ShoppingCategory) {
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
  updatecategoriesOrderByLocation(locationWithSortedCategories) {
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
}
