import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {LocationSortedCategoriesPage} from '../location-sorted-categories/location-sorted-categories';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
    this.locationTitle = navParams.get('location');
  }

  ionViewDidLoad() {
  }

  /**
   * Navigate user to manage categories
   */
  navigateToManageLocationSortedCategories() {
    this.navCtrl.push(LocationSortedCategoriesPage,
      {
        location: this.locationTitle
      })
      .then(() => this.viewCtrl.dismiss());
  }
}
