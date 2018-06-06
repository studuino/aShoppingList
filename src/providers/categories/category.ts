import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import {ShoppingCart} from '../../entities/ShoppingCart';
import {ShoppingCategory} from '../../entities/ShoppingCategory';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {

  private CATEGORIES_COLLECTION = 'categories';
  private LOCATION_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get all categories from userUid
   * @param {string} userUid
   * @return {Observable<any[]>}
   */
  getCategoriesByUserUid(userUid: string) {
    return this.afs.collection(`${this.CATEGORIES_COLLECTION}`,
      ref => ref.where('userUid', '==', userUid)
        .orderBy('title')).valueChanges();
  }

  /**
   * Get location sorted categories by user uid
   * @param {string} userUid
   * @return {Observable<LocationWithSortedCategories[]>}
   */
  getlocationsWithSortedCategoriesByUserUid(userUid: string): Observable<LocationWithSortedCategories[]> {
    return this.afs.collection<LocationWithSortedCategories>(this.LOCATION_SORTED_CATEGORIES_COLLECTION,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Create new category for user
   * @param {string} userUid
   * @param {string} nameOfNewCategory
   * @return {Promise<void>}
   */
  createCategoryForUserUid(userUid: string, nameOfNewCategory: string) {
    const newUid = this.afs.createId();
    const newCategory: ShoppingCategory = {
      uid: newUid,
      userUid: userUid,
      title: nameOfNewCategory
    };
    return this.afs.doc(`${this.CATEGORIES_COLLECTION}/${newUid}`)
      .set(newCategory)
      .then(() => {
        return newCategory;
      });
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
   * Get location with sorted categories by location name
   * @return {Observable<any>}
   * @param defaultLocationUid
   */
  getLocationWithSortedCategoriesByUid(defaultLocationUid: string) {
    return this.afs.collection(this.LOCATION_SORTED_CATEGORIES_COLLECTION)
      .doc<LocationWithSortedCategories>(defaultLocationUid).valueChanges();
  }

  /**
   * Update location with sorted categories
   * @param locationWithSortedCategories
   * @return {Promise<void>}
   */
  updateLocationWithSortedCategories(locationWithSortedCategories: LocationWithSortedCategories) {
    return this.afs.collection(this.LOCATION_SORTED_CATEGORIES_COLLECTION)
      .doc(locationWithSortedCategories.uid)
      .set(locationWithSortedCategories, {merge: true});
  }
}
