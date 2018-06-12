import {Injectable} from '@angular/core';
import {LoginCredentials} from '../../entities/auth/LoginCredentials';
import {AngularFireAuth} from 'angularfire2/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(private fireAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
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
   * @return {Promise<boolean>}
   */
  logout(): Promise<boolean> {
    // TODO ALH: Fix
    return Promise.resolve(true);
  }
}
