import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {LocationSortedCategoriesPage} from '../location-sorted-categories/location-sorted-categories';
import {ShoppingList} from '../../../entities/ShoppingList';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {AuthProvider} from '../../../providers/auth/auth';
import {AlertProvider} from '../../../providers/alert/alert';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the ShoppingListOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-shopping-list-options',
  templateUrl: 'shopping-list-options.html',
})
export class ShoppingListOptionsPage {

  locationTitle: string;
  userUid: string;
  currentShoppingList: ShoppingList;
  $userHasMoreThanOneShoppingList: Observable<boolean>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private authProvider: AuthProvider,
              private alertProvider: AlertProvider,
              private shoppingListProvider: ShoppingListProvider) {
    this.locationTitle = navParams.get('locationTitle');
    this.currentShoppingList = navParams.get('shoppingList');
    this.userUid = this.authProvider.getCurrentAuthUid();
    this.$userHasMoreThanOneShoppingList = this.shoppingListProvider.getAmountOfShoppingListsByUserUid(this.userUid)
      .map(amount => amount > 1);
  }

  ionViewDidLoad() {
  }

  /**
   * Logout user
   */
  logout() {
    this.authProvider.logout()
      .then(() => {
        this.navCtrl.push('LoginPage')
      });
  }

  /**
   * Navigate user to manage categories
   */
  navigateToManageLocationSortedCategories() {
    this.navCtrl.push(LocationSortedCategoriesPage,
      {
        locationTitle: this.locationTitle,
        shoppingList: this.currentShoppingList
      })
      .then(() => this.viewCtrl.dismiss());
  }

  emptyShoppingList() {
    this.currentShoppingList.categories
      .forEach(category => {
        category.items = [];
      });
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList)
      .then(() => this.viewCtrl.dismiss());
  }

  /**
   * Prompt user for name of new Shopping List
   */
  promptUserForNewShoppingList() {
    let prompt = this.alertProvider.getInputAlert(
      'New Shopping List',
      'Enter a new name for this new Shopping List',
      {
        text: 'Create',
        handler: data => {
          // Get new category name from user input data
          const newTitle = data.title;
          this.createShoppingList(newTitle)
        }
      });
    prompt.present();
  }

  /***
   * Create new shoping list
   * @param {string} userUid
   * @param {string} newTitle
   */
  private createShoppingList(newTitle: string) {
    this.shoppingListProvider.createShoppingList(this.userUid, newTitle, this.currentShoppingList.defaultLocationUid);
  }

  /**
   * Prompt user to delete current shopping list
   */
  promptUserToDeleteShoppingList() {
    let prompt = this.alertProvider.getConfirmAlert(
      'Delete Shopping List',
      'Please confirm that you want to delete the Shopping List',
      {
        text: 'Delete',
        handler: data => {
          // On user confirmation, delete!
          // TODO ALH: Verify that this isn't the only shopping list!
          // TODO ALH: Switch to another shopping list!
          this.deleteShoppingList(this.currentShoppingList.uid);
        }
      }
    );
    prompt.present();
  }

  /**
   * Delete current shopping list
   * @param {string} uid
   */
  private deleteShoppingList(uid: string) {
    this.shoppingListProvider.deleteShoppingListByUid(uid);
  }
}
