import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
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
  shoppingListCallBack: ShoppingListCallback;
  currentShoppingList: ShoppingList;
  $userHasMoreThanOneShoppingList: Observable<boolean>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private authProvider: AuthProvider,
              private alertProvider: AlertProvider,
              private loadingController: LoadingController,
              private shoppingListProvider: ShoppingListProvider) {
    this.shoppingListCallBack = this.navParams.get('callback');
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
          this.viewCtrl.dismiss();
          this.createShoppingList(newTitle);
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
    const loading = this.loadingController.create({
      content: 'Loading new Shopping List..',
      dismissOnPageChange: true
    });
    loading.present();
    this.shoppingListProvider.createShoppingList(this.userUid, newTitle, this.currentShoppingList.defaultLocationUid)
      .then(uid => {
        // Notify about creation
        this.shoppingListCallBack.onListCreated(uid);
        loading.dismissAll();
      });
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
          this.viewCtrl.dismiss();
          this.shoppingListCallBack.onListDeleted();
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

  /**
   * Prompt user for new name of current shopping list
   */
  promptUserToRenameShoppingList() {
    let prompt = this.alertProvider.getInputAlert(
      'Rename Shopping List',
      'Enter a new name for the Shopping List',
      {
        text: 'Rename',
        handler: data => {
          // Get new category name from user input data
          const newTitle = data.title;
          this.viewCtrl.dismiss();
          this.renameShoppingList(newTitle);
        }
      });
    prompt.present();
  }

  /**
   * Update shopping list with new title in firestore
   * @param {string} newTitle
   */
  private renameShoppingList(newTitle: string) {
    this.currentShoppingList.title = newTitle;
    this.shoppingListProvider.updateShoppingList(this.currentShoppingList);
  }
}
