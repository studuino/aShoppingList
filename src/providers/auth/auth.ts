import {Injectable} from '@angular/core';
import {LoginCredentials} from '../../entities/auth/LoginCredentials';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore) {
  }

  /**
   * Login user
   * @param {LoginCredentials} loginCredentials
   * @return {Promise<any>}
   */
  login(loginCredentials: LoginCredentials): Promise<any> {
    // TODO ALH: Consider less aggressive approach
    // Enable network to sync with firestore again
    this.afs.firestore.enableNetwork();
    return this.fireAuth.auth.signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password);
  }

  /**
   * Logout user
   * @return {Promise<any>}
   */
  logout(): Promise<any> {
    // TODO ALH: Consider less aggressive approach
    // Disable network to avoid "missing or insufficient permission error from firestore"
    this.afs.firestore.disableNetwork();
    return this.fireAuth.auth.signOut();
  }

  /**
   * Register new user
   * @param {LoginCredentials} registerCredentials
   * @return {Promise<any>}
   */
  registerWithEmailAndPassword(registerCredentials: LoginCredentials): Promise<any> {
    return this.fireAuth.auth.createUserWithEmailAndPassword(registerCredentials.email, registerCredentials.password);
  }

  /**
   * Check if user is logged in
   * @return {boolean}
   */
  userIsLoggedIn() {
    return this.fireAuth.auth.currentUser !== null;
  }

  /**
   * Return current user uid
   * @return {string}
   */
  getCurrentAuthUid() {
    return this.fireAuth.auth.currentUser.uid;
  }
}
