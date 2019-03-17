/**
 * Generated class for the ShoppingListOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { Component } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { CategoryProvider } from '../../services/categories/category';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ShoppingListProvider } from '../../services/shopping-list/shopping-list';
import { AlertProvider } from '../../services/alert/alert';
import { Observable } from 'rxjs';
import { SharedShoppingListProvider } from '../../services/shared-shopping-list/shared-shopping-list';
import { LocationWithSortedCategoriesProvider } from '../../services/location-with-sorted-categories/location-with-sorted-categories';
import { AuthService } from '../../services/auth/auth';
import { map, switchMap, take } from 'rxjs/operators';
import { ModuleRouteNames } from '../../module-route.names';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListRouteNames } from '../shopping-list-route.names';


@Component({
  selector: 'page-shopping-list-options',
  templateUrl: 'shopping-list-options.html',
  styleUrls: ['shopping-list-options.scss']
})
export class ShoppingListOptionsPage {

  locationTitle: string;
  userUid: string;
  shoppingListCallBack: ShoppingListCallback;
  currentShoppingList: ShoppingList;
  $userHasMoreThanOneShoppingList: Observable<boolean>;
  userIsOwnerOfShoppingList: boolean;

  constructor(public nav: Router,
              public navParams: ActivatedRoute,
              private popoverCtrl: PopoverController,
              private authProvider: AuthService,
              private alertProvider: AlertProvider,
              private loadingController: LoadingController,
              private shoppingListProvider: ShoppingListProvider,
              private sharedShoppingListProvider: SharedShoppingListProvider,
              private locationWithSortedCategoriesProvider: LocationWithSortedCategoriesProvider,
              private categoryProvider: CategoryProvider) {
  }

  async ionViewDidEnter() {
    // Get parsed data
    // TODO ALH: Fix!
    // this.locationTitle = this.navParams.snapshot.paramMap.get('locationTitle');
    // this.navParams.data.toPromise().then((data: ShoppingListCallback) => this.shoppingListCallBack = data);
    // this.navParams.data.toPromise().then((data: ShoppingList) => this.currentShoppingList = data);
    // Get current userid
    this.userUid = await this.authProvider.getCurrentAuthUid();
    // Set observable value, to decide if user should be able to delete current shopping list
    this.$userHasMoreThanOneShoppingList = this.shoppingListProvider.getAmountOfShoppingListsByUserUid(this.userUid)
      .pipe(map(amount => amount > 1));
    // Check if user is owner of list
    this.userIsOwnerOfShoppingList = this.currentShoppingList.userUid === this.userUid;
  }

  /**
   * Logout user
   */
  logout() {
    this.nav.navigateByUrl(ModuleRouteNames.LOGIN);
    this.shoppingListCallBack.onLogout();
  }

  /**
   * Navigate user to manage categories
   */
  navigateToManageLocationSortedCategories() {
    this.nav.navigate([ModuleRouteNames.SHOPPING_LIST + ShoppingListRouteNames.LOCATION],
      {
        queryParams: {
          locationTitle: this.locationTitle,
          shoppingList: this.currentShoppingList
        }
      })
      .then(() => this.popoverCtrl.dismiss());
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
      .then(() => this.popoverCtrl.dismiss());
  }

  /**
   * Prompt user for name of new Shopping List
   */
  async promptUserForNewShoppingList() {
    const prompt = await this.alertProvider.getInputAlert(
      'New Shopping List',
      'Enter a new name for this new Shopping List',
      {
        text: 'Create',
        handler: data => {
          // Get new category name from user input data
          const newTitle = data.title;
          this.popoverCtrl.dismiss();
          this.createShoppingList(newTitle);
        }
      });
    prompt.present();
  }

  /***
   * Create new shoping list
   */
  private async createShoppingList(newTitle: string) {
    const loading = await this.loadingController.create({
      message: 'Loading new Shopping List..',
      backdropDismiss: true
    });
    loading.present();

    this.shoppingListProvider.createShoppingList(this.userUid, newTitle, this.currentShoppingList.defaultLocationUid)
      .then(uid => {
        // Notify about creation
        this.shoppingListCallBack.onListCreated(uid);
        loading.dismiss();
      });
  }

  /**
   * Prompt user to delete current shopping list
   */
  async promptUserToDeleteShoppingList() {
    const prompt = await this.alertProvider.getConfirmAlert(
      'Delete Shopping List',
      'Please confirm that you want to delete the Shopping List',
      {
        text: 'Delete',
        handler: data => {
          // On user confirmation, delete!
          this.popoverCtrl.dismiss();
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
    // TODO ALH: Fix!
    // this.nav.push(ManageShoppingListPage, {
    //   shoppingList: this.currentShoppingList
    // });
    // this.popoverCtrl.dismiss();
  }

  /**
   * Prompt user to leave shared shopping list
   */
  async promptToLeaveShoppingList() {
    const prompt = await this.alertProvider.getConfirmAlert(
      'Leave Shared Shopping List',
      'Are you certain that you want to leave the shopping list?',
      {
        text: 'Leave',
        handler: data => {
          // On user confirmation, delete!
          this.popoverCtrl.dismiss();
          // Notify listener
          this.shoppingListCallBack.onListLeft(this.currentShoppingList.uid, this.userUid);
        }
      }
    );
    prompt.present();
  }

  /**
   * Prompt user to create new location
   */
  async promptToCreateNewLocation() {
    this.popoverCtrl.dismiss();
    const newLocationPrompt = await this.alertProvider.getInputAlert(
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
   */
  private createNewLocation(title: string) {
    this.categoryProvider.getCategoriesByUserUid(this.currentShoppingList.userUid)
      .pipe(take(1))
      .pipe(switchMap(categories => {
        return this.locationWithSortedCategoriesProvider
          .createLocationWithSortedCategoriesForUser(this.userUid, title, categories);
      })).toPromise()
      .then(async () => {
        const locationConfirm = await this.alertProvider.getConfirmAlert(
          'Location Created!',
          'Your new location is now available',
          {
            text: 'OK'
          }
        );
        locationConfirm.present();
      });
  }

  /**
   * Prompt user for new title for location
   */
  async promptNewTitleForLocation() {
    this.popoverCtrl.dismiss();
    const renamePrompt = await this.alertProvider.getInputAlert(
      'Rename Location',
      'Please provide new title for location',
      {
        text: 'Rename',
        handler: data => {
          this.renameLocation(data.title);
        }
      }
    );
    renamePrompt.present();
  }

  /**
   * Rename title of location
   */
  private renameLocation(title: string) {
    this.shoppingListCallBack.onLocationRename(title);
  }

  /**
   *
   */
  async promptToDeleteLocation() {
    this.popoverCtrl.dismiss();
    (await this.alertProvider.getConfirmAlert(
      'Delete Location',
      'Warning, this cannot be undone!',
      {
        text: 'Delete',
        handler: data => {
          this.deleteLocation();
        }
      })).present();
  }

  /**
   * React to user deleting location
   */
  private deleteLocation() {
    this.shoppingListCallBack.onLocationDeleted();
  }
}
