import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {SharedShoppingList} from '../../entities/SharedShoppingList';
import {ShoppingList} from '../../entities/ShoppingList';
import {ShoppingUser} from '../../entities/auth/ShoppingUser';

@Injectable()
export class SharedShoppingListProvider {

  private SHARED_SHOPPING_LIST_COLLECTION = 'sharedShoppingLists';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get shared shopping lists for current user
   * @param {string} userUid
   * @return {Observable<SharedShoppingList[]>}
   */
  getSharedShoppingListForUserUid(userUid: string) {
    return this.afs.collection<SharedShoppingList>(this.SHARED_SHOPPING_LIST_COLLECTION,
      ref =>
        ref.where('sharedUserUid', '==', userUid)).valueChanges();
  }

  /**
   * Get all shared instances of provided shopping list
   * @param {string} shoppingListUid
   * @return {Observable<SharedShoppingList[]>}
   */
  getSharedShoppingListsByShoppingListUid(shoppingListUid: string) {
    return this.afs.collection<SharedShoppingList>(this.SHARED_SHOPPING_LIST_COLLECTION,
      ref =>
    ref.where('uid', '==', shoppingListUid)).valueChanges();
  }

  /**
   * Create shared shopping list
   * @param shoppingUser
   * @param shoppingListToShare
   */
  createSharedShoppingList(shoppingUser: ShoppingUser, shoppingListToShare: ShoppingList) {
    const newSharedList: SharedShoppingList = {
      uid: shoppingListToShare.uid,
      title: shoppingListToShare.title,
      userUid: shoppingListToShare.userUid,
      sharedUserEmail: shoppingUser.email,
      sharedUserUid: shoppingUser.uid
    };
    return this.afs.collection(this.SHARED_SHOPPING_LIST_COLLECTION)
      .add(newSharedList);
  }
}
