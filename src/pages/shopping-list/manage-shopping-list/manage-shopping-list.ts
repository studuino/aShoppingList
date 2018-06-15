import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {ShoppingList} from '../../../entities/ShoppingList';
import {SharedShoppingListProvider} from '../../../providers/shared-shopping-list/shared-shopping-list';
import {Observable} from 'rxjs/Observable';
import {SharedShoppingList} from '../../../entities/SharedShoppingList';

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

  $shoppingListSharedWith: Observable<SharedShoppingList[]>;

  shoppingList: ShoppingList;
  inviteEmail = '';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private shoppingListProvider: ShoppingListProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider) {
    this.shoppingList = navParams.get('shoppingList');
    this.$shoppingListSharedWith = this.sharedShoppingListProvider.getSharedShoppingListsByShoppingListUid(this.shoppingList.uid);
  }

  ionViewDidLoad() {
  }

  /**
   * Update shopping list with new title in firestore
   */
  renameShoppingList() {
    this.shoppingListProvider.updateShoppingList(this.shoppingList);
  }

  /**
   * Invite user to list
   */
  inviteUser() {
    this.sharedShoppingListProvider.createSharedShoppingList(this.inviteEmail, this.shoppingList)
      .then(() => this.inviteEmail = '');
  }

}
