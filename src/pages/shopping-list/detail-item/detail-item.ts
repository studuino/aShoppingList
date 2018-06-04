import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingItem} from '../../../entities/ShoppingItem';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {CategoryProvider} from '../../../providers/categories/category';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import 'rxjs-compat/add/operator/take';
import {ShoppingList} from '../../../entities/ShoppingList';

/**
 * Generated class for the ShoppingListDetailItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-item',
  templateUrl: 'detail-item.html',
})
export class DetailItemPage {
  selectedItem: ShoppingItem;
  // Category Selected item origins from
  selectedCategory: ShoppingCategory;
  // Current shopping list uid
  selectedShoppingList: ShoppingList;
  // User selected category, that selectedItem should be placed in
  selectorCategoryTitle: string;
  selectorCategory: ShoppingCategory;

  $categories;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private shoppingListProvider: ShoppingListProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
    this.selectedShoppingList = navParams.get('shoppingList');
    // Set title for the popup selector
    this.selectorCategoryTitle = this.selectedCategory.title;
  }

  ionViewDidLoad() {
    this.$categories = this.categoryProvider.getCategoriesByUserUid('fprXH7XZKsWEa0T5TrAv');
  }

  /**
   * Increase amount of selected item
   */
  increaseAmount() {
    this.selectedItem.quantity += 1;
    this.updateSelectedItemInCategory();
  }

  /**
   * Update the currently selected item
   */
  updateSelectedItemInCategory() {
    this.shoppingListProvider.updateShoppingList(this.selectedShoppingList);
  }

  /**
   * Decrease amount of selected item, if more than 1 is available
   */
  decreaseAmount() {
    if (this.selectedItem.quantity > 1) {
      this.selectedItem.quantity -= 1;
      this.updateSelectedItemInCategory();
    }
  }

  /**
   * Move item from selectedCategory to categoryToMoveItemTo by selectorCategoryTitle
   * @param categories
   */
  moveItemToCategory() {
    // Find index of item to remove from old category
    const indexOfItemToRemove = this.selectedCategory.items.indexOf(this.selectedItem);
    // Remove item from category
    this.selectedCategory.items.splice(indexOfItemToRemove, 1);

    let categoryInList = false;
    // Check if selector category is in the list
    this.selectedShoppingList.categories
      .forEach(category => {
        if (this.selectorCategory.uid === category.uid) {
          categoryInList = true;
          // Assign selectorcategory to found category
          this.selectorCategory = category;
        }
      });
    // If not
    if (!categoryInList) {
      // Instantiate items
      this.selectorCategory.items = [];
      // And add category
      this.selectedShoppingList.categories.push(this.selectorCategory);
    }
    // Push selected item to new category
    this.selectorCategory.items.push(this.selectedItem);
    // Update the shopping list
    this.shoppingListProvider.updateShoppingList(this.selectedShoppingList);
  }
}
