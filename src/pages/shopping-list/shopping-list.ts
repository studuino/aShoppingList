import {Component} from '@angular/core';
import {ItemSliding, NavController, NavParams, PopoverController} from 'ionic-angular';
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

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  newItemTitle: string;
  $shoppingLists: Observable<ShoppingList[]>;
  $currentShoppingList: Observable<ShoppingList>;
  $locationSortedCategories: Observable<any[]>;
  shoppingListTitle: string;
  locationWithSortedCategories: {
    title: string,
    sortedCategories: any[]
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              private shoppingListProvider: ShoppingListProvider,
              private categoryProvider: CategoryProvider) {
  }

  ionViewDidLoad() {
    this.setupLocations();

    // Load all shopping lists
    this.$shoppingLists = this.shoppingListProvider.getShoppingLists();
    // Set current shopping list as first from list
    this.setupCurrentShoppingList();
  }

  /**
   * From shopping list observable, assign first from array
   */
  private setupCurrentShoppingList() {
    this.$currentShoppingList = this.$shoppingLists
      .switchMap(shoppingLists => {
        // Load categories from shopping list
        return this.categoryProvider.getCategoriesWithItemsByShoppingListUid(shoppingLists[0].uid)
          .map(categoriesWithItems => {
            // ensure typesafe categories
            let categoriesWithItemsTypesafe = categoriesWithItems as ShoppingCategory[];
            // TODO ALH: Make observable!
            // Check for user location set
            if (this.locationWithSortedCategories) {
              // create new array for sorted categories
              const sortedCategories: ShoppingCategory[] = [];
              // For each sorted category
              this.locationWithSortedCategories.sortedCategories.forEach(sortedCategory => {
                // Find the same category (with items) in old array
                const categoryForCurrentIndexInSortedArray = categoriesWithItemsTypesafe.find(unsortedCategory => unsortedCategory.title === sortedCategory.title);
                // And assign it to the sorted array
                sortedCategories.push(categoryForCurrentIndexInSortedArray);
              });
              // Assign sorted categories
              categoriesWithItemsTypesafe = sortedCategories;
            }
            // Set categories in shopping list
            shoppingLists[0].categories = categoriesWithItemsTypesafe;
            // Set title of Shopping List for Header dropdown
            this.shoppingListTitle = shoppingLists[0].title;
            return shoppingLists[0];
          });
      });
  }

  /**
   * Get list of locations
   */
  private setupLocations() {
    this.$locationSortedCategories = this.categoryProvider.getLocationSortedCategoriesByUserUid('fprXH7XZKsWEa0T5TrAv')
      .map(locationSortedCategories => {
        const firstLocation = locationSortedCategories[0] as {
          title: string,
          sortedCategories: any[]
        };
        this.locationWithSortedCategories = firstLocation;
        return locationSortedCategories;
      });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ShoppingListOptionsPage,
      {
        location: this.locationWithSortedCategories
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
    shoppingList.categories[0].items.push(newItem);
    this.categoryProvider.updateCategoryWithItems(shoppingList.categories[0]);
    // Reset newItemTitle
    this.newItemTitle = null;
  }

  /**
   * Edit provided item
   * @param shoppingListUid
   * @param category
   * @param {ShoppingItem} item
   * @param slidingItem
   */
  editItem(shoppingListUid: string, category: ShoppingCategory, item: ShoppingItem, slidingItem: ItemSliding) {
    this.navCtrl.push(DetailItemPage, {
      shoppingListUid: shoppingListUid,
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
  removeItem(category: ShoppingCategory, item: ShoppingItem, slidingItem: ItemSliding) {
    // Find index of item to remove from category
    const indexOfItemToRemove = category.items.findIndex(itemInList => itemInList.title === item.title);
    // Remove item
    category.items.splice(indexOfItemToRemove, 1);
    // Send updated shopping list to update in firestore
    this.categoryProvider.updateCategoryWithItems(category);
    // Close slider for nice UX!
    slidingItem.close();
  }

  /**
   * Mark item as checked
   * @param categoryWithCheckedItem
   * @param {ShoppingItem} item
   */
  changeChecked(categoryWithCheckedItem: ShoppingCategory, item: ShoppingItem) {
    item.checked = !item.checked;
    this.categoryProvider.updateCategoryWithItems(categoryWithCheckedItem);
  }

  /**
   * Compute shopping list total
   * @param {ShoppingList} shoppingList
   * @returns {number}
   */
  computeTotalOfItemsInList(shoppingList: ShoppingList): number {
    return this.shoppingListProvider.calculateShoppingListTotal(shoppingList)
  }

  /**
   * Update order of items in in category
   * @param {ReorderIndexes} indexes
   * @param {ShoppingCategory} category
   */
  updateListOrder(indexes: ReorderIndexes, category: ShoppingCategory) {
    // Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
    category.items.splice(
      indexes.to, 0, // Index we're moving to
      category.items.splice(indexes.from, 1)[0]); // Item we are moving (splice returns array of removed items!)
    // Send updated list to firestore!
    this.categoryProvider.updateCategoryWithItems(category);
  }

  /**
   * Load selected shopping list
   * @param {ShoppingList} shoppingList
   */
  loadSelectedShoppingList(shoppingList: ShoppingList) {
    this.$currentShoppingList =
      // Get shopping list
      this.shoppingListProvider.getShoppingListByUid(shoppingList.uid)
        // Switch to loading categories in shopping list
      .switchMap(shoppingList => {
        return this.categoryProvider.getCategoriesWithItemsByShoppingListUid(shoppingList.uid)
          .map(categories => {
            // Assign categories to list
            shoppingList.categories = categories;
            return shoppingList;
          })
      });
  }
}
