import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly AUTHENTICATED_TOKEN = 'authenticated';
  private static readonly NOT_AUTHENTICATED_STRING = 'false';

  constructor(private afAuth: AngularFireAuth) {
  }

  isAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem(AuthService.AUTHENTICATED_TOKEN) !== AuthService.NOT_AUTHENTICATED_STRING;

    if (!isAuthenticated) {
      localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.NOT_AUTHENTICATED_STRING);
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
    localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.NOT_AUTHENTICATED_STRING);
    return this.afAuth.auth.signOut();
  }
}
