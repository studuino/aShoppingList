import {Component, EventEmitter, Output} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingItem} from '../../../entities/ShoppingItem';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {CategoryProvider} from '../../../providers/categories/category';
import {Observable} from 'rxjs/Observable';
import {s} from '@angular/core/src/render3';

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
  selectedCategory: ShoppingCategory;
  $categoryNames: Observable<string[]>;

  @Output()
  itemUpdated =new EventEmitter<ShoppingItem>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailItemPage');
    this.$categoryNames = this.categoryProvider.getCategoryNames();
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

}
