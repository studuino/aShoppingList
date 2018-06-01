import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingItem} from '../../../entities/ShoppingItem';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {CategoryProvider} from '../../../providers/categories/category';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import 'rxjs-compat/add/operator/take';

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
  selectedShoppingListUid: string;
  // User selected category, that selectedItem should be placed in
  selectorCategoryTitle: string;
  selectorCategoryId: string;

  $categories;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private shoppingListProvider: ShoppingListProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
    this.selectedShoppingListUid = navParams.get('shoppingListUid');
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
    this.categoryProvider.updateCategoryWithItems(this.selectedCategory);
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
    // Get original category with item
    this.categoryProvider.getCategoryWithItemsByUid(this.selectedCategory.uid)
      .take(1)
      .switchMap(category => {
        // Remove item from original category
        category.items = category.items.filter(item => item.uid !== this.selectedItem.uid);
        return this.categoryProvider.updateCategoryWithItems(category);
      })
      .take(1)
      .switchMap(() => {
        // Get new category to put item in
        return this.categoryProvider.getCategoryWithItemsByShoppingListUidAndCategoryTitle(this.selectedShoppingListUid, this.selectorCategoryTitle)
          .map(queriedCategories => {
            return queriedCategories[0];
          })
      })
      .take(1)
      .switchMap(newCategory => {
        if (newCategory) {
          // Add item to category
          newCategory.items.push(this.selectedItem);
          return this.categoryProvider.updateCategoryWithItems(newCategory);
        } else {
          // Create new category with selected item
          const newCategoryWithItems: ShoppingCategory = {
            items: [this.selectedItem],
            title: this.selectorCategoryTitle,
            shoppingListUid: this.selectedShoppingListUid,
          };
          // Add new category to firestore
          return this.categoryProvider.createCategoryWithItems(newCategoryWithItems);
        }
      }).subscribe();
  }
}
