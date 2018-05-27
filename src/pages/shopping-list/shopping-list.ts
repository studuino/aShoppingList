import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DetailItemPage} from './detail-item/detail-item';
import {ShoppingItem} from '../../entities/ShoppingItem';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
  newItemTitle: string;
  icons: string[];
  items: Array<ShoppingItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 4; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'Note for item #' + i,
        quantity: Math.floor(Math.random() * this.items.length) + 1,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
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
      icon: 'beer',
      quantity: 1,
    };
    // Add item to list
    this.items.push(newItem);
    console.log(`Added ${newItem.title}!`);
    // Reset newItemTitle
    this.newItemTitle = null;
  }

  /**
   * User tapped on item in list
   * @param event
   * @param item
   */
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(DetailItemPage, {
      item: item
    });
  }
}
