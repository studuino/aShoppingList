import {Injectable} from '@angular/core';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {

  private CATEGORIES_COLLECTION = 'categories';

  constructor(private afs: AngularFirestore) {
    console.log('Hello CategoryProvider Provider');
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
   * Return all category names
   */
  getCategories() {
    return this.afs.collection<ShoppingCategory>(this.CATEGORIES_COLLECTION).valueChanges();
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
