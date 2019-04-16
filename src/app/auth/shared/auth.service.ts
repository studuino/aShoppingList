import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreUser } from '../../entities/FirestoreUser';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly AUTHENTICATED_TOKEN = 'authenticated';

  constructor(private afAuth: AngularFireAuth) {
  }

  isAuthenticated(): boolean {
    const authenticated: string = localStorage.getItem(AuthService.AUTHENTICATED_TOKEN);
    const isAuthenticated =
      authenticated !== null &&
      authenticated !== '';

    if (!isAuthenticated) {
      localStorage.clear();
    }
    return isAuthenticated;
  }

  getUserUid(): string {
    return localStorage.getItem(AuthService.AUTHENTICATED_TOKEN);
  }

  async login(credentials: { password: string, email: string }): Promise<any> {
    const response: UserCredential = await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .catch(error => Promise.reject(error));

    if (response.user != null) {
      localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, response.user.uid);
      return Promise.resolve();
    }
  }

  logout(): Promise<any> {
    localStorage.clear();
    return this.afAuth.auth.signOut();
  }

  registerWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Convert current auth user to typesafe user
   */
  getUser() {
    const user: FirestoreUser = {
      email: this.afAuth.auth.currentUser.email
    };
    return user;
  }

  /**
   * Delete current user from firestore
   */
  deleteAccount() {
    return this.afAuth.auth.currentUser.delete();
  }
}
