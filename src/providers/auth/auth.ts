import {Injectable} from '@angular/core';
import {LoginCredentials} from '../../entities/auth/LoginCredentials';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {User} from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(private fireAuth: AngularFireAuth) {
  }

  /**
   * Login user
   * @param {LoginCredentials} loginCredentials
   * @return {Promise<any>}
   */
  login(loginCredentials: LoginCredentials): Promise<any> {
    return this.fireAuth.auth.signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password);
  }

  /**
   * Logout user
   * @return {Promise<any>}
   */
  logout(): Promise<any> {
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
  userIsLoggedIn(): Observable<boolean> {
    return this.fireAuth.authState
      .take(1)
      .map(auth => auth !== null);
  }

  /**
   * Return current user uid
   * @return {string}
   */
  getCurrentAuthUid() {
    return this.fireAuth.auth.currentUser.uid;
  }

  getCurrentUser(): Observable<User> {
    return this.fireAuth.authState;
  }

  /**
   * Delete current user from firestore
   * @return {Promise<any>}
   */
  deleteAccount() {
    return this.fireAuth.auth.currentUser.delete();
  }
}
