import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ShoppingList} from '../../entities/ShoppingList';

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
    return this.afs.doc<ShoppingList>(`${this.SHOPPING_LISTS_COLLECTION}/${uid}`).valueChanges()
  }

  /**
   * Get all shopping lists
   * @returns {Observable<ShoppingList[]>}
   */
  getShoppingLists() {
    return this.afs.collection<ShoppingList>(`${this.SHOPPING_LISTS_COLLECTION}`,
      ref => ref.orderBy('title')).valueChanges();
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
}
