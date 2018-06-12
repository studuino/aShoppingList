import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {LocationSortedCategoriesPage} from '../location-sorted-categories/location-sorted-categories';
import {ShoppingList} from '../../../entities/ShoppingList';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {AuthProvider} from '../../../providers/auth/auth';

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
  currentShoppingList: ShoppingList;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private authProvider: AuthProvider,
              private shoppingListProvider: ShoppingListProvider) {
    this.locationTitle = navParams.get('locationTitle');
    this.currentShoppingList = navParams.get('shoppingList');
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
}
