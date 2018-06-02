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
    // Grab shopping lists
      .switchMap(shoppingLists => {
        // Load categories from shopping list
        return this.categoryProvider.getCategoriesWithItemsByShoppingListUid(shoppingLists[0].uid)
          .map(categories => {
            // Map categories to shopping list
            shoppingLists[0].categories = categories;
            // Return shopping list with categories
            return shoppingLists[0];
          });
      })
      // Grab shopping list with categories
      .switchMap(shoppingListWithCategories => {
        const currentShoppingList = shoppingListWithCategories as ShoppingList;
        // Set title of Shopping List for Header dropdown
        this.shoppingListTitle = currentShoppingList.title;

        return this.categoryProvider.getLocationWithSortedCategoriesByName(this.locationWithSortedCategories.title)
          .map(locationWithSortedCategories => {
            // Check for user location set
            if (locationWithSortedCategories) {
              const locationWithSortedCategoriesTypeSafe = locationWithSortedCategories as {
                title: string,
                sortedCategories: any[]
              };
              this.locationWithSortedCategories = locationWithSortedCategoriesTypeSafe;
              // create new array for sorted categories
              const sortedCategories: ShoppingCategory[] = [];
              // Make sure to add uncategorized as first category
              const uncategorizedCategory = currentShoppingList.categories
                .find(unsortedCategory => unsortedCategory.title === 'Uncategorized');
              sortedCategories.push(uncategorizedCategory);
              // For each sorted category
              locationWithSortedCategoriesTypeSafe.sortedCategories.forEach(sortedCategory => {
                // Find the same category (with items) in old array
                const categoryForCurrentIndexInSortedArray = currentShoppingList.categories
                  .find(unsortedCategory => unsortedCategory.title === sortedCategory.title);
                // Check if category is used in current list
                if (categoryForCurrentIndexInSortedArray) {
                  // And assign it to the sorted array
                  sortedCategories.push(categoryForCurrentIndexInSortedArray);
                }
              });
              // Assign sorted categories
              currentShoppingList.categories = sortedCategories;
            }
            // Return the shopping list
            return currentShoppingList;
          });
      });
  };

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
    const uncategorized = shoppingList.categories
      .find(category => category.title === 'Uncategorized');
    uncategorized.items.push(newItem);
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
