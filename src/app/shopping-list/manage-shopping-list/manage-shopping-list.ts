import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedShoppingList } from '../../entities/SharedShoppingList';
import { UserProvider } from '../../services/user/user';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListProvider } from '../../services/shopping-list/shopping-list';
import { SharedShoppingListProvider } from '../../services/shared-shopping-list/shared-shopping-list';
import { AlertProvider } from '../../services/alert/alert';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-manage-shopping-list',
  templateUrl: 'manage-shopping-list.html',
  styleUrls: ['manage-shopping-list.scss']
})
export class ManageShoppingListPage {

  $shoppingListSharedWith: Observable<SharedShoppingList[]>;

  shoppingList: ShoppingList;
  inviteEmail = '';

  constructor(private navParams: ActivatedRoute,
              private alertProvider: AlertProvider,
              private shoppingListProvider: ShoppingListProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider,
              private userProvider: UserProvider) {
    navParams.data.toPromise().then((data: ShoppingList) => this.shoppingList = data);

    this.$shoppingListSharedWith = this.sharedShoppingListProvider.getSharedShoppingListsByShoppingListUid(this.shoppingList.uid);
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
      .subscribe(async registeredUser => {
        if (registeredUser) {
          this.sharedShoppingListProvider.createSharedShoppingList(registeredUser, this.shoppingList);
        } else {
          const userNotRegistered = await this.alertProvider.getConfirmAlert(
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

  /**
   * Prompt user to confirm removing selected user
   */
  async promptToRemoveUserFromList(sharedShoppingList: SharedShoppingList) {
    (await this.alertProvider.getConfirmAlert(
      'Remove user from list',
      `Please confirm the removal of ${sharedShoppingList.sharedUserEmail}!`,
      {
        text: 'Remove',
        handler: data => {
          this.removeUserFromList(sharedShoppingList.uid);
        }
      })).present();
  }

  /**
   * Remove user from shared shopping list
   */
  private removeUserFromList(sharedShoppingListUid: string) {
    this.sharedShoppingListProvider.removeSharedShoppingList(sharedShoppingListUid);
  }
}
