import {Injectable} from '@angular/core';
import {SharedShoppingList} from '../../entities/SharedShoppingList';
import {ShoppingList} from '../../entities/ShoppingList';
import {ShoppingUser} from '../../entities/auth/ShoppingUser';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable(
    { providedIn: 'root' }
)
export class SharedShoppingListProvider {

  private SHARED_SHOPPING_LIST_COLLECTION = 'sharedShoppingLists';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get shared shopping lists for current user
   */
  getSharedShoppingListForUserUid(userUid: string) {
    return this.afs.collection<SharedShoppingList>(this.SHARED_SHOPPING_LIST_COLLECTION,
      ref =>
        ref.where('sharedUserUid', '==', userUid)).valueChanges();
  }

  /**
   * Get all shared instances of provided shopping list
   */
  getSharedShoppingListsByShoppingListUid(shoppingListUid: string) {
    return this.afs.collection<SharedShoppingList>(this.SHARED_SHOPPING_LIST_COLLECTION,
      ref =>
        ref.where('shoppingListUid', '==', shoppingListUid)).valueChanges();
  }

  /**
   * Create shared shopping list
   */
  createSharedShoppingList(shoppingUser: ShoppingUser, shoppingListToShare: ShoppingList) {
    const newUid = this.afs.createId();
    const newSharedList: SharedShoppingList = {
      uid: newUid,
      shoppingListUid: shoppingListToShare.uid,
      title: shoppingListToShare.title,
      userUid: shoppingListToShare.userUid,
      sharedUserEmail: shoppingUser.email,
      sharedUserUid: shoppingUser.uid
    };
    return this.afs.collection(this.SHARED_SHOPPING_LIST_COLLECTION)
      .doc(newUid)
      .set(newSharedList);
  }

  /**
   * Remove sharedShoppingList from firestore
   */
  leaveSharedShoppingList(sharedShoppingListUid: string, invitedUserUid: string) {
    return this.afs.firestore.collection(this.SHARED_SHOPPING_LIST_COLLECTION)
      .where('uid', '==', sharedShoppingListUid)
      .where('sharedUserUid', '==', invitedUserUid)
      .get()
      .then(querySnapshots => {
        return querySnapshots.docs[0].ref.delete();
      });
  }

  /**
   * Delete shared shopping list from firestore
   */
  removeSharedShoppingList(sharedShoppingListUid: string) {
    return this.afs.collection(this.SHARED_SHOPPING_LIST_COLLECTION)
      .doc(sharedShoppingListUid)
      .delete();
  }
}
