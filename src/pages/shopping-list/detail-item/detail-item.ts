import {Component, EventEmitter, Output} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingItem} from '../../../entities/ShoppingItem';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';

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

  @Output()
  itemUpdated =new EventEmitter<ShoppingItem>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private shoppingListProvider: ShoppingListProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailItemPage');
  }

  /**
   * Increase amount of selected item
   */
  increaseAmount() {
    this.selectedItem.quantity += 1;
    this.upateSelectedItemInCategory();
  }

  /**
   * Update the currently selected item
   */
  upateSelectedItemInCategory() {
    this.shoppingListProvider.updateCategory(this.selectedCategory);
  }

  /**
   * Decrease amount of selected item, if more than 1 is available
   */
  decreaseAmount() {
    if (this.selectedItem.quantity > 1) {
      this.selectedItem.quantity -= 1;
      this.upateSelectedItemInCategory();
    }
  }

}
