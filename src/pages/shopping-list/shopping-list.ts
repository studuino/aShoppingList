import {Component} from '@angular/core';
import {ItemSliding, NavController, NavParams} from 'ionic-angular';
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

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  newItemTitle: string;
  $shoppingLists: Observable<ShoppingList[]>;
  $currentShoppingList: Observable<ShoppingList>;
  shoppingListTitle: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private shoppingListProvider: ShoppingListProvider,
              private categoryProvider: CategoryProvider) {
  }

  ionViewDidLoad() {
    // Load all shopping lists
    this.$shoppingLists = this.shoppingListProvider.getShoppingLists();
    // Set current shopping list as first from list
    this.$currentShoppingList = this.$shoppingLists
      .switchMap(shoppingLists => {
        // Load categories from shopping list
        return this.categoryProvider.getCategoriesByShoppingListUid(shoppingLists[0].uid)
          .map(categories => {
            // Set categories in shopping list
            shoppingLists[0].categories = categories as ShoppingCategory[];
            //
            this.shoppingListTitle = shoppingLists[0].title;
            return shoppingLists[0];
          });
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
    this.categoryProvider.updateCategory(shoppingList.categories[0]);
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
    this.categoryProvider.updateCategory(category);
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
    this.categoryProvider.updateCategory(categoryWithCheckedItem);
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
    this.categoryProvider.updateCategory(category);
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
        return this.categoryProvider.getCategoriesByShoppingListUid(shoppingList.uid)
          .map(categories => {
            // Assign categories to list
            shoppingList.categories = categories;
            return shoppingList;
          })
      });
  }
}
