import { Injectable } from '@angular/core';
import { LoginCredentials } from '../../entities/auth/LoginCredentials';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

/*
  Generated class for the AuthService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable(
    { providedIn: 'root' }
)
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) {
  }

  /**
   * Login user
   */
  login(loginCredentials: LoginCredentials): Promise<any> {
    return this.fireAuth.auth.signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password);
  }

  /**
   * Logout user
   */
  logout(): Promise<any> {
    return this.fireAuth.auth.signOut();
  }

  /**
   * Register new user
   */
  registerWithEmailAndPassword(registerCredentials: LoginCredentials): Promise<any> {
    return this.fireAuth.auth.createUserWithEmailAndPassword(registerCredentials.email, registerCredentials.password);
  }

  /**
   * Check if user is logged in
   */
  userIsLoggedIn(): Observable<any> {
    return this.fireAuth.user;
  }

  /**
   * Return current user uid
   */
  getCurrentAuthUid() {
    return this.fireAuth.authState
      .pipe(map(user => user.uid))
      .toPromise();
  }

  getCurrentUser(): Observable<User> {
    return this.fireAuth.user;
  }

  /**
   * Delete current user from firestore
   */
  deleteAccount() {
    return this.fireAuth.auth.currentUser.delete();
  }
}
