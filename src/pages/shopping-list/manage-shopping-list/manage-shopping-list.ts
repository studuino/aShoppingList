import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {ShoppingList} from '../../../entities/ShoppingList';

/**
 * Generated class for the ManageShoppingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-manage-shopping-list',
  templateUrl: 'manage-shopping-list.html',
})
export class ManageShoppingListPage {

  shoppingList: ShoppingList;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private shoppingListProvider: ShoppingListProvider) {
    this.shoppingList = navParams.get('shoppingList');
  }

  ionViewDidLoad() {
  }

  /**
   * Update shopping list with new title in firestore
   * @param shoppingList
   */
  private renameShoppingList() {
    this.shoppingListProvider.updateShoppingList(this.shoppingList);
  }

}
