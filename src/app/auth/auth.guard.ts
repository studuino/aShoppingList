import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getUser();
    const loggedIn = !!user;

    if (!loggedIn) {
      console.log('Not authenticated');
      this.router.navigate(['/login']);
    }

    return loggedIn;
  }

}
