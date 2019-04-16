import { Injectable } from '@angular/core';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { AngularFirestore } from '@angular/fire/firestore';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationWithSortedCategoriesService {

  private LOCATION_WITH_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get location sorted categories by user uid
   */
  getAll(userUid: string): Observable<LocationWithSortedCategories[]> {
    return this.afs.collection<LocationWithSortedCategories>(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Update location with sorted categories
   */
  update(locationWithSortedCategories: LocationWithSortedCategories) {
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(locationWithSortedCategories.uid)
      .update(locationWithSortedCategories);
  }

  /**
   * Add provided category to all locations from user
   */
  addCategoryToAllLocations(userUid: string, category: ShoppingCategory) {
    // Get hold of all locations
    this.getAll(userUid)
    // Ensure to close subscription
      .pipe(first())
      // Add new category to each location
      .pipe(map(locations => {
        locations.forEach(location => {
          // Create new partial category
          const partialCategory: ShoppingCategory = {
            uid: category.uid,
            title: category.title
          };
          location.sortedCategories.push(partialCategory);
          // Update firestore
          this.update(location);
        });
      })).subscribe();
  }

  /**
   * Remove provided category to all locations from user
   */
  removeCategoryFromAllLocations(userUid: string, category: ShoppingCategory) {
    // Get hold of all locations
    this.getAll(userUid)
    // Ensure to close subscription
      .pipe(first())
      // Add new category to each location
      .pipe(map(locations => {
        locations.forEach(location => {
          // Locate category
          const index = location.sortedCategories.findIndex((sortedCategory: ShoppingCategory) => sortedCategory.uid === category.uid);
          // Category exists
          if (index !== -1) {
            // Remove it from array
            location.sortedCategories.splice(index, 1);
            // Update firestore
            this.update(location);
          }
        });
      })).subscribe();
  }

  /**
   * Rename category by category uid in all locations by user uid
   */
  renameCategoryInAllLocations(userUid: string, categoryUid: string, newTitle: string) {
    // Get hold of all locations
    this.getAll(userUid)
    // Ensure to close subscription
      .pipe(first())
      // Add new category to each location
      .pipe(map(locations => {
        locations.forEach(location => {
          // Locate category
          const category: ShoppingCategory = location.sortedCategories
            .find((sortedCategory: ShoppingCategory) => sortedCategory.uid === categoryUid);
          // Category exists
          if (category) {
            // Remove it from array
            category.title = newTitle;
            // Update firestore
            this.update(location);
          }
        });
      })).subscribe();
  }

  /**
   * Create a new location with sorted categories for user
   */
  async create(userUid: string, title: string, categories: ShoppingCategory[]): Promise<LocationWithSortedCategories> {
    const newUid = this.afs.createId();
    const newLocationWithSortedCategories: LocationWithSortedCategories = {
      uid: newUid,
      userUid: userUid,
      title: title,
      sortedCategories: categories
    };
    await this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(newUid)
      .set(newLocationWithSortedCategories);

    return await this.get(newUid)
      .pipe(first())
      .toPromise();
  }

  /**
   * Get Location by uid
   */
  get(uid: string): Observable<LocationWithSortedCategories> {
    return this.afs.doc<LocationWithSortedCategories>(`${this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION}/${uid}`)
      .valueChanges();
  }

  /**
   * Delete location from firestore
   */
  delete(uid: string) {
    return this.afs.collection(this.LOCATION_WITH_SORTED_CATEGORIES_COLLECTION)
      .doc(uid)
      .delete();
  }
}
