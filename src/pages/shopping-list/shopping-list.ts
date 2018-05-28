import {Component} from '@angular/core';
import {ItemSliding, NavController, NavParams} from 'ionic-angular';
import {DetailItemPage} from './detail-item/detail-item';
import {ShoppingItem} from '../../entities/ShoppingItem';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  newItemTitle: string;
  items: Array<ShoppingItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.items = [];
    for (let i = 1; i < 4; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'Note for item #' + i,
        quantity: Math.floor(Math.random() * this.items.length) + 1,
        checked: i%2 == 1
      });
    }
  }

  /**
   * React on user adding item to list
   */
  addItem() {
    // Create new item from input
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      checked: false,
      quantity: 1,
    };

    // Add item to list
    this.items.push(newItem);

    // Reset newItemTitle
    this.newItemTitle = null;
  }

  /**
   * Edit provided item
   * @param {ShoppingItem} item
   * @param slidingItem
   */
  editItem(item: ShoppingItem, slidingItem: ItemSliding) {
    this.navCtrl.push(DetailItemPage, {
      item: item
    });
    // Close slider for nice UX!
    slidingItem.close();
  }

  /**
   * Delete provided item
   * @param {ShoppingItem} item
   * @param slidingItem
   */
  deleteItem(item: ShoppingItem, slidingItem: ItemSliding) {
    const indexOfItemToRemove = this.items.findIndex(item => item === item);
    this.items.splice(indexOfItemToRemove, 1);
    // Close slider for nice UX!
    slidingItem.close();
  }
}
