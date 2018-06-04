import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CategoryProvider} from '../../../providers/categories/category';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';
import {ReorderIndexes} from 'ionic-angular/umd/components/item/item-reorder';
import {LocationWithSortedCategories} from '../../../entities/LocationWithSortedCategories';
import {ShoppingList} from '../../../entities/ShoppingList';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';

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

  currentLocation: LocationWithSortedCategories;
  currentShoppingList: ShoppingList;

  $locationWithSortedCategories;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private shoppingListProvider: ShoppingListProvider) {
    this.currentLocation = navParams.get('location');
    this.currentShoppingList = navParams.get('shoppingList');
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
    this.categoryProvider.updatelocationSortedCategory(locationWithSortedCategories)
      .then(() => {
        // Rearrange the shopping list
        this.shoppingListProvider.rearrangeShoppingListCategories(this.currentShoppingList, locationWithSortedCategories);
      });
  }

}
