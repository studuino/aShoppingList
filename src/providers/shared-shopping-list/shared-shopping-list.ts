import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {SharedShoppingList} from '../../entities/SharedShoppingList';

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

}
