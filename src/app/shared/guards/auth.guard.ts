import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ModuleRoutes } from '../../routing/ModuleRoutes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  async canActivate(): Promise<boolean> {
    const loggedIn = this.authService.isAuthenticated();

    if (!loggedIn) {
      console.log('Not authenticated');
      this.router.navigateByUrl(ModuleRoutes.LOGIN);
    }

    return loggedIn;
  }

}
