import { Component } from '@angular/core';
import { CategoryProvider } from '../services/categories/category';
import { AuthService } from '../services/auth/auth';
import { ShoppingListProvider } from '../services/shopping-list/shopping-list';
import { AlertProvider } from '../services/alert/alert';
import { ShoppingCategory } from '../entities/ShoppingCategory';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
  styleUrls: ['categories.scss']
})
export class CategoriesPage {

  $categories;
  userUid;

  constructor(private categoryProvider: CategoryProvider,
              private authProvider: AuthService,
              private shoppingListProvider: ShoppingListProvider,
              private alertProvider: AlertProvider) {
  }

  ionViewDidEnter() {
    this.userUid = this.authProvider.getCurrentAuthUid();
    this.$categories = this.categoryProvider.getCategoriesByUserUid(this.userUid);
  }

  /**
   * Prompt user for new category name
   */
  async promptForNewCategory() {
    const prompt = await this.alertProvider.getInputAlert(
      'New Category',
      'Enter a name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const nameOfNewCategory = data.title;
          this.createCategory(nameOfNewCategory);
        }
      });
    prompt.present();
  }

  /**
   * Create a new category
   */
  createCategory(nameOfNewCategory: string) {
    this.categoryProvider.createCategoryForUserUid(this.userUid, nameOfNewCategory)
      .then((newCategory: ShoppingCategory) => {
        // TODO ALH: Consider moving to cloud functions!
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
          .pipe(take(1))
          // Map to locations
          .pipe(map(locationsWithSortedCategories => {
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
          })).subscribe();
      });
  }

  /**
   * Change name of category
   */
  renameCategory(categoryUid: string, newTitleForCategory: string) {
    this.categoryProvider.renameCategory(categoryUid, newTitleForCategory)
      .then(() => {
        // TODO ALH: Consider moving to cloud functions!
        // Remove category from all user locations
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
          .pipe(take(1))
          // Map to locations
          .pipe(map(locationsWithSortedCategories => {
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
          }))
          // Remove category from all user shopping lists (if items in category, place in uncategorized!)
          .pipe(switchMap(() => {
            return this.shoppingListProvider.getPartialShoppingListsByUserUid(this.userUid)
              .pipe(take(1))
              // Map to shopping lists
              .pipe(map(shoppingLists => {
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
                  });
              }));
          })).subscribe();
      });
  }

  /**
   * Prompt user for rename
   */
  async promptForCategoryRename(category: ShoppingCategory) {
    const prompt = await this.alertProvider.getInputAlert(
      'Change Category Title',
      'Enter a new name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const newTitle = data.title;
          this.renameCategory(category.uid, newTitle);
        }
      });
    prompt.present();
  }

  /**
   * Remove category from user
   */
  removeCategory(categoryToRemove: ShoppingCategory) {
    this.categoryProvider.deleteCategoryByUid(categoryToRemove.uid)
      .then(() => {
        // TODO ALH: Consider moving to cloud functions!
        // Remove category from all user locations
        this.categoryProvider.getlocationsWithSortedCategoriesByUserUid(this.userUid)
          .pipe(take(1))
          // Map to locations
          .pipe(map(locationsWithSortedCategories => {
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
          }))
          // Remove category from all user shopping lists (if items in category, place in uncategorized!)
          .pipe(switchMap(() => {
            return this.shoppingListProvider.getPartialShoppingListsByUserUid(this.userUid)
              .pipe(take(1))
              // Map to shopping lists
              .pipe(map(shoppingLists => {
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
                  });
              }));
          })).subscribe();
      });
  }
}
