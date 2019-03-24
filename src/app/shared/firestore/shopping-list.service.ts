import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingList } from '../../entities/ShoppingList';
import { map } from 'rxjs/operators';
import { ShoppingCart } from '../../entities/ShoppingCart';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private SHOPPING_LISTS_COLLECTION = 'shoppingLists';
  public currentItem: ShoppingItem;
  public currentCategory: ShoppingCategory;

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

  /**
   * Update provided shopping list on firestore
   */
  updateShoppingList(shoppingList: ShoppingList) {
    return this.afs.collection(this.SHOPPING_LISTS_COLLECTION)
      .doc(shoppingList.uid)
      .set(shoppingList, {merge: true});
  }

  /**
   * Sum total price of items in each category in shopping list
   */
  calculateShoppingListTotal(shoppingList: ShoppingList): number {
    let total = 0;
    // Check for instantiation
    if (shoppingList.categories) {
      shoppingList.categories.forEach(category => {
        if (category.items) {
          category.items.forEach(item => {
            // Check if item has a price
            if (item.price) {
              // Increase total
              total += (item.price * item.quantity);
            }
          });
        }
      });
    }
    return total;
  }

  /**
   * Calculate and return total of shopping cart
   */
  calculateCartTotal(shoppingCart: ShoppingCart) {
    // Defensive programming
    if (!Array.isArray(shoppingCart.items)) {
      return;
    }
    let total = 0;
    // Sum up total
    shoppingCart.items
      .forEach(item =>
        total += (item.price * item.quantity));
    return total;
  }

  removeItemFromItemList(categoryToRemoveItemFrom: ShoppingItem[], item: ShoppingItem) {
    // Locate index of item in cart
    const indexOfItemInCart = categoryToRemoveItemFrom.indexOf(item);
    // Remove item from cart
    categoryToRemoveItemFrom.splice(indexOfItemInCart, 1);
  }
}
