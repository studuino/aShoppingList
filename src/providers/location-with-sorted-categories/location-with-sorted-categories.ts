import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import {ShoppingCategory} from '../../entities/ShoppingCategory';

@Injectable()
export class LocationWithSortedCategoriesProvider {

  private LOCATION_WITH_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Create a new location with sorted categories for user
   * @param {string} userUid
   * @param {string} title
   * @param {ShoppingCategory[]} categories
   * @return {Promise<void>}
   */
  createLocationWithSortedCategoriesForUser(userUid: string, title: string, categories: ShoppingCategory[]) {
    const newUid = this.afs.createId();
    const newLocationWithSortedCategories: LocationWithSortedCategories = {
      uid: newUid,
      userUid: userUid,
      title: title,
      sortedCategories: categories
    };
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(newUid)
      .set(newLocationWithSortedCategories);
  }

  /**
   * Rename location on firestore
   * @param {string} uid
   * @param {string} newTitle
   */
  renameLocation(uid: string, newTitle: string) {
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(uid)
      .set({title: newTitle}, {merge: true});
  }
}
