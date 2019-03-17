import {Injectable} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingItem } from '../../entities/ShoppingItem';

@Injectable(
    { providedIn: 'root' }
)
export class ItemsProvider {

  private ITEM_COLLECTION = 'items';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Search for existing item
   */
  search(userUid: string, itemTitle: string): Observable<ShoppingItem[]> {
    return this.afs.collection<ShoppingItem>(this.ITEM_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)
          .where('title', '==', itemTitle)).valueChanges();
  }

}
