import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private ITEM_COLLECTION = 'items';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Search for existing item
   */
  searchForPreviousItem(userUid: string, itemTitle: string): Observable<ShoppingItem[]> {
    return this.afs.collection<ShoppingItem>(this.ITEM_COLLECTION,
      ref =>
        // Get all users previous added items
        ref.where('userUid', '==', userUid)).valueChanges()
    // Filter for new item being typed
      .pipe(map(items =>
        items.filter(item => item.title.toLowerCase().includes(itemTitle.toLowerCase()))));
  }

  /**
   * Add item to collection for user
   */
  add(userUid: string, selectedItem: ShoppingItem) {
    const newItemUid = this.afs.createId();

    const partialItem = {
      categoryUid: selectedItem.categoryUid,
      checked: false,
      price: selectedItem.price,
      quantity: 1,
      title: selectedItem.title,
      uid: newItemUid,
      userUid: userUid
    };

    return this.afs.doc(`${this.ITEM_COLLECTION}/${newItemUid}`)
      .set(partialItem, {merge: true});
  }
}
