import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ShoppingUser} from '../../entities/auth/ShoppingUser';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserProvider {

  USER_COLLECTION = 'users';

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Check if user exists by email
   * @param {string} email
   * @return {Observable<ShoppingUser>}
   */
  checkForRegisteredUserByEmail(email: string): Observable<ShoppingUser> {
    return this.afs.collection<ShoppingUser>(this.USER_COLLECTION,
      ref =>
    ref.where('email', '==', email))
      .valueChanges()
      .take(1)
      .map(users => users[0]);
  }

}
