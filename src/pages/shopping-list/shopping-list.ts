import {Component} from '@angular/core';
import {ItemSliding, NavController, NavParams} from 'ionic-angular';
import {DetailItemPage} from './detail-item/detail-item';
import {ShoppingItem} from '../../entities/ShoppingItem';
import {ShoppingListProvider} from '../../providers/shopping-list/shopping-list';
import {ShoppingList} from '../../entities/ShoppingList';
import {Observable} from 'rxjs';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  newItemTitle: string;
  $shoppingList: Observable<ShoppingList>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private shoppingListProvider: ShoppingListProvider) {
  }

  ionViewDidLoad() {
    const tempUid = 'kN7tXRn9Imy72pvkF7cZ';
    this.$shoppingList = this.shoppingListProvider.getShoppingListByUid(tempUid);
  }

  /**
   * React on user adding item to list
   */
  addItem() {
    // Create new item from input
    // const newItem: ShoppingItem = {
    //   title: this.newItemTitle,
    //   checked: false,
    //   quantity: 1,
    // };

    // Add item to list
    //TODO ALH: Reimplement
    // this.$items.push(newItem);

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
    // const indexOfItemToRemove = this.$items.findIndex(item => item === item);
    // TODO ALH: Reimplement
    // this.$items.splice(indexOfItemToRemove, 1);
    // Close slider for nice UX!
    slidingItem.close();
  }
}
