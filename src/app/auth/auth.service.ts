import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {

  }

  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  login(credentials: { password: string; email: string }): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
