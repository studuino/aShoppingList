import {Injectable} from '@angular/core';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable(
    { providedIn: 'root' }
)
export class LocationWithSortedCategoriesProvider {

  private LOCATION_WITH_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Create a new location with sorted categories for user
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
   */
  renameLocation(uid: string, newTitle: string) {
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(uid)
      .set({title: newTitle}, {merge: true});
  }

  /**
   * Remove location from firestore
   */
  deleteLocation(uid: string) {
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(uid)
      .delete();
  }
}
