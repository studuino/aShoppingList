import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {LocationSortedCategoriesPage} from '../location-sorted-categories/location-sorted-categories';
import {ShoppingList} from '../../../entities/ShoppingList';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {AuthProvider} from '../../../providers/auth/auth';
import {AlertProvider} from '../../../providers/alert/alert';
import {Observable} from 'rxjs/Observable';
import {ManageShoppingListPage} from '../manage-shopping-list/manage-shopping-list';
import {SharedShoppingListProvider} from '../../../providers/shared-shopping-list/shared-shopping-list';
import {CategoryProvider} from '../../../providers/categories/category';
import {LocationWithSortedCategoriesProvider} from '../../../providers/location-with-sorted-categories/location-with-sorted-categories';

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
  userIsOwnerOfShoppingList: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private authProvider: AuthProvider,
              private alertProvider: AlertProvider,
              private loadingController: LoadingController,
              private shoppingListProvider: ShoppingListProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider,
              private locationWithSortedCategoriesProvider: LocationWithSortedCategoriesProvider,
              private categoryProvider: CategoryProvider) {
    // Get parsed data
    this.shoppingListCallBack = this.navParams.get('callback');
    this.locationTitle = navParams.get('locationTitle');
    this.currentShoppingList = navParams.get('shoppingList');
    // Get current userid
    this.userUid = this.authProvider.getCurrentAuthUid();
    // Set observable value, to decide if user should be able to delete current shopping list
    this.$userHasMoreThanOneShoppingList = this.shoppingListProvider.getAmountOfShoppingListsByUserUid(this.userUid)
      .map(amount => amount > 1);
    //Check if user is owner of list
    this.userIsOwnerOfShoppingList = this.currentShoppingList.userUid === this.userUid;
  }

  ionViewDidLoad() {
  }

  /**
   * Logout user
   */
  logout() {
    this.viewCtrl.dismiss();
    this.shoppingListCallBack.onLogout();
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

  /**
   * Clear out the items in current shopping list
   */
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
   * Navigate to manage shopping list page
   */
  manageShoppingList() {
    this.navCtrl.push(ManageShoppingListPage, {
      shoppingList: this.currentShoppingList
    });
    this.viewCtrl.dismiss();
  }

  /**
   * Prompt user to leave shared shopping list
   */
  promptToLeaveShoppingList() {
    let prompt = this.alertProvider.getConfirmAlert(
      'Leave Shared Shopping List',
      'Are you certain that you want to leave the shopping list?',
      {
        text: 'Leave',
        handler: data => {
          // On user confirmation, delete!
          this.viewCtrl.dismiss();
          // Notify listener
          this.shoppingListCallBack.onListLeft(this.currentShoppingList.uid, this.userUid);
        }
      }
    );
    prompt.present();
  }

  /**
   *
   */
  promptToCreateNewLocation() {
    this.viewCtrl.dismiss();
    const newLocationPrompt = this.alertProvider.getInputAlert(
      'Title of new location',
      'Please provide a title for new location',
      {
        text: 'Create',
        handler: data => {
          this.createNewLocation(data.title);
        }
      }
    );
    newLocationPrompt.present();
  }

  /**
   * Create new location for user with provided title
   * @param {string} title
   */
  private createNewLocation(title: string) {
    this.categoryProvider.getCategoriesByUserUid(this.currentShoppingList.userUid)
      .take(1)
      .switchMap(categories => {
        return this.locationWithSortedCategoriesProvider
          .createLocationWithSortedCategoriesForUser(this.userUid, title, categories)
      }).toPromise()
      .then(() => {
        const locationConfirm = this.alertProvider.getConfirmAlert(
          'Location Created!',
          'Your new location is now available',
          {
            text: 'OK'
          }
        );
        locationConfirm.present();
      });
  }
}
