import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { ShoppingList } from '../../entities/ShoppingList';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private LOCATION_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';
  private UNCATEGORIZED_TITLE = 'Uncategorized';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get location sorted categories by user uid
   */
  getLocationsWithSortedCategoriesByUserUid(userUid: string): Observable<LocationWithSortedCategories[]> {
    return this.afs.collection<LocationWithSortedCategories>(this.LOCATION_SORTED_CATEGORIES_COLLECTION,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Find and return the category UNCATEGORIZED
   */
  getUncategorizedCategoryFromShoppingList(currentShoppingList: ShoppingList) {
    return currentShoppingList.categories
      .find(category => category.title === this.UNCATEGORIZED_TITLE);
  }
}
