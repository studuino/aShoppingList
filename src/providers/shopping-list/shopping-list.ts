import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ShoppingList} from '../../entities/ShoppingList';
import {Observable} from 'rxjs/Observable';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import {ShoppingCart} from '../../entities/ShoppingCart';

/*
  Generated class for the ShoppingListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingListProvider {

  private SHOPPING_LISTS_COLLECTION = 'shoppingLists';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Load shopping list from firestore by uid
   * @param {string} uid
   * @returns {Observable<ShoppingList | undefined>}
   */
  getShoppingListByUid(uid: string) {
    return this.afs.doc<ShoppingList>(`${this.SHOPPING_LISTS_COLLECTION}/${uid}`).valueChanges();
  }

  /**
   * Get all shopping lists with just title and uid
   * for later specific querying
   * @returns {Observable<ShoppingList[]>}
   */
  getPartialshoppingLists(): Observable<ShoppingList[]> {
    return this.afs.collection<ShoppingList>(`${this.SHOPPING_LISTS_COLLECTION}`,
      ref =>
        ref.orderBy('title', 'asc')).valueChanges();
  }

  /**
   * Sum total price of items in each category in shopping list
   * @returns {number}
   */
  calculateShoppingListTotal(shoppingList: ShoppingList): number {
    let total = 0;
    // Check for instantiation
    if (shoppingList.categories) {
      shoppingList.categories.forEach(category => {
        if (category.items) {
          category.items.forEach(item => {
            // Check if item has a price
            if (item.price) {
              // Increase total
              total += (item.price * item.quantity);
            }
          })
        }
      });
    }
    return total;
  }

  /**
   * Calculate and return total of shopping cart
   * @param {ShoppingCart} shoppingCart
   */
  calculateCartTotal(shoppingCart: ShoppingCart) {
    // Defensive programming
    if(!Array.isArray(shoppingCart.items)) return;
    let total: number = 0;
    // Sum up total
    shoppingCart.items
      .forEach(item =>
        total += (item.price * item.quantity));
    return total;
  }

  /**
   * Update provided shopping list on firestore
   * @param {ShoppingList} shoppingList
   * @return {Promise<void>}
   */
  updateShoppingList(shoppingList: ShoppingList) {
    return this.afs.doc(`${this.SHOPPING_LISTS_COLLECTION}/${shoppingList.uid}`)
      .set(shoppingList, {merge: true});
  }

  /**
   * Rearrange list of categories in provided list, by order from location with sorted categories
   * @param {ShoppingList} currentShoppingList
   * @param {LocationWithSortedCategories} locationWithSortedCategories
   */
  rearrangeShoppingListCategories(currentShoppingList: ShoppingList, locationWithSortedCategories: LocationWithSortedCategories) {
    // Instantiate new sorted array
    const sortedArray: ShoppingCategory[] = [];
    const uncategorized = currentShoppingList.categories
      .find(category => category.title === 'Uncategorized');
    sortedArray.push(uncategorized);
    locationWithSortedCategories.sortedCategories
    // For each category in sorted array
      .forEach(sortedCategory => {
        // Check for category for current index
        const categoryInCurrentList = currentShoppingList.categories
          .find(category => category.title === sortedCategory.title);
        // If the category is in the shopping list
        if (categoryInCurrentList) {
          // Add to the sorted array
          sortedArray.push(categoryInCurrentList);
        }
      });
    currentShoppingList.categories = sortedArray;
    // Update shopping list on firestore
    this.updateShoppingList(currentShoppingList);
  }
}
