import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private LOCATION_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get location sorted categories by user uid
   */
  getlocationsWithSortedCategoriesByUserUid(userUid: string): Observable<LocationWithSortedCategories[]> {
    return this.afs.collection<LocationWithSortedCategories>(this.LOCATION_SORTED_CATEGORIES_COLLECTION,
      ref => ref.where('userUid', '==', userUid)).valueChanges();
  }
}
