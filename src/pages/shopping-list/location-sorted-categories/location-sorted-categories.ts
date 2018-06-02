import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CategoryProvider} from '../../../providers/categories/category';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {ReorderIndexes} from 'ionic-angular/umd/components/item/item-reorder';

/**
 * Generated class for the LocationSortedCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-location-sorted-categories',
  templateUrl: 'location-sorted-categories.html',
})
export class LocationSortedCategoriesPage {

  currentLocation;
  $locationWithSortedCategories;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider) {
    this.currentLocation = navParams.get('location');
  }

  ionViewDidLoad() {
    this.$locationWithSortedCategories = this.categoryProvider.getLocationWithSortedCategoriesByName(this.currentLocation.title);
  }

  /**
   * Update order of items in in category
   * @param {ReorderIndexes} indexes
   * @param {ShoppingCategory} locationWithSortedCategories
   */
  updateListOrder(indexes: ReorderIndexes, locationWithSortedCategories) {
    // Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
    locationWithSortedCategories.sortedCategories.splice(
      indexes.to, 0, // Index we're moving to
      locationWithSortedCategories.sortedCategories.splice(indexes.from, 1)[0]); // Item we are moving (splice returns array of removed items!)
    // Send updated list to firestore!
    this.categoryProvider.updatelocationSortedCategory(locationWithSortedCategories);
  }


}
