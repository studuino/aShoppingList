import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {ShoppingList} from '../../../entities/ShoppingList';
import {SharedShoppingListProvider} from '../../../providers/shared-shopping-list/shared-shopping-list';
import {Observable} from 'rxjs/Observable';
import {SharedShoppingList} from '../../../entities/SharedShoppingList';
import {UserProvider} from '../../../providers/user/user';
import {AlertProvider} from '../../../providers/alert/alert';

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
              private alertProvider: AlertProvider,
              private shoppingListProvider: ShoppingListProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider,
              private userProvider: UserProvider) {
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
    // Check if email is a registered user
    this.userProvider.checkForRegisteredUserByEmail(this.inviteEmail)
      .subscribe(registeredUser => {
        console.log(registeredUser)
        if (registeredUser) {
          this.sharedShoppingListProvider.createSharedShoppingList(registeredUser, this.shoppingList);
        } else {
          const userNotRegistered = this.alertProvider.getConfirmAlert(
            'User not registered :(',
            'Sorry we do not have a user with this email, but we suggest you ask them to download our app!',
            {
              text: 'Will do!'
            });
          userNotRegistered.present();
        }
      });
    // Reset field
    this.inviteEmail = '';
  }

}
