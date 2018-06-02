import {Injectable} from '@angular/core';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {AngularFirestore} from 'angularfire2/firestore';
import {ShoppingList} from '../../entities/ShoppingList';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {

  private CATEGORIES_COLLECTION = 'categories';
  private CATEGORIES_WITH_ITEMS_COLLECTION = 'categoriesWithItems';
  private LOCATION_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get specific category by uid
   * @param categoryUid
   * @return {Observable<any>}
   */
  getCategoryWithItemsByUid(categoryUid) {
    return this.afs.collection(this.CATEGORIES_WITH_ITEMS_COLLECTION).doc<ShoppingCategory>(categoryUid).valueChanges();
  }

  /**
   * Get specific category by shoppingListUid & categoryUid
   * @return {Observable<ShoppingCategory>}
   * @param shoppingListUid
   * @param categoryTitle
   */
  getCategoryWithItemsByShoppingListUidAndCategoryTitle(shoppingListUid, categoryTitle: string) {
    return this.afs.collection<ShoppingCategory>(this.CATEGORIES_WITH_ITEMS_COLLECTION,
      ref =>
        ref.where('shoppingListUid', '==', shoppingListUid)
        .where('title', '==', categoryTitle)).valueChanges();
  }

  /**
   * Get all categories from userUid
   * @param {string} userUid
   * @return {Observable<any[]>}
   */
  getCategoriesByUserUid(userUid: string) {
    return this.afs.collection(`${this.CATEGORIES_COLLECTION}`,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Get Categories by shopping list uid
   * @param {string} shoppingListUid
   * @returns {Observable<ShoppingCategory[]>}
   */
  getCategoriesWithItemsByShoppingListUid(shoppingListUid: string) {
    return this.afs.collection<ShoppingCategory>(this.CATEGORIES_WITH_ITEMS_COLLECTION,
      ref =>
        ref.where('shoppingListUid', '==', shoppingListUid)).valueChanges()
  }

  /**
   * Get location sorted categories by user uid
   * @param {string} userUid
   * @return {Observable<any[]>}
   */
  getLocationSortedCategoriesByUserUid(userUid: string) {
    return this.afs.collection(this.LOCATION_SORTED_CATEGORIES_COLLECTION,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Add item to provided category
   * @param category
   */
  updateCategoryWithItems(category: ShoppingCategory) {
    return this.afs.doc<ShoppingCategory>(`${this.CATEGORIES_WITH_ITEMS_COLLECTION}/${category.uid}`)
      .set(category, {merge: true});
  }

  /**
   * Create new category
   * @param shoppingCategory
   */
  createCategoryWithItems(shoppingCategory: ShoppingCategory) {
    const newUid = this.afs.createId();
    return this.afs.doc<ShoppingCategory>(`${this.CATEGORIES_WITH_ITEMS_COLLECTION}/${newUid}`)
      .set({
        uid: newUid,
        shoppingListUid: shoppingCategory.shoppingListUid,
        title: shoppingCategory.title,
        items: shoppingCategory.items
      }, {merge: true});
  }

  /**
   * Create new category for user
   * @param {string} userUid
   * @param {string} nameOfNewCategory
   * @return {Promise<void>}
   */
  createCategoryForUserUid(userUid: string, nameOfNewCategory: string) {
    const newUid = this.afs.createId();
    return this.afs.doc(`${this.CATEGORIES_COLLECTION}/${newUid}`)
      .set({
        uid: newUid,
        userUid: userUid,
        title: nameOfNewCategory
      })
  }

  /**
   * Get location with sorted categories by location name
   * @param {string} title
   * @return {Observable<any>}
   */
  getLocationWithSortedCategoriesByName(title: string) {
    return this.afs.collection(this.LOCATION_SORTED_CATEGORIES_COLLECTION,
      ref =>
    ref.where('title', '==', title)).valueChanges()
      .map(locationSortedCategories => {
        return locationSortedCategories[0];
      });
  }

  /**
   * Update location with sorted categories
   * @param category
   * @return {Promise<void>}
   */
  updatelocationSortedCategory(category: any) {
    return this.afs.collection(this.LOCATION_SORTED_CATEGORIES_COLLECTION)
      .doc(category.uid)
      .set(category, {merge: true});
  }
}
