import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingList } from '../../entities/ShoppingList';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private SHOPPING_LISTS_COLLECTION = 'shoppingLists';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get all shopping lists with just title and uid
   * for later specific querying
   */
  getPartialShoppingListsByUserUid(userUid: string): Observable<ShoppingList[]> {
    return this.afs.collection<ShoppingList>(this.SHOPPING_LISTS_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)).valueChanges();
  }

  /**
   * Get first shopping list from user
   */
  getFirstShoppingListByUserUid(userUid: string): Observable<ShoppingList> {
    return this.afs.collection<ShoppingList>(this.SHOPPING_LISTS_COLLECTION,
      ref => ref
        .where('userUid', '==', userUid)
        .orderBy('title', 'asc'))
      .valueChanges()
      .pipe(map(shoppingLists => shoppingLists[0]));
  }
}
