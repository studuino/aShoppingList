import { Injectable } from '@angular/core';
import { ShoppingUser } from '../../entities/auth/ShoppingUser';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable(
    {providedIn: 'root'}
)
export class UserProvider {

    USER_COLLECTION = 'users';

    constructor(private afs: AngularFirestore) {
    }

    /**
     * Check if user exists by email
     */
    checkForRegisteredUserByEmail(email: string): Observable<ShoppingUser> {
        return this.afs.collection<ShoppingUser>(this.USER_COLLECTION,
            ref =>
                ref.where('email', '==', email))
            .valueChanges()
            .pipe(take(1))
            .pipe(map(users => users[0]));
    }

}
