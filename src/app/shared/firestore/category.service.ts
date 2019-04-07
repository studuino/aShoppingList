import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private CATEGORIES_COLLECTION = 'categories';
  private LOCATION_SORTED_CATEGORIES_COLLECTION = 'locationSortedCategories';
  public UNCATEGORIZED_TITLE = 'Uncategorized';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get all categories from userUid
   */
  getCategoriesByUserUid(userUid: string) {
    return this.afs.collection<ShoppingCategory>(`${this.CATEGORIES_COLLECTION}`,
      ref => ref.where('userUid', '==', userUid)
        .orderBy('title')).valueChanges();
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

  /**
   * Get category from item
   */
  getCategoryFromItem(shoppingList: ShoppingList, item: ShoppingItem): ShoppingCategory {
    // If category is not uncategorized
    if (item.categoryUid !== this.UNCATEGORIZED_TITLE) {
      return shoppingList.categories
        .find(category => category.uid === item.categoryUid);
    } else {
      // Locate uncategorized in array
      return this.getUncategorizedCategoryFromShoppingList(shoppingList);
    }
  }

  /**
   * Create new category for user
   */
  createCategory(userUid: string, nameOfNewCategory: string) {
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
}
