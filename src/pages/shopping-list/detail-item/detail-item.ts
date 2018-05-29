import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingItem} from '../../../entities/ShoppingItem';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {CategoryProvider} from '../../../providers/categories/category';
import {Observable} from 'rxjs/Observable';

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
  // User selected category, that selectedItem should be placed in
  selectorCategoryTitle: string;

  $categories: Observable<ShoppingCategory[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
    this.selectorCategoryTitle = this.selectedCategory.title;
  }

  ionViewDidLoad() {
    this.$categories = this.categoryProvider.getCategories();
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
    this.categoryProvider.updateCategory(this.selectedCategory);
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
  moveItemToCategory(categories) {
    const categoriesAsShopping = categories as ShoppingCategory[];
    // Get the category to move selectedItem to
    const categoryToMoveItemTo = categoriesAsShopping.find(category => category.title === this.selectorCategoryTitle);
    // Add item to new category
    categoryToMoveItemTo.items.push(this.selectedItem);
    // Filter moved item away from old list
    this.selectedCategory.items = this.selectedCategory.items.filter(item => item.title !== this.selectedItem.title);
    // Update categoryToMoveItemTo on firestore
    this.categoryProvider.updateCategory(categoryToMoveItemTo);
    // Update selected category on firestore
    this.categoryProvider.updateCategory(this.selectedCategory)
      // Set selectedCategory to categoryToMoveItemTo
      .then(() => this.selectedCategory = categoryToMoveItemTo);
  }
}
