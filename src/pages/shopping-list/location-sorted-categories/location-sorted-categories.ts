import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CategoryProvider} from '../../../providers/categories/category';
import {ReorderIndexes} from 'ionic-angular/umd/components/item/item-reorder';
import {ShoppingList} from '../../../entities/ShoppingList';
import {ShoppingListProvider} from '../../../providers/shopping-list/shopping-list';
import {AlertProvider} from '../../../providers/alert/alert';
import {ShoppingCategory} from '../../../entities/ShoppingCategory';

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

  currentLocationTitle: string;
  currentShoppingList: ShoppingList;

  $locationWithSortedCategories;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private shoppingListProvider: ShoppingListProvider,
              private alertProvider: AlertProvider) {
    this.currentLocationTitle = navParams.get('locationTitle');
    this.currentShoppingList = navParams.get('shoppingList');
  }

  ionViewDidLoad() {
    this.$locationWithSortedCategories = this.categoryProvider.getLocationWithSortedCategoriesByName(this.currentLocationTitle);
  }

  /**
   * Prompt user for new category name
   */
  promptForNewCategory() {
    // TODO ALH: Duplicated in Categories.ts!
    let prompt = this.alertProvider.getInputAlert(
      'New Category',
      'Enter a name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const nameOfNewCategory = data.title;
          this.createCategory(nameOfNewCategory)
        }
      });
    prompt.present();
  }

  /**
   * Create a new category
   * @param {string} nameOfNewCategory
   */
  createCategory(nameOfNewCategory: string) {
    // TODO ALH: Duplicated in Categories.ts!
    this.categoryProvider.createCategoryForUserUid(this.currentShoppingList.userUid, nameOfNewCategory)
      .then((newCategory: ShoppingCategory) => {
        // TODO ALH: Consider moving to cloud functions!
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.currentShoppingList.userUid)
          .take(1)
          // Map to locations
          .map(locationsWithSortedCategories => {
            locationsWithSortedCategories
            // For each location
              .forEach(location => {
                // Create new sortedCategory with partial information
                const sortedCategory = {
                  categoryUid: newCategory.uid,
                  title: newCategory.title
                };
                // Push new category
                location.sortedCategories.push(sortedCategory);
                // Update location on firestore
                this.categoryProvider.updateLocationWithSortedCategories(location);
              });
          }).subscribe()
      });
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
    this.categoryProvider.updateLocationWithSortedCategories(locationWithSortedCategories)
      .then(() => {
        // Rearrange the shopping list
        this.shoppingListProvider.rearrangeShoppingListCategories(this.currentShoppingList, locationWithSortedCategories);
      });
  }

}
