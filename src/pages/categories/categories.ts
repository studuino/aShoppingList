import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CategoryProvider} from '../../providers/categories/category';
import {AlertProvider} from '../../providers/alert/alert';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {ShoppingListProvider} from '../../providers/shopping-list/shopping-list';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  $categories;
  userUid = 'fprXH7XZKsWEa0T5TrAv';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private shoppingListProvider: ShoppingListProvider,
              private alertProvider: AlertProvider) {
  }

  ionViewDidLoad() {
    this.$categories = this.categoryProvider.getCategoriesByUserUid(this.userUid);
  }

  /**
   * Prompt user for new category name
   */
  promptForNewCategory() {
    let prompt = this.alertProvider.getAlert(
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
    this.categoryProvider.createCategoryForUserUid(this.userUid, nameOfNewCategory)
      .then((newCategory: ShoppingCategory) => {
        // TODO ALH: Consider moving to cloud functions!
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
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
   * Change name of category
   * @param categoryUid
   * @param newTitleForCategory
   */
  renameCategory(categoryUid: string, newTitleForCategory) {
    this.categoryProvider.renameCategory(categoryUid, newTitleForCategory)
      .then(() => {
        // TODO ALH: Consider moving to cloud functions!
        // Remove category from all user locations
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
          .take(1)
          // Map to locations
          .map(locationsWithSortedCategories => {
            locationsWithSortedCategories
            // For each location
              .forEach(location => {
                location.sortedCategories
                // For each sorted category
                  .forEach(sortedCategory => {
                    // Check if the category is the one we're removing
                    if (sortedCategory.categoryUid === categoryUid) {
                      // Rename category
                      sortedCategory.title = newTitleForCategory;
                      return;
                    }
                  });
                // Update location on firestore
                this.categoryProvider.updateLocationWithSortedCategories(location);
              });
          })
          // Remove category from all user shopping lists (if items in category, place in uncategorized!)
          .switchMap(() => {
            return this.shoppingListProvider.getPartialshoppingLists()
              .take(1)
              // Map to shopping lists
              .map(shoppingLists => {
                shoppingLists
                // For each shopping list
                  .forEach(shoppingList => {
                    shoppingList
                      .categories
                      // For each category in list
                      .forEach(category => {
                        // If the category matches categoryToRemove
                        if (category.uid === categoryUid) {
                          // Rename category
                          category.title = newTitleForCategory;
                        }
                      });
                    // Update shopping list
                    this.shoppingListProvider.updateShoppingList(shoppingList);
                  })
              })
          })
          .subscribe()
      });
  }

  /**
   * Prompt user for rename
   * @param {ShoppingCategory} category
   */
  promptForCategoryRename(category: ShoppingCategory) {
    let prompt = this.alertProvider.getAlert(
      'Change Category Title',
      'Enter a new name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const newTitle = data.title;
          this.renameCategory(category.uid, newTitle)
        }
      });
    prompt.present();
  }

  /**
   * Remove category from user
   * @param {ShoppingCategory} categoryToRemove
   */
  removeCategory(categoryToRemove: ShoppingCategory) {
    this.categoryProvider.deleteCategoryByUid(categoryToRemove.uid)
      .then(() => {
        // TODO ALH: Consider moving to cloud functions!
        // Remove category from all user locations
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
          .take(1)
          // Map to locations
          .map(locationsWithSortedCategories => {
            locationsWithSortedCategories
            // For each location
              .forEach(location => {
                location.sortedCategories
                // For each sorted category
                  .forEach(sortedCategory => {
                    // Check if the category is the one we're removing
                    if (sortedCategory.categoryUid === categoryToRemove.uid) {
                      // Find index to remove
                      const indexOfSortedCategoryToRemove = location.sortedCategories.indexOf(sortedCategory);
                      // Remove category
                      location.sortedCategories.splice(indexOfSortedCategoryToRemove, 1);
                      return;
                    }
                  });
                // Update location on firestore
                this.categoryProvider.updateLocationWithSortedCategories(location);
              });
          })
          // Remove category from all user shopping lists (if items in category, place in uncategorized!)
          .switchMap(() => {
            return this.shoppingListProvider.getPartialshoppingLists()
              .take(1)
            // Map to shopping lists
              .map(shoppingLists => {
                shoppingLists
                // For each shopping list
                  .forEach(shoppingList => {
                    shoppingList
                      .categories
                      // For each category in list
                      .forEach(category => {
                        // If the category matches categoryToRemove
                        if (category.uid === categoryToRemove.uid) {
                          category.items
                          // Add each item in category to the uncategorized category
                            .forEach(item => {
                              // Locate uncategorized category
                              const uncategorized = this.categoryProvider.getUncategorizedCategoryFromShoppingList(shoppingList);
                              // Add item
                              uncategorized.items.push(item);
                            });
                          // Locate category to remove
                          const indexOfCategory = shoppingList.categories.indexOf(category);
                          // Remove category
                          shoppingList.categories.splice(indexOfCategory, 1);
                        }
                      });
                    // Update shopping list
                    this.shoppingListProvider.updateShoppingList(shoppingList);
                  })
              })
          })
          .subscribe()
      });
  }
}
