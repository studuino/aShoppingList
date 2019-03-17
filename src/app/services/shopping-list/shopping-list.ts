import {Injectable} from '@angular/core';
import {ShoppingList} from '../../entities/ShoppingList';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {LocationWithSortedCategories} from '../../entities/LocationWithSortedCategories';
import {ShoppingCart} from '../../entities/ShoppingCart';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable(
    { providedIn: 'root' }
)
export class ShoppingListProvider {

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
        ref.where('userUid', '==', userUid)
          .orderBy('title', 'asc')).valueChanges();
  }

  /**
   * Load shopping list from firestore by uid
   */
  getShoppingListByUid(uid: string) {
    return this.afs.doc<ShoppingList>(`${this.SHOPPING_LISTS_COLLECTION}/${uid}`).valueChanges();
  }

  /**
   * Get first shopping list from user
   */
  getFirstShoppingListByUserUid(userUid: string): Observable<ShoppingList> {
    return this.afs.collection<ShoppingList>(this.SHOPPING_LISTS_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)
          .orderBy('title', 'asc')).valueChanges()
      .pipe(map(shoppingLists => shoppingLists[0]));
  }

  /**
   * Get amount of shopping lists
   */
  getAmountOfShoppingListsByUserUid(userUid: string): Observable<number> {
    return this.afs.collection<ShoppingList>(this.SHOPPING_LISTS_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)
          .orderBy('title', 'asc')).valueChanges()
      .pipe(map(shoppingLists => {
        return shoppingLists.length;
      }));
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
    if (!Array.isArray(shoppingCart.items)) { return; }
    let total = 0;
    // Sum up total
    shoppingCart.items
      .forEach(item =>
        total += (item.price * item.quantity));
    return total;
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
   * Rearrange list of categories in provided list, by order from location with sorted categories
   */
  rearrangeShoppingListCategories(currentShoppingList: ShoppingList, locationWithSortedCategories: LocationWithSortedCategories) {
    // Instantiate new sorted array
    const sortedArray: ShoppingCategory[] = [];
    const uncategorized = currentShoppingList.categories
      .find(category => category.title === 'Uncategorized');
    sortedArray.push(uncategorized);
    locationWithSortedCategories.sortedCategories
    // For each category in sorted array
      .forEach(sortedCategory => {
        // Check for category for current index
        const categoryInCurrentList = currentShoppingList.categories
          .find(category => category.title === sortedCategory.title);
        // If the category is in the shopping list
        if (categoryInCurrentList) {
          // Add to the sorted array
          sortedArray.push(categoryInCurrentList);
        }
      });
    currentShoppingList.categories = sortedArray;
    // Update shopping list on firestore
    this.updateShoppingList(currentShoppingList);
  }

  /***
   * Create new shopping list in firestore
   * @return Uid of new list as {Promise<string>}
   */
  createShoppingList(userUid: string, newTitle: string, defaultLocationUid: string): Promise<string> {
    // Create UUID for document
    const newUid = this.afs.createId();
    // Create new shopping list
    const newShoppingList: ShoppingList = {
      uid: newUid,
      userUid: userUid,
      defaultLocationUid: defaultLocationUid,
      title: newTitle,
      cart: {
        items: []
      },
      categories: [
        {
          title: 'Uncategorized',
          items: []
        }
      ]
    };
    // Add new shopping list to firestore
    return this.afs.firestore.collection(this.SHOPPING_LISTS_COLLECTION)
      .doc(newUid)
      .set(newShoppingList)
      .then(() => {
        // Return uid of new list
        return newUid;
      });
  }

  /**
   * Delete shopping list, by provided uid from firestore
   */
  deleteShoppingListByUid(uid: string) {
    return this.afs.firestore.collection(this.SHOPPING_LISTS_COLLECTION).doc(uid)
      .delete();
  }
}
