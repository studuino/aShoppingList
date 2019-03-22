import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly AUTHENTICATED_TOKEN = 'authenticated';
  private static readonly NOT_AUTHENTICATED_STRING = 'false';
  private static readonly AUTHENTICATED_STRING = 'true';

  constructor(private afAuth: AngularFireAuth) {
  }

  isAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem(AuthService.AUTHENTICATED_TOKEN) === AuthService.AUTHENTICATED_STRING;

    if (isAuthenticated) {
      localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.AUTHENTICATED_STRING);
    } else {
      localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.NOT_AUTHENTICATED_STRING);
    }
    return isAuthenticated;
  }

  async login(credentials: { password: string; email: string }): Promise<any> {
    const response = await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .catch(error => Promise.reject(error));

    if (response.user != null) {
      localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.AUTHENTICATED_STRING);
      return Promise.resolve();
    }
  }

  logout(): Promise<any> {
    localStorage.setItem(AuthService.AUTHENTICATED_TOKEN, AuthService.NOT_AUTHENTICATED_STRING);
    return this.afAuth.auth.signOut();
  }
}
