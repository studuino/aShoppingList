import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {ShoppingItem} from '../../entities/ShoppingItem';

@Injectable()
export class ItemsProvider {

  private ITEM_COLLECTION = 'items';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Search for existing item
   * @param userUid
   * @param {string} itemTitle
   * @return {Observable<ShoppingItem[]>}
   */
  search(userUid: string, itemTitle: string): Observable<ShoppingItem[]> {
    return this.afs.collection<ShoppingItem>(this.ITEM_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)
          .where('title', '==', itemTitle)).valueChanges();
  }

}
