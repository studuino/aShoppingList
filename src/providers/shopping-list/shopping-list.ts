import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ShoppingList} from '../../entities/ShoppingList';
import {ShoppingCategory} from '../../entities/ShoppingCategory';

/*
  Generated class for the ShoppingListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingListProvider {

  private SHOPPING_LISTS_COLLECTION = 'shoppingLists';
  private CATEGORIES_COLLECTION = 'categories';

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
   * Get Categories by shopping list uid
   * @param {string} shoppingListUid
   * @returns {Observable<ShoppingCategory[]>}
   */
  getCategoriesByShoppingListUid(shoppingListUid: string) {
    return this.afs.collection<ShoppingCategory>(this.CATEGORIES_COLLECTION,
      ref => ref.where('shoppingListUid', '==', shoppingListUid)).valueChanges()
  }

  /**
   * Add item to provided category
   * @param category
   */
  updateCategory(category: ShoppingCategory) {
    return this.afs.doc<ShoppingCategory>(`${this.CATEGORIES_COLLECTION}/${category.uid}`)
      .set(category, {merge: true});
  }
}
